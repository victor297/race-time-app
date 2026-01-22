"use client";
import { vars } from "nativewind";
import colors from "tailwindcss/colors";

export const config = {
  light: vars({
    // ---- Primary ----
    "--color-primary-50": "255 229 229",
    "--color-primary-100": "255 184 184",
    "--color-primary-200": "255 138 138",
    "--color-primary-300": "255 92 92",
    "--color-primary-400": "255 46 46",
    "--color-primary-500": "253 40 40",
    "--color-primary-600": "230 32 32",
    "--color-primary-700": "184 25 25",
    "--color-primary-800": "138 19 19",
    "--color-primary-900": "92 12 12",
    "--color-primary-950": "46 6 6",

    // ---- Secondary ----
    "--color-secondary-50": "245 245 245",
    "--color-secondary-100": "229 229 229",
    "--color-secondary-200": "212 212 212",
    "--color-secondary-300": "163 163 163",
    "--color-secondary-400": "115 115 115",
    "--color-secondary-500": "82 82 82",
    "--color-secondary-600": "64 64 64",
    "--color-secondary-700": "38 38 38",
    "--color-secondary-800": "23 23 23",
    "--color-secondary-900": "0 0 0",
    "--color-secondary-950": "0 0 0",

    // ---- Tertiary ----
    "--color-tertiary-50": "255 240 247",
    "--color-tertiary-100": "255 214 234",
    "--color-tertiary-200": "255 173 212",
    "--color-tertiary-300": "255 133 191",
    "--color-tertiary-400": "255 92 169",
    "--color-tertiary-500": "250 87 167",
    "--color-tertiary-600": "224 69 145",
    "--color-tertiary-700": "181 55 115",
    "--color-tertiary-800": "137 41 84",
    "--color-tertiary-900": "92 27 54",
    "--color-tertiary-950": "46 14 27",

    // ---- Info ----
    "--color-info-50": "235 245 255",
    "--color-info-100": "214 235 255",
    "--color-info-200": "173 215 255",
    "--color-info-300": "133 195 255",
    "--color-info-400": "92 174 255",
    "--color-info-500": "74 155 243",
    "--color-info-600": "43 127 224",
    "--color-info-700": "33 100 179",
    "--color-info-800": "23 73 134",
    "--color-info-900": "12 45 89",
    "--color-info-950": "6 22 45",

    // ---- Success ----
    "--color-success-50": "230 253 242",
    "--color-success-100": "185 250 219",
    "--color-success-200": "140 247 196",
    "--color-success-300": "95 243 173",
    "--color-success-400": "51 240 150",
    "--color-success-500": "10 212 111",
    "--color-success-600": "8 168 90",
    "--color-success-700": "6 125 68",
    "--color-success-800": "4 81 47",
    "--color-success-900": "2 38 25",
    "--color-success-950": "1 19 13",

    // ---- Warning (from tailwind yellow) ----
    "--color-warning-50": colors.yellow[50],
    "--color-warning-100": colors.yellow[100],
    "--color-warning-200": colors.yellow[200],
    "--color-warning-300": colors.yellow[300],
    "--color-warning-400": colors.yellow[400],
    "--color-warning-500": colors.yellow[500],
    "--color-warning-600": colors.yellow[600],
    "--color-warning-700": colors.yellow[700],
    "--color-warning-800": colors.yellow[800],
    "--color-warning-900": colors.yellow[900],

    // ---- Error (from tailwind red) ----
    "--color-error-50": colors.red[50],
    "--color-error-100": colors.red[100],
    "--color-error-200": colors.red[200],
    "--color-error-300": colors.red[300],
    "--color-error-400": colors.red[400],
    "--color-error-500": colors.red[500],
    "--color-error-600": colors.red[600],
    "--color-error-700": colors.red[700],
    "--color-error-800": colors.red[800],
    "--color-error-900": colors.red[900],

    // ---- Background ----
    "--color-background-50": "255 255 255",
    "--color-background-100": "241 241 243",
    "--color-background-200": "229 229 232",
    "--color-background-dark": "24 23 25",

    // ---- Outline ----
    "--color-outline-100": "237 241 243",

    // ---- Typography ----
    "--color-typography-default": "108 114 120",
    "--color-typography-bold": "0 0 0",
    "--color-typography-semibold": "0 0 0 / 0.75",
    "--color-typography-medium": "0 0 0 / 0.5",
  }),

  dark: vars({
    "--color-background-dark": "24 23 25",
    "--color-typography-default": "200 200 200",
    "--color-primary-500": "253 40 40",
    "--color-secondary-500": "82 82 82",
    "--color-tertiary-500": "250 87 167",
    "--color-success-500": "10 212 111",
    "--color-info-500": "74 155 243",
    "--color-warning-500": colors.yellow[500],
    "--color-error-500": colors.red[500],
  }),
};
