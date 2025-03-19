// route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Configure with your Yahoo OAuth credentials
const YAHOO_CLIENT_ID = process.env.YAHOO_CLIENT_ID || "dj0yJmk9MWVJNWdJckRFTWJPJmQ9WVdrOWRGbFhSSE4yUjFJbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PTY2";
const YAHOO_CLIENT_SECRET = process.env.YAHOO_CLIENT_SECRET || "your_client_secret_here";
const REDIRECT_URI = process.env.YAHOO_REDIRECT_URI || "https://9361-216-9-28-77.ngrok-free.app/api/auth/yahoo/callback";

export async function GET(request: NextRequest) {
  try {
    // 1. Extract the authorization code from the URL
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");

    if (!code) {
      console.error("No authorization code received");
      return NextResponse.redirect(
        new URL("/login?error=no_code", request.url)
      );
    }

    console.log("Auth code received:", code);

    // 2. Exchange the authorization code for tokens
    const tokenEndpoint = "https://api.login.yahoo.com/oauth2/get_token";

    const formData = new URLSearchParams();
    formData.append("client_id", YAHOO_CLIENT_ID);
    formData.append("client_secret", YAHOO_CLIENT_SECRET);
    formData.append("redirect_uri", REDIRECT_URI);
    formData.append("code", code);
    formData.append("grant_type", "authorization_code");

    console.log("Making token exchange request");

    // Make the token exchange request
    const tokenResponse = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    });

    console.log("Token exchange response status:", tokenResponse.status);

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange failed:", errorText);

      // If code expired, redirect back to auth flow
      if (
        errorText.includes("expired") ||
        errorText.includes("invalid_grant")
      ) {
        return NextResponse.redirect(
          new URL("/api/auth/yahoo/retry", request.url)
        );
      }

      return NextResponse.redirect(
        new URL("/login?error=token_exchange", request.url)
      );
    }

    // Parse the token response
    const tokenData = await tokenResponse.json();
    console.log("Token exchange successful");

    // Create cookies
    // const response = NextResponse.redirect(new URL("/", request.url));
    let redirectUrl = new URL("/", request.url);
    if (redirectUrl.hostname === "localhost") {
      redirectUrl.protocol = "http:";
    }
    const response = NextResponse.redirect(redirectUrl);

    // Store tokens in cookies using the response object
    response.cookies.set("yahoo_access_token", tokenData.access_token, {
      httpOnly: true,
      secure: true,
      maxAge: tokenData.expires_in,
      path: "/",
    });

    response.cookies.set("yahoo_refresh_token", tokenData.refresh_token, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });



    // Default user info
    let userInfo = {
      sub: "yahoo_user",
      name: "Yahoo User",
      email: "",
      picture: "",
    };

    // Try to extract info from ID token if available
    if (tokenData.id_token) {
      try {
        const parts = tokenData.id_token.split(".");
        if (parts.length >= 2) {
          // Base64 decode and parse the payload part (index 1)
          const base64Url = parts[1];
          const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
          const payload = JSON.parse(Buffer.from(base64, "base64").toString());

          userInfo = {
            sub: payload.sub || userInfo.sub,
            name: payload.name || payload.given_name || userInfo.name,
            email: payload.email || userInfo.email,
            picture: payload.picture || userInfo.picture,
          };
        }
      } catch (e) {
        console.error("Failed to parse ID token:", e);
      }
    }

    // Try to fetch user info from API
    try {
      const userInfoResponse = await fetch(
        "https://api.login.yahoo.com/openid/v1/userinfo",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            Accept: "application/json",
          },
        }
      );

      console.log("User info response : " + JSON.stringify(userInfoResponse));
      console.log("User info response status:", userInfoResponse.status);

      if (userInfoResponse.ok) {
        const apiUserInfo = await userInfoResponse.json();
        console.log("User info data:", apiUserInfo); // Add this line
        console.log("User info fetched successfully");

        // Override with API response data
        userInfo = {
          sub: apiUserInfo.sub || userInfo.sub,
          name: apiUserInfo.name || userInfo.name,
          email: apiUserInfo.email || userInfo.email,
          picture: apiUserInfo.picture || userInfo.picture,
        };
      } else {
        console.log("Using fallback user info from ID token : ", JSON.stringify(userInfo));
        console.log("Using fallback user info from ID token : ", JSON.stringify(userInfoResponse));
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      // Continue with ID token info
    }

    // Store user info in cookie
    response.cookies.set(
      "user",
      JSON.stringify({
        id: userInfo.sub,
        name: userInfo.name,
        email: userInfo.email,
        image: userInfo.picture,
        provider: "yahoo",
      }),
      {
        secure: true,
        maxAge: tokenData.expires_in,
        path: "/",
      }
    );

    // Return response with cookies
    return response;
  } catch (error) {
    console.error("Yahoo authentication error:", error);
    return NextResponse.redirect(new URL("/login?error=unknown", request.url));
  }
}