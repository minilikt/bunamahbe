const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function main() {
  const client = new MongoClient(process.env.DATABASE_URL);
  const ids = ["69bf3daa2228bb822d124db4", "69c04cc8aea013cb554d1a1f"];
  
  try {
    await client.connect();
    const db = client.db();
    
    for (const id of ids) {
      console.log(`\n--- Searching for ID: ${id} ---`);
      
      try {
        const objId = new ObjectId(id);
        
        // 1. Check user collection
        const user = await db.collection('user').findOne({ _id: objId });
        if (user) {
          console.log("✅ Found in 'user' collection (as ObjectId):");
          console.log(`   Name: ${user.name}`);
          console.log(`   Email: ${user.email}`);
        } else {
          // Check as string just in case
          const userStr = await db.collection('user').findOne({ _id: id });
          if (userStr) {
            console.log("✅ Found in 'user' collection (as String):");
            console.log(`   Name: ${userStr.name}`);
            console.log(`   Email: ${userStr.email}`);
          } else {
            console.log("❌ Not found in 'user' collection.");
          }
        }
        
        // 2. Check account collection
        const account = await db.collection('account').findOne({ userId: id });
        if (account) {
          console.log("✅ Found in 'account' collection (userId as String):");
          console.log(`   Provider: ${account.providerId}`);
          console.log(`   AccountId: ${account.accountId}`);
        } else {
           const accountObj = await db.collection('account').findOne({ userId: objId });
           if (accountObj) {
             console.log("✅ Found in 'account' collection (userId as ObjectId):");
             console.log(`   Provider: ${accountObj.providerId}`);
             console.log(`   AccountId: ${accountObj.accountId}`);
           } else {
             console.log("❌ Not found in 'account' collection.");
           }
        }
      } catch (e) {
        console.error(`Invalid ID format: ${id}`, e.message);
      }
    }
  } finally {
    await client.close();
  }
}

main().catch(console.error);
