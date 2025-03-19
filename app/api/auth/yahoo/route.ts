// route.ts
import { NextRequest, NextResponse } from "next/server";

// Configure with your Yahoo OAuth credentials
const YAHOO_CLIENT_ID = process.env.YAHOO_CLIENT_ID || "dj0yJmk9MWVJNWdJckRFTWJPJmQ9WVdrOWRGbFhSSE4yUjFJbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTY2";
const REDIRECT_URI = process.env.YAHOO_REDIRECT_URI || "https://9361-216-9-28-77.ngrok-free.app/api/auth/yahoo/callback";

export async function GET(request: NextRequest) {
  const lang = request.headers.get("accept-language")?.split(",")[0] || "en-US";
  
  // Create the Yahoo OAuth URL
  const authUrl = new URL("https://api.login.yahoo.com/oauth2/request_auth");
  authUrl.searchParams.append("client_id", YAHOO_CLIENT_ID);
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.append("language", lang);
  
  // Use a server-side redirect instead of client redirect
  return NextResponse.redirect(authUrl.toString());
}