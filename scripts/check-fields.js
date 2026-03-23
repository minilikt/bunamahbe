const { MongoClient } = require('mongodb');
require('dotenv').config();

async function main() {
  const client = new MongoClient(process.env.DATABASE_URL);
  
  try {
    await client.connect();
    const db = client.db();
    
    // Get one user record
    const user = await db.collection('user').findOne({});
    
    if (user) {
      console.log("--- Sample User Record Keys ---");
      console.log(Object.keys(user));
      console.log("\n--- ID Values ---");
      console.log("_id:", user._id);
      console.log("_id type:", typeof user._id);
      if (user._id.constructor) console.log("_id constructor:", user._id.constructor.name);
      
      console.log("id:", user.id);
      console.log("id type:", typeof user.id);
      
      if (user.id && user._id.toString() !== user.id.toString()) {
        console.log("\n⚠️ WARNING: _id and id have DIFFERENT values!");
      } else {
        console.log("\n✅ _id and id have the SAME value (string-wise).");
      }
    } else {
      console.log("No users found.");
    }

    // Now check for one specific ID from the list
    const targetId = "69c04cc8aea013cb554d1a1f";
    console.log(`\n--- Searching for ${targetId} ---`);
    const foundByIdField = await db.collection('user').findOne({ id: targetId });
    if (foundByIdField) {
      console.log("✅ Found by 'id' field matching target string.");
    } else {
      console.log("❌ Not found by 'id' field matching target string.");
    }

    const { ObjectId } = require('mongodb');
    try {
      const foundByUnderId = await db.collection('user').findOne({ _id: new ObjectId(targetId) });
      if (foundByUnderId) {
        console.log("✅ Found by '_id' field matching as ObjectId.");
      } else {
        console.log("❌ Not found by '_id' field matching as ObjectId.");
      }
    } catch (e) {
      console.log("Invalid ObjectId format for this target.");
    }

  } finally {
    await client.close();
  }
}

main().catch(console.error);
