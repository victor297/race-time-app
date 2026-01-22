# Fitness Apps Integration

This document explains how the fitness app connections work in My Racetime.

## Architecture

### 1. Credential Storage (`fitnessAppStorage.ts`)

- **Location**: `src/services/fitnessApps/fitnessAppStorage.ts`
- **Purpose**: Securely stores OAuth tokens and credentials in AsyncStorage
- **Data Structure**:

```typescript
{
  "strava": {
    appId: "strava",
    appName: "Strava",
    accessToken: "xxx",
    refreshToken: "xxx",
    expiresAt: 1234567890,
    userId: "athlete_id",
    connectedAt: 1234567890
  },
  "fitbit": { ... },
  ...
}
```

### 2. Authentication (`fitnessAppAuth.ts`)

- **Location**: `src/services/fitnessApps/fitnessAppAuth.ts`
- **Purpose**: Handles OAuth flows for each fitness app
- **Supported Apps**:
  - ✅ Strava (OAuth 2.0)
  - ✅ Fitbit (OAuth 2.0)
  - ⏳ Google Fit (requires expo-auth-session)
  - ⏳ Apple Health (requires react-native-health)
  - ⏳ Samsung Health (requires native SDK)

### 3. Configuration (`constants.ts`)

- **Location**: `src/utils/constants.ts`
- **Purpose**: Stores API keys and OAuth configuration
- **Environment Variables**: See `.env.example`

## Setup Instructions

### 1. Install Required Packages

```bash
npx expo install expo-web-browser expo-auth-session
```

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in your API credentials:

#### Strava

1. Go to https://www.strava.com/settings/api
2. Create an app
3. Add credentials to `.env`:

```
EXPO_PUBLIC_STRAVA_CLIENT_ID=your_client_id
EXPO_PUBLIC_STRAVA_CLIENT_SECRET=your_client_secret
EXPO_PUBLIC_STRAVA_REDIRECT_URI=myracetime://strava
```

#### Fitbit

1. Go to https://dev.fitbit.com/apps
2. Register an app
3. Add credentials to `.env`:

```
EXPO_PUBLIC_FITBIT_CLIENT_ID=your_client_id
EXPO_PUBLIC_FITBIT_CLIENT_SECRET=your_client_secret
EXPO_PUBLIC_FITBIT_REDIRECT_URI=myracetime://fitbit
```

#### Google Fit

1. Go to https://console.cloud.google.com/
2. Create OAuth 2.0 credentials
3. Enable Fitness API
4. Add to `.env`:

```
EXPO_PUBLIC_GOOGLE_FIT_CLIENT_ID=your_client_id
```

### 3. Configure App URLs (app.json)

Add URL schemes for OAuth callbacks:

```json
{
  "expo": {
    "scheme": "myracetime"
  }
}
```

## Usage

### Connect an App

```typescript
import { connectStrava, connectFitbit } from "~/src/services";

// Connect Strava
try {
  const credential = await connectStrava();
  console.log("Connected:", credential);
} catch (error) {
  console.error("Connection failed:", error);
}
```

### Check Connection Status

```typescript
import { isAppConnected } from "~/src/services";

const connected = await isAppConnected("strava");
```

### Get Stored Credentials

```typescript
import { getAppCredential } from "~/src/services";

const credential = await getAppCredential("strava");
if (credential) {
  // Use credential.accessToken to fetch data
}
```

### Disconnect an App

```typescript
import { disconnectApp } from "~/src/services";

await disconnectApp("strava");
```

## Data Fetching Flow

Once connected, you can fetch user activity data:

1. **Check Connection**:

```typescript
const credential = await getAppCredential("strava");
if (!credential) {
  // Prompt user to connect
  return;
}
```

2. **Fetch Data**:

```typescript
// Example: Fetch Strava activities
const response = await fetch(
  "https://www.strava.com/api/v3/athlete/activities",
  {
    headers: {
      Authorization: `Bearer ${credential.accessToken}`,
    },
  }
);
const activities = await response.json();
```

3. **Handle Token Expiration**:

```typescript
if (credential.expiresAt && credential.expiresAt < Date.now()) {
  // Refresh token
  const newCredential = await refreshAppToken("strava");
}
```

## Token Refresh

Tokens are automatically checked for expiration. Implement `refreshAppToken()` in `fitnessAppAuth.ts` for each app.

## Security Notes

1. **Never commit `.env` file** - it's in `.gitignore`
2. **OAuth tokens are stored in AsyncStorage** - encrypted on device
3. **Always use HTTPS** for API calls
4. **Validate redirect URIs** match registered URIs

## Next Steps

1. Install missing packages: `expo-web-browser`, `expo-auth-session`
2. Set up OAuth apps on each platform
3. Add environment variables
4. Implement token refresh logic
5. Create data sync services for each app
6. Add UI for viewing synced activities

## Troubleshooting

### "Cannot find module 'expo-web-browser'"

Run: `npx expo install expo-web-browser expo-auth-session`

### OAuth redirect not working

1. Check URL scheme in `app.json`
2. Verify redirect URI matches exactly in OAuth app settings
3. Test on physical device (OAuth may not work on simulator)

### Token expired

Implement and call `refreshAppToken()` before making API requests

## API Documentation Links

- [Strava API](https://developers.strava.com/docs/reference/)
- [Fitbit Web API](https://dev.fitbit.com/build/reference/web-api/)
- [Google Fit REST API](https://developers.google.com/fit/rest)
- [Apple HealthKit](https://developer.apple.com/documentation/healthkit)
- [Samsung Health SDK](https://developer.samsung.com/health/android)
