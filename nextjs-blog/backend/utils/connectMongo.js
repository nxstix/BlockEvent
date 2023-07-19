const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const mongoose = require('mongoose');
require('dotenv').config();

const mongoConnection = process.env.MONGO_URI

async function connectMongo() {
  let db;
  if (!db) {
    await mongoose.connect(mongoConnection, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = mongoose.connection;
  } else {
    return db;
  }
}

async function closeMongo() {
  await mongoose.connection.close();
}

//clears all collections in the DB. Used for atomar testing.
async function clearMongo() {
  const collections = Object.values(mongoose.connection.collections);
  for (const collection of collections) {
    await collection.deleteMany({});
  }
}

module.exports = { connectMongo, closeMongo, clearMongo };
