// src/hooks/useTailwindConfigColors.ts
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";

import defaultColors from "tailwindcss/colors"; // ✅ actual color values

type AppColors = typeof defaultColors & {
  primary: string;
  secondary: string;
  accent: string;
  [key: string]: string | Record<string, string>;
};

export const useTailwindConfigColors = (): AppColors => {
  const fullConfig = resolveConfig(tailwindConfig);
  const colors = fullConfig.theme?.colors ?? {};

  // merge defaults with custom
  return { ...defaultColors, ...colors } as AppColors;
};
