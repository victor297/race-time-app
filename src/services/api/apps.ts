import AppImages from "~/src/configs/AppImages";
export type App = {
  id: string;
  name: string;
  description: string;
  logo: any;
  isConnected: boolean;
};
export const APPS_LIST: App[] = [
  {
    id: "google-fit",
    name: "Google Fit",
    description: "Connect your Google Fit",
    logo: AppImages.googleFit,
    isConnected: false,
  },
  {
    id: "strava",
    name: "Strava",
    description: "Connect your Strava",
    logo: AppImages.strava,
    isConnected: false,
  },
  {
    id: "samsung-health",
    name: "Samsung Health",
    description: "Connect your Samsung Health",
    logo: AppImages.samsungHealth,
    isConnected: false,
  },
  {
    id: "apple-health",
    name: "Apple Health",
    description: "Connect your Apple Health",
    logo: AppImages.appleHealth,
    isConnected: false,
  },
  {
    id: "fitbit",
    name: "fitbit",
    description: "Connect your Fitbit",
    logo: AppImages.fitbit,
    isConnected: false,
  },
];
