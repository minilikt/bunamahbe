const { MongoClient } = require('mongodb');

async function main() {
  const client = new MongoClient(process.env.DATABASE_URL);
  try {
    await client.connect();
    const db = client.db();
    const user = await db.collection('user').findOne({});
    if (user) {
      console.log('User found:', user.name);
      console.log('ID:', user._id);
      console.log('ID Type:', typeof user._id);
      console.log('Is ObjectId:', user._id.constructor.name === 'ObjectId');
    } else {
      console.log('No users found.');
    }
  } finally {
    await client.close();
  }
}

main().catch(console.error);
