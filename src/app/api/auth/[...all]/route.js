import { getAuth } from "@/app/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

let handlersPromise = null;

async function getHandlers() {
  if (!handlersPromise) {
    handlersPromise = getAuth().then((auth) => toNextJsHandler(auth));
  }
  return handlersPromise;
}

function sanitizeCookieHeader(cookieHeader) {
  if (!cookieHeader) return "";
  return cookieHeader
    .split("; ")
    .filter((cookie) => {
      const parts = cookie.split("=");
      const name = parts[0];
      const value = parts.slice(1).join("=");

      const isAuthDataCookie =
        /^(?:__Secure-|__Host-)?better-auth\.(?:session_data|account_data)(?:\.\d+)?$/.test(
          name
        );

      if (isAuthDataCookie) {
        if (value && !/^[A-Za-z0-9_-]+$/.test(value)) {
          return false;
        }
      }
      return true;
    })
    .join("; ");
}

function buildCleanRequest(request, includeBody = false) {
  const newHeaders = {};
  request.headers.forEach((value, key) => {
    if (key.toLowerCase() === "cookie") {
      newHeaders[key] = sanitizeCookieHeader(value);
    } else {
      newHeaders[key] = value;
    }
  });

  const init = {
    method: request.method,
    headers: newHeaders,
  };

  if (includeBody && request.body) {
    init.body = request.body;
    init.duplex = "half";
  }

  return new Request(request.url, init);
}

export async function GET(request) {
  const { GET: authGet } = await getHandlers();
  return authGet(buildCleanRequest(request));
}

export async function POST(request) {
  const { POST: authPost } = await getHandlers();
  return authPost(buildCleanRequest(request, true));
}
