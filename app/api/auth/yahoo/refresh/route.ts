// app/api/auth/yahoo/refresh/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Configure with your Yahoo OAuth credentials
const YAHOO_CLIENT_ID = process.env.YAHOO_CLIENT_ID || "your_client_id_here";
const YAHOO_CLIENT_SECRET = process.env.YAHOO_CLIENT_SECRET || "your_client_secret_here";
const REDIRECT_URI = process.env.YAHOO_REDIRECT_URI || "https://yourdomain.com/api/auth/yahoo/callback";

interface YahooTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get("yahoo_refresh_token")?.value;
    
    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token available" }, { status: 401 });
    }
    
    const tokenResponse = await refreshAccessToken(refreshToken);
    
    if (!tokenResponse) {
      // Clear cookies if refresh fails
      cookieStore.delete("yahoo_access_token");
      cookieStore.delete("yahoo_refresh_token");
      cookieStore.delete("user");
      
      return NextResponse.json({ error: "Failed to refresh token" }, { status: 401 });
    }
    
    // Update cookies with new tokens
    cookieStore.set("yahoo_access_token", tokenResponse.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: tokenResponse.expires_in,
      path: "/",
    });
    
    // Update refresh token if a new one was provided
    cookieStore.set("yahoo_refresh_token", tokenResponse.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json({ error: "Token refresh failed" }, { status: 500 });
  }
}

async function refreshAccessToken(refreshToken: string): Promise<YahooTokenResponse | null> {
  try {
    const requestBody = new URLSearchParams({
      client_id: YAHOO_CLIENT_ID,
      client_secret: YAHOO_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      refresh_token: refreshToken,
      grant_type: "refresh_token"
    });
    
    const response = await fetch("https://api.login.yahoo.com/oauth2/get_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: requestBody.toString()
    });
    
    if (!response.ok) {
      console.error("Token refresh failed:", await response.text());
      return null;
    }
    
    return await response.json() as YahooTokenResponse;
    
  } catch (error) {
    console.error("Error refreshing token:", error);
    return null;
  }
}
