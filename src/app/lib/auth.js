import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
 
if (!uri) {
  throw new Error(" MONGO_URI is not defined in environment variables");
}

 
if (!global._mongoClientPromise) {
  const client = new MongoClient(uri);
  global._mongoClientPromise = client.connect();
}
 
const getClient = async () => {
  const client = await global._mongoClientPromise;
  return client;
};

const client = await getClient();
const db = client.db("user");

 
const getBetterAuthURL = () => {
  if (process.env.BETTER_AUTH_URL) {
    return process.env.BETTER_AUTH_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
};

export const auth = betterAuth({
  baseURL: getBetterAuthURL(),

  database: mongodbAdapter(db),

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  // session: {
  //   cookieCache: {
  //     enabled: true,
  //     maxAge: 7 * 24 * 60 * 60,
  //   },
  // },

  // plugins: [jwt()],

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
});