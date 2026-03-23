const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs');

async function main() {
  // Simple .env parser
  if (!process.env.DATABASE_URL && fs.existsSync('.env')) {
    const env = fs.readFileSync('.env', 'utf-8');
    const match = env.match(/^DATABASE_URL=["']?(.+?)["']?$/m);
    if (match) process.env.DATABASE_URL = match[1];
  }

  if (!process.env.DATABASE_URL) {
    console.error("❌ Error: DATABASE_URL not found.");
    process.exit(1);
  }

  const client = new MongoClient(process.env.DATABASE_URL);
  let report = "--- Zionmeks Voter Resolution (Optimized Batch) ---\n\n";
  const log = (text) => {
    console.log(text);
    report += text + "\n";
  };

  try {
    log("🔌 Connecting to database...");
    await client.connect();
    const db = client.db();

    log("📂 Reading user IDs from your-list.txt...");
    const content = fs.readFileSync("your-list.txt", "utf-8");
    const idRegex = /userId:\s+([0-9a-zA-Z]{16,32})/g;
    const userIds = [...new Set([...content.matchAll(idRegex)].map(m => m[1]))];
    log(`📊 Extracted ${userIds.length} unique voter IDs.`);

    const objectIds = [];
    const stringIds = [];
    userIds.forEach(id => {
      if (id.length === 24 && /^[0-9a-fA-F]+$/.test(id)) {
        objectIds.push(new ObjectId(id));
      }
      stringIds.push(id);
    });

    // 1. Batch fetch from 'user' collection
    log("🔍 Batch fetching users...");
    const userDocs = await db.collection('user').find({
      $or: [
        { _id: { $in: objectIds } },
        { _id: { $in: stringIds } },
        { id: { $in: stringIds } }
      ]
    }).toArray();

    const userMap = new Map();
    userDocs.forEach(u => {
      userMap.set(u._id.toString(), { ...u, source: "USER_TABLE" });
      if (u.id) userMap.set(u.id, { ...u, source: "USER_TABLE" });
    });

    // 2. Batch fetch from 'account' collection for remainders
    const unresolvedIds = userIds.filter(id => !userMap.has(id));
    const unresolvedObjectIds = unresolvedIds.filter(id => id.length === 24).map(id => new ObjectId(id));

    log(`👥 Resolved ${userDocs.length} from User table. Checking ${unresolvedIds.length} in Account table...`);

    const accountDocs = await db.collection('account').find({
      $or: [
        { userId: { $in: unresolvedIds } },
        { userId: { $in: unresolvedObjectIds } }
      ]
    }).toArray();

    const accountMap = new Map();
    accountDocs.forEach(a => {
      const uid = a.userId.toString();
      accountMap.set(uid, {
        name: a.accountId,
        email: a.accountId,
        source: "ACCOUNT_TABLE"
      });
    });

    // 3. Assemble results in order
    const resolved = [];
    const failed = [];
    userIds.forEach(id => {
      const u = userMap.get(id) || accountMap.get(id);
      if (u) {
        resolved.push({ id, ...u });
      } else {
        failed.push(id);
      }
    });

    log(`✅ Final Resolution: ${resolved.length} successful, ${failed.length} failed.`);

    // 4. Duplicate Analysis
    const groups = {};
    resolved.forEach(u => {
      const nameStr = (u.name || u.email || "Unknown").toString();
      const normalized = nameStr.toLowerCase().trim().replace(/\s+\d+$/, "").replace(/\d+$/, "").trim();
      if (!groups[normalized]) groups[normalized] = [];
      groups[normalized].push(u);
    });

    const duplicates = Object.entries(groups).filter(([_, g]) => g.length > 1);
    log(`\n--- Found ${duplicates.length} Group(s) of Potential Duplicates ---`);
    
    duplicates.forEach(([name, g]) => {
      log(`\nGroup: "${name}" (${g.length} accounts)`);
      g.forEach(u => log(`  - [ID: ${u.id}] ${u.email}`));
    });

    // 5. Save a clean list of emails
    const emailList = resolved.map(r => r.email).filter(Boolean).join('\n');
    fs.writeFileSync("zionmeks_emails.txt", emailList);
    log(`\n✅ Saved ${resolved.length} emails to zionmeks_emails.txt`);

    // 6. Save a numbered list of emails with timestamps
    const numberedList = resolved.map((r, i) => {
      const date = r.createdAt && r.createdAt.getTime() !== 0 
        ? r.createdAt.toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
          }) 
        : "Unknown date";
      return `${(i + 1).toString().padStart(3, ' ')}. ${r.email.padEnd(35)} | Joined: ${date}`;
    }).join('\n');

    fs.writeFileSync("zionmeks_voters_list.txt", numberedList);
    log(`✅ Saved pretty numbered list with timestamps to zionmeks_voters_list.txt`);

    fs.writeFileSync("zionmeks_final_report.txt", report);
    console.log("\n✅ Saved complete report to zionmeks_final_report.txt");

  } catch (err) {
    console.error("❌ Fatal Error:", err);
  } finally {
    await client.close();
  }
}

main();
