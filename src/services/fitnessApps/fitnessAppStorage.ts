import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@fitness_app_credentials";

export type FitnessAppCredential = {
  appId: string;
  appName: string;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  userId?: string;
  connectedAt: number;
};

export type StoredCredentials = {
  [appId: string]: FitnessAppCredential;
};

/**
 * Save fitness app credentials to AsyncStorage
 */
export const saveFitnessAppCredentials = async (
  credential: FitnessAppCredential
): Promise<void> => {
  try {
    const existing = await getFitnessAppCredentials();
    existing[credential.appId] = credential;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error("Error saving fitness app credentials:", error);
    throw error;
  }
};

/**
 * Get all stored fitness app credentials
 */
export const getFitnessAppCredentials =
  async (): Promise<StoredCredentials> => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error("Error getting fitness app credentials:", error);
      return {};
    }
  };

/**
 * Get credentials for a specific app
 */
export const getAppCredential = async (
  appId: string
): Promise<FitnessAppCredential | null> => {
  try {
    const credentials = await getFitnessAppCredentials();
    return credentials[appId] || null;
  } catch (error) {
    console.error("Error getting app credential:", error);
    return null;
  }
};

/**
 * Remove credentials for a specific app
 */
export const removeAppCredential = async (appId: string): Promise<void> => {
  try {
    const credentials = await getFitnessAppCredentials();
    delete credentials[appId];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
  } catch (error) {
    console.error("Error removing app credential:", error);
    throw error;
  }
};

/**
 * Check if an app is connected
 */
export const isAppConnected = async (appId: string): Promise<boolean> => {
  try {
    const credential = await getAppCredential(appId);
    if (!credential) return false;

    // Check if token is expired
    if (credential.expiresAt && credential.expiresAt < Date.now()) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error checking app connection:", error);
    return false;
  }
};

/**
 * Clear all fitness app credentials
 */
export const clearAllCredentials = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing credentials:", error);
    throw error;
  }
};
