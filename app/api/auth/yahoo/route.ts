// route.ts
import { NextRequest, NextResponse } from "next/server";

// Configure with your Yahoo OAuth credentials
const YAHOO_CLIENT_ID = process.env.YAHOO_CLIENT_ID || ''
const REDIRECT_URI = process.env.YAHOO_REDIRECT_URI || ''

export async function GET(request: NextRequest) {
  const lang = request.headers.get("accept-language")?.split(",")[0] || "en-US";
  
  // Create the Yahoo OAuth URL
  const authUrl = new URL("https://api.login.yahoo.com/oauth2/request_auth");

  authUrl.searchParams.append("client_id", YAHOO_CLIENT_ID);
  authUrl.searchParams.append("response_type", "code");
  // authUrl.searchParams.append("scope", "openid profile email fspt-r");
  // authUrl.searchParams.append("scope", "openid profile email fspt-r");
  // authUrl.searchParams.append("scope", "fspt-r");
  // authUrl.searchParams.append("scope", "openid profile email address");
  // authUrl.searchParams.append("scope", "openid");
  authUrl.searchParams.append("scope", "openid profile email fspt-r");
  // authUrl.searchParams.append("scope", "openid profile email https://social.yahooapis.com/v1/user/me/fantasy");
  authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.append("language", lang);
  
  // Use a server-side redirect instead of client redirect
  return NextResponse.redirect(authUrl.toString());
}