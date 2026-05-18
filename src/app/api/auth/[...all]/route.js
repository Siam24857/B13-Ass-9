
import { auth } from "@/app/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const { GET: authGet, POST: authPost } = toNextJsHandler(auth);

function sanitizeCookieHeader(cookieHeader) {
  if (!cookieHeader) return "";
  return cookieHeader
    .split("; ")
    .filter(cookie => {
      const parts = cookie.split("=");
      const name = parts[0];
      const value = parts.slice(1).join("=");
      
      // Match better-auth session_data or account_data cookies (including chunked and secure versions)
      const isAuthDataCookie = /^(?:__Secure-|__Host-)?better-auth\.(?:session_data|account_data)(?:\.\d+)?$/.test(name);
      
      if (isAuthDataCookie) {
        // Base64URL encoding used for compact session/account data must strictly contain [A-Za-z0-9_-]
        if (value && !/^[A-Za-z0-9_-]+$/.test(value)) {
          return false; // Drop malformed or incompatible cookie
        }
      }
      return true;
    })
    .join("; ");
}

export async function GET(request) {
  // Sanitize headers to remove any non-standard/Symbol keys
  const newHeaders = {};
  request.headers.forEach((value, key) => {
    if (key.toLowerCase() === "cookie") {
      newHeaders[key] = sanitizeCookieHeader(value);
    } else {
      newHeaders[key] = value;
    }
  });
  
  const cleanRequest = new Request(request.url, {
    method: request.method,
    headers: newHeaders,
  });
  
  return authGet(cleanRequest);
}

export async function POST(request) {
  // Sanitize headers to remove any non-standard/Symbol keys
  const newHeaders = {};
  request.headers.forEach((value, key) => {
    if (key.toLowerCase() === "cookie") {
      newHeaders[key] = sanitizeCookieHeader(value);
    } else {
      newHeaders[key] = value;
    }
  });
  
  const cleanRequest = new Request(request.url, {
    method: request.method,
    headers: newHeaders,
    body: request.body,
    duplex: 'half',
  });
  
  return authPost(cleanRequest);
}