/**
 * Cloud Database Migration / Seeder Script
 * Usage:
 *   node seed_cloud_db.js "<YOUR_MONGODB_ATLAS_URI>"
 * Or:
 *   Set MONGO_URI in .env and run: node seed_cloud_db.js
 */

const mongoose = require("mongoose");
require("dotenv").config();

const targetUri = process.argv[2] || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/anurag_travels";

console.log("Connecting to target database:", targetUri.replace(/:([^@]+)@/, ":****@"));

async function seed() {
  try {
    const targetConn = await mongoose.connect(targetUri);
    console.log("Connected successfully to target database!");

    const targetDb = mongoose.connection.db;

    // Connect to local DB to fetch existing documents
    const localConn = await mongoose.createConnection("mongodb://127.0.0.1:27017/anurag_travels").asPromise();
    const localDb = localConn.getClient().db("anurag_travels");

    const collectionsToCopy = [
      "roles",
      "users",
      "bustypes",
      "buses",
      "routes",
      "schedules",
      "faqs",
      "offers",
      "subscribes"
    ];

    for (const colName of collectionsToCopy) {
      try {
        const localDocs = await localDb.collection(colName).find({}).toArray();
        if (localDocs.length > 0) {
          const targetCol = targetDb.collection(colName);
          const count = await targetCol.countDocuments();
          if (count === 0) {
            await targetCol.insertMany(localDocs);
            console.log(`Copied ${localDocs.length} documents into ${colName}`);
          } else {
            console.log(`Collection ${colName} already has ${count} documents. Skipping.`);
          }
        }
      } catch (colErr) {
        console.log(`Note for ${colName}:`, colErr.message);
      }
    }

    await localConn.close();
    console.log("\nAll essential cloud database collections are initialized and ready!");
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error.message);
    process.exit(1);
  }
}

seed();
