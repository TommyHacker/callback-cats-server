const mongoose = require("mongoose");

const { MongoMemoryServer } = require("mongodb-memory-server");
let mongod = null;

const connectDB = async () => {
  try {
    let dbUrl =
      process.env.DATABASE_URL || "mongodb://localhost:27017/callbackcatsdb";
    if (process.env.NODE_ENV === "test") {
      mongod = await MongoMemoryServer.create();
      dbUrl = mongod.getUri();
    }

    const conn = await mongoose.connect(dbUrl);

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
};

module.exports = { connectDB, disconnectDB };
