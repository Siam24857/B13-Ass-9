import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
 
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI);

await client.connect();

const db = client.db("user");

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,

  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
  },
 session:{
   cookieCache:{
    enabled: true,
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60
   }
  },
  plugins:[
    jwt()
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
 
});