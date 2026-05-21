import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const globalForMongo = globalThis;

function getMongoUri() {
  return process.env.MONGO_URI || process.env.MONGODB_URI;
}

function isBuildPhase() {
  return process.env.NEXT_PHASE === "phase-production-build";
}

function getBetterAuthURL() {
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

async function connectToDatabase() {
  if (globalForMongo._mongoDb) {
    return {
      client: globalForMongo._mongoClient,
      db: globalForMongo._mongoDb,
    };
  }

  const uri = getMongoUri();
  if (!uri) {
    if (isBuildPhase()) {
      return { client: null, db: null };
    }
    throw new Error(
      "MONGO_URI or MONGODB_URI is not defined in environment variables"
    );
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 0,
  });

  await client.connect();
  const db = client.db(process.env.MONGODB_DB_NAME || "user");

  globalForMongo._mongoClient = client;
  globalForMongo._mongoDb = db;

  return { client, db };
}

let authInstance = null;

export async function getAuth() {
  if (authInstance) {
    return authInstance;
  }

  const { db } = await connectToDatabase();
  if (!db) {
    throw new Error(
      "Database is unavailable. Set MONGO_URI and avoid connecting during build."
    );
  }

  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("BETTER_AUTH_SECRET is required in production");
  }

  authInstance = betterAuth({
    secret: secret || "dev-only-change-me-in-production",
    baseURL: getBetterAuthURL(),
    trustedOrigins: [
      "http://localhost:3000",
      ...(process.env.BETTER_AUTH_URL ? [process.env.BETTER_AUTH_URL] : []),
      ...(process.env.VERCEL_URL
        ? [`https://${process.env.VERCEL_URL}`]
        : []),
      ...(process.env.NEXT_PUBLIC_APP_URL
        ? [process.env.NEXT_PUBLIC_APP_URL]
        : []),
    ],
    database: mongodbAdapter(db),
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
      cookieCache: {
        enabled: false,
      },
    },
    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: ["google"],
      },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      autoSignIn: true,
    },
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    },
    advanced: {
      cookiePrefix: "better-auth",
    },
  });

  return authInstance;
}
