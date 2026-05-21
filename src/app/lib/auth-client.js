import { jwtClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.BETTER_AUTH_URL || "http://localhost:3000";
};

export const authClient = createAuthClient({
    baseURL: getBaseURL(),

    plugins:[
        jwtClient()
    ]
})
 
export const { signIn, signUp, useSession } = authClient;