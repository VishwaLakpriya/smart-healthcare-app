import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' }); // load your env; tests override some vars

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_please_change';
  process.env.JWT_EXPIRES = '1h';
  process.env.COOKIE_SECURE = 'false';

  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const c of collections) {
    await c.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  if (mongo) await mongo.stop();
});
