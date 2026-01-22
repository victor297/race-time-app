export const Constants = {
  baseUrl: {
    live: "https://race-time-backend-92bw.onrender.com/api/",
    local: "https://race-time-backend-staging.onrender.com/api/",
    staging: "https://f8gf168f-5050.eun1.devtunnels.ms/api/",
  },
  config: {
    paystackPublicKey: "pk_test_ead7bf78b63c4d517f1181b2c60849775370d9bf", //process.env.PAYSTACK_API_KEY || "",
    production: true,
  },
  fitnessApps: {
    googleFit: {
      clientId: process.env.EXPO_PUBLIC_GOOGLE_FIT_CLIENT_ID || "",
      scopes: [
        "https://www.googleapis.com/auth/fitness.activity.read",
        "https://www.googleapis.com/auth/fitness.location.read",
      ],
    },
    strava: {
      clientId: "175936", //process.env.EXPO_PUBLIC_STRAVA_CLIENT_ID || "",
      clientSecret: "a51ae6dba36821559a6a0f27e5d95807ca928b09", //process.env.EXPO_PUBLIC_STRAVA_CLIENT_SECRET || "",
      redirectUri:
        "https://race-time-backend-92bw.onrender.com/strava/callback",
      //process.env.EXPO_PUBLIC_STRAVA_REDIRECT_URI || "myracetime://strava",
      scopes: "activity:read_all",
    },
    fitbit: {
      clientId: process.env.EXPO_PUBLIC_FITBIT_CLIENT_ID || "",
      clientSecret: process.env.EXPO_PUBLIC_FITBIT_CLIENT_SECRET || "",
      redirectUri:
        process.env.EXPO_PUBLIC_FITBIT_REDIRECT_URI || "myracetime://fitbit",
      scopes: "activity",
    },
    appleHealth: {
      // Apple Health uses native iOS HealthKit - no API keys needed
      // Requires Info.plist configuration
      permissions: [
        "HKQuantityTypeIdentifierStepCount",
        "HKQuantityTypeIdentifierDistanceWalkingRunning",
        "HKQuantityTypeIdentifierActiveEnergyBurned",
      ],
    },
    samsungHealth: {
      clientId: process.env.EXPO_PUBLIC_SAMSUNG_HEALTH_CLIENT_ID || "",
      // Samsung Health SDK integration
    },
  },
};
