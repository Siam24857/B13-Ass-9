"use client";

import { createAuthClient } from "better-auth/react";

const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return (
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000"
  );
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

export const getAuthToken = async () => {
  try {
    const session = await authClient.getSession();
    return session?.data?.session?.token ?? null;
  } catch (error) {
    console.error("Error getting auth token:", error);
    return null;
  }
};

export const getAuthHeaders = async () => {
  const token = await getAuthToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
};

export const authenticatedFetch = async (url, options = {}) => {
  const headers = await getAuthHeaders();

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      ...options.headers,
    },
    credentials: "include",
  });

  if (response.status === 401) {
    const retrySession = await authClient.getSession({ fetchOptions: { cache: "no-store" } });
    const token = retrySession?.data?.session?.token;
    if (token) {
      return fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
        credentials: "include",
      });
    }
  }

  return response;
};

export const signIn = authClient.signIn;
export const signUp = authClient.signUp;
export const signOut = authClient.signOut;
export const useSession = authClient.useSession;
export const getSession = authClient.getSession;

export default authClient;
