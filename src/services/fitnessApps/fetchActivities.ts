import { ApiActivityDto, ApiActivitySource } from "~/src/types";
import { getAppCredential } from "./fitnessAppStorage";
import { normalizeApiActivity } from "../api/map/normalizeApiActivity";

/**
 * Fetch activities from Strava
 */
export const fetchStravaActivities = async (
  startDate?: Date,
  endDate?: Date
): Promise<ApiActivityDto[]> => {
  const credential = await getAppCredential("strava");
  if (!credential) {
    throw new Error("Strava not connected");
  }

  // Build query params
  const params = new URLSearchParams();
  if (startDate)
    params.append("after", Math.floor(startDate.getTime() / 1000).toString());
  if (endDate)
    params.append("before", Math.floor(endDate.getTime() / 1000).toString());
  params.append("per_page", "30");

  const response = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${credential.accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Strava API error: ${response.statusText}`);
  }

  const activities = await response.json();
  return activities.map((activity: any) =>
    normalizeApiActivity(ApiActivitySource.STRAVA, activity)
  );
};

/**
 * Fetch activities from Google Fit
 */
export const fetchGoogleFitActivities = async (
  startDate?: Date,
  endDate?: Date
): Promise<ApiActivityDto[]> => {
  const credential = await getAppCredential("google-fit");
  if (!credential) {
    throw new Error("Google Fit not connected");
  }

  // TODO: Implement Google Fit API calls
  // https://developers.google.com/fit/rest/v1/reference/users/sessions/list
  throw new Error("Google Fit fetching not yet implemented");
};

/**
 * Fetch activities from Fitbit
 */
export const fetchFitbitActivities = async (
  startDate?: Date,
  endDate?: Date
): Promise<ApiActivityDto[]> => {
  const credential = await getAppCredential("fitbit");
  if (!credential) {
    throw new Error("Fitbit not connected");
  }

  // TODO: Implement Fitbit API calls
  // https://dev.fitbit.com/build/reference/web-api/activity/
  throw new Error("Fitbit fetching not yet implemented");
};

/**
 * Fetch activities from Samsung Health
 */
export const fetchSamsungHealthActivities = async (
  startDate?: Date,
  endDate?: Date
): Promise<ApiActivityDto[]> => {
  const credential = await getAppCredential("samsung-health");
  if (!credential) {
    throw new Error("Samsung Health not connected");
  }

  // Samsung Health requires native SDK
  throw new Error("Samsung Health requires native SDK integration");
};

/**
 * Fetch activities from Apple Health
 */
export const fetchAppleHealthActivities = async (
  startDate?: Date,
  endDate?: Date
): Promise<ApiActivityDto[]> => {
  const credential = await getAppCredential("apple-health");
  if (!credential) {
    throw new Error("Apple Health not connected");
  }

  // Apple Health requires native HealthKit
  throw new Error("Apple Health requires native HealthKit integration");
};

/**
 * Fetch activities from any app
 */
export const fetchActivitiesFromApp = async (
  appId: string,
  startDate?: Date,
  endDate?: Date
): Promise<ApiActivityDto[]> => {
  switch (appId) {
    case "strava":
      return fetchStravaActivities(startDate, endDate);
    case "google-fit":
      return fetchGoogleFitActivities(startDate, endDate);
    case "fitbit":
      return fetchFitbitActivities(startDate, endDate);
    case "samsung-health":
      return fetchSamsungHealthActivities(startDate, endDate);
    case "apple-health":
      return fetchAppleHealthActivities(startDate, endDate);
    default:
      throw new Error(`Unknown app: ${appId}`);
  }
};
