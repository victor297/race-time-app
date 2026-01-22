import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { Constants } from "~/src/utils";
import {
  saveFitnessAppCredentials,
  FitnessAppCredential,
  removeAppCredential,
} from "./fitnessAppStorage";

WebBrowser.maybeCompleteAuthSession();

/**
 * Connect to Google Fit using OAuth
 */
export const connectGoogleFit = async (): Promise<FitnessAppCredential> => {
  const { clientId, scopes } = Constants.fitnessApps.googleFit;
  const redirectUri = AuthSession.makeRedirectUri();

  const authUrl = AuthSession.useAuthRequest(
    {
      clientId,
      scopes,
      redirectUri,
      responseType: "code",
    },
    {
      authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    }
  );

  // This is a simplified version - you'll need to handle the full OAuth flow
  throw new Error("Google Fit connection needs full OAuth implementation");
};

/**
 * Connect to Strava using OAuth
 */
export const connectStrava = async (): Promise<FitnessAppCredential> => {
  const { clientId, redirectUri, scopes } = Constants.fitnessApps.strava;

  console.log("Strava OAuth Configuration:", {
    clientId,
    redirectUri,
    scopes,
  });

  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&approval_prompt=force&scope=${scopes}`;

  console.log("Opening Strava auth URL:", authUrl);

  // Open browser for OAuth
  const result = await WebBrowser.openAuthSessionAsync(
    authUrl,
    "myracetime://strava" // Your app will receive the callback here
  );

  console.log("Strava OAuth result:", result);

  if (result.type === "success") {
    console.log("Success! URL:", result.url);

    // Extract code from the deep link URL (myracetime://strava?code=...)
    const url = new URL(result.url);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");

    if (error) {
      throw new Error(`Strava authorization failed: ${error}`);
    }

    if (!code) {
      throw new Error("No authorization code received");
    }

    console.log("Authorization code received, exchanging for token...");

    // Exchange code for access token
    const tokenResponse = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: Constants.fitnessApps.strava.clientSecret,
        code,
        grant_type: "authorization_code",
      }),
    });

    console.log("Token response status:", tokenResponse.status);

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.log("Token exchange error:", errorData);
      throw new Error(
        `Failed to exchange code for token: ${
          errorData.message || tokenResponse.statusText
        }`
      );
    }

    const tokenData = await tokenResponse.json();
    console.log("Token data received:", {
      hasAccessToken: !!tokenData.access_token,
      hasRefreshToken: !!tokenData.refresh_token,
      expiresAt: tokenData.expires_at,
    });

    if (!tokenData.access_token) {
      throw new Error("No access token in response");
    }

    const credential: FitnessAppCredential = {
      appId: "strava",
      appName: "Strava",
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: tokenData.expires_at * 1000,
      userId: tokenData.athlete?.id?.toString(),
      connectedAt: Date.now(),
    };

    await saveFitnessAppCredentials(credential);
    console.log("Strava credentials saved successfully");
    return credential;
  }

  if (result.type === "cancel") {
    console.log("User cancelled authorization");
    throw new Error("Authorization was cancelled");
  }

  console.log("OAuth failed with result:", result);
  throw new Error(
    `Strava connection failed: ${result.type || "Unknown error"}`
  );
};

/**
 * Connect to Fitbit using OAuth
 */
export const connectFitbit = async (): Promise<FitnessAppCredential> => {
  const { clientId, redirectUri, scopes } = Constants.fitnessApps.fitbit;

  const authUrl = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${scopes}&expires_in=604800`;

  const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);

  if (result.type === "success") {
    const code = new URL(result.url).searchParams.get("code");
    if (!code) throw new Error("No authorization code received");

    // Exchange code for access token
    const tokenResponse = await fetch("https://api.fitbit.com/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(
          `${clientId}:${Constants.fitnessApps.fitbit.clientSecret}`
        )}`,
      },
      body: `client_id=${clientId}&grant_type=authorization_code&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&code=${code}`,
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(
        `Failed to exchange code for token: ${
          errorData.errors?.[0]?.message || tokenResponse.statusText
        }`
      );
    }

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error("No access token in response");
    }

    const credential: FitnessAppCredential = {
      appId: "fitbit",
      appName: "fitbit",
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: Date.now() + tokenData.expires_in * 1000,
      userId: tokenData.user_id,
      connectedAt: Date.now(),
    };

    await saveFitnessAppCredentials(credential);
    return credential;
  }

  if (result.type === "cancel") {
    throw new Error("Authorization was cancelled");
  }

  throw new Error(
    `Fitbit connection failed: ${result.type || "Unknown error"}`
  );
};

/**
 * Connect to Samsung Health
 * Note: Samsung Health requires native SDK integration
 */
export const connectSamsungHealth = async (): Promise<FitnessAppCredential> => {
  // Samsung Health requires native module integration
  // You'll need to implement this with react-native modules
  throw new Error(
    "Samsung Health requires native SDK integration - implement with native modules"
  );
};

/**
 * Connect to Apple Health
 * Note: Apple Health uses native HealthKit
 */
export const connectAppleHealth = async (): Promise<FitnessAppCredential> => {
  // Apple Health requires native HealthKit integration
  // You'll need to use a library like react-native-health
  throw new Error(
    "Apple Health requires native HealthKit integration - use react-native-health"
  );
};

/**
 * Disconnect a fitness app
 */
export const disconnectApp = async (appId: string): Promise<void> => {
  await removeAppCredential(appId);
};

/**
 * Refresh access token for an app
 */
export const refreshAppToken = async (
  appId: string
): Promise<FitnessAppCredential | null> => {
  // Implement token refresh logic based on app
  switch (appId) {
    case "strava":
      // Implement Strava token refresh
      break;
    case "fitbit":
      // Implement Fitbit token refresh
      break;
    default:
      break;
  }
  return null;
};
