import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/nmd-computer";
const client = new MongoClient(uri);

let cached: MongoClient | null = null;

export async function getDb() {
  if (!cached) cached = await client.connect();
  return cached.db();
}
