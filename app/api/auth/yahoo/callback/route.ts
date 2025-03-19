// app/api/auth/yahoo/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Configure with your Yahoo OAuth credentials
const YAHOO_CLIENT_ID = process.env.YAHOO_CLIENT_ID || "your_client_id_here";
const YAHOO_CLIENT_SECRET = process.env.YAHOO_CLIENT_SECRET || "your_client_secret_here";
const REDIRECT_URI = process.env.YAHOO_REDIRECT_URI || "https://9361-216-9-28-77.ngrok-free.app/api/auth/yahoo/callback";

// Types for Yahoo responses
interface YahooTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  id_token?: string;
}

interface YahooUserInfo {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  email: string;
  email_verified: boolean;
  picture: string;
  birthdate?: string;
  gender?: string;
  locale?: string;
  nickname?: string;
  profile_images?: {
    image32: string;
    image64: string;
    image128: string;
    image192: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    // 1. Extract the authorization code from the URL
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    
    if (!code) {
      return NextResponse.json({ error: "Authorization code missing" }, { status: 400 });
    }
    
    // 2. Exchange the authorization code for tokens
    const tokenResponse = await exchangeCodeForTokens(code);
    if (!tokenResponse) {
      return NextResponse.json({ error: "Failed to exchange code for tokens" }, { status: 400 });
    }
    
    // 3. Fetch user information
    const userInfo = await fetchUserInfo(tokenResponse.access_token);
    if (!userInfo) {
      return NextResponse.json({ error: "Failed to fetch user info" }, { status: 400 });
    }
    
    // 4. Create a session or JWT
    // Store tokens securely - this is just one approach
    const cookieStore = cookies();
    
    // Store access token in an HTTP-only cookie (short-lived)
    cookieStore.set("yahoo_access_token", tokenResponse.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: tokenResponse.expires_in,
      path: "/",
    });
    
    // Store refresh token in an HTTP-only cookie (long-lived)
    cookieStore.set("yahoo_refresh_token", tokenResponse.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });
    
    // Store basic user info in client accessible cookie
    cookieStore.set("user", JSON.stringify({
      id: userInfo.sub,
      name: userInfo.name,
      email: userInfo.email,
      image: userInfo.picture,
      provider: "yahoo"
    }), {
      secure: process.env.NODE_ENV === "production",
      maxAge: tokenResponse.expires_in,
      path: "/",
    });
    
    // Redirect to dashboard or home page after successful login
    return NextResponse.redirect(new URL("/dashboard", request.url));
    
  } catch (error) {
    console.error("Yahoo authentication error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

async function exchangeCodeForTokens(code: string): Promise<YahooTokenResponse | null> {
  try {
    const requestBody = new URLSearchParams({
      client_id: YAHOO_CLIENT_ID,
      client_secret: YAHOO_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      code: code,
      grant_type: "authorization_code"
    });
    
    const response = await fetch("https://api.login.yahoo.com/oauth2/get_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: requestBody.toString()
    });
    
    if (!response.ok) {
      console.error("Token exchange failed:", await response.text());
      return null;
    }
    
    return await response.json() as YahooTokenResponse;
    
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    return null;
  }
}

async function fetchUserInfo(accessToken: string): Promise<YahooUserInfo | null> {
  try {
    const response = await fetch("https://api.login.yahoo.com/openid/v1/userinfo", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      console.error("User info fetch failed:", await response.text());
      return null;
    }
    
    return await response.json() as YahooUserInfo;
    
  } catch (error) {
    console.error("Error fetching user info:", error);
    return null;
  }
}
