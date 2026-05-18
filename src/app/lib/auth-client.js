import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3000", // IMPORTANT
});

// destructure from SAME instance
export const { signIn, signOut, useSession } = authClient;