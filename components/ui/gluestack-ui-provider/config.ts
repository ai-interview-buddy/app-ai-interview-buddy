"use client";
import { vars } from "nativewind";

export const config = {
  light: vars({
    // PRIMARY: Bumble Yellow and tints
    "--color-primary-0": "255 252 237", // lightest (soft white, #FEFBED)
    "--color-primary-50": "255 247 222", // pollen, #FFF7DE
    "--color-primary-100": "255 236 128", // mid tint, #FFEC80
    "--color-primary-200": "255 221 79", // lighter yellow
    "--color-primary-300": "255 210 55", // yellow pale
    "--color-primary-400": "255 203 55", // #FFCB37
    "--color-primary-500": "255 198 41", // bumble yellow, #FFC629
    "--color-primary-600": "245 180 30", // strong yellow
    "--color-primary-700": "227 170 31", // golden honey, #E3AA1F
    "--color-primary-800": "205 151 21", // deeper gold
    "--color-primary-900": "166 119 0", // shadow yellow
    "--color-primary-950": "115 82 9", // deepest shadow

    // SECONDARY: Bumble Black and tints
    "--color-secondary-0": "255 255 255", // pure white
    "--color-secondary-50": "230 232 235", // light gray tint
    "--color-secondary-100": "203 207 212",
    "--color-secondary-200": "175 181 188",
    "--color-secondary-300": "147 154 163",
    "--color-secondary-400": "100 110 122",
    "--color-secondary-500": "61 71 84", // tint of black
    "--color-secondary-600": "44 53 63",
    "--color-secondary-700": "35 42 51",
    "--color-secondary-800": "29 37 44", // bumble black #1D252C
    "--color-secondary-900": "19 24 29", // deep
    "--color-secondary-950": "10 13 16", // near-black

    // TERTIARY: Soft white, pollen, golds
    "--color-tertiary-0": "254 251 237", // soft white
    "--color-tertiary-50": "255 247 222", // pollen
    "--color-tertiary-100": "253 231 128", // golden light
    "--color-tertiary-200": "253 215 128",
    "--color-tertiary-300": "253 211 144",
    "--color-tertiary-400": "253 220 180",
    "--color-tertiary-500": "227 170 31", // golden honey
    "--color-tertiary-600": "205 151 21",
    "--color-tertiary-700": "166 119 0",
    "--color-tertiary-800": "115 82 9",
    "--color-tertiary-900": "79 56 2",
    "--color-tertiary-950": "40 29 2",

    /* Error */
    "--color-error-0": "254 233 233",
    "--color-error-50": "254 226 226",
    "--color-error-100": "254 202 202",
    "--color-error-200": "252 165 165",
    "--color-error-300": "248 113 113",
    "--color-error-400": "239 68 68",
    "--color-error-500": "230 53 53",
    "--color-error-600": "220 38 38",
    "--color-error-700": "185 28 28",
    "--color-error-800": "153 27 27",
    "--color-error-900": "127 29 29",
    "--color-error-950": "83 19 19",

    /* Success */
    "--color-success-0": "228 255 244",
    "--color-success-50": "202 255 232",
    "--color-success-100": "162 241 192",
    "--color-success-200": "132 211 162",
    "--color-success-300": "102 181 132",
    "--color-success-400": "72 151 102",
    "--color-success-500": "52 131 82",
    "--color-success-600": "42 121 72",
    "--color-success-700": "32 111 62",
    "--color-success-800": "22 101 52",
    "--color-success-900": "20 83 45",
    "--color-success-950": "27 50 36",

    /* Warning */
    "--color-warning-0": "255 249 245",
    "--color-warning-50": "255 244 236",
    "--color-warning-100": "255 231 213",
    "--color-warning-200": "254 205 170",
    "--color-warning-300": "253 173 116",
    "--color-warning-400": "251 149 75",
    "--color-warning-500": "231 120 40",
    "--color-warning-600": "215 108 31",
    "--color-warning-700": "180 90 26",
    "--color-warning-800": "130 68 23",
    "--color-warning-900": "108 56 19",
    "--color-warning-950": "84 45 18",

    /* Info */
    "--color-info-0": "236 248 254",
    "--color-info-50": "199 235 252",
    "--color-info-100": "162 221 250",
    "--color-info-200": "124 207 248",
    "--color-info-300": "87 194 246",
    "--color-info-400": "50 180 244",
    "--color-info-500": "13 166 242",
    "--color-info-600": "11 141 205",
    "--color-info-700": "9 115 168",
    "--color-info-800": "7 90 131",
    "--color-info-900": "5 64 93",
    "--color-info-950": "3 38 56",

    /* Typography */
    "--color-typography-0": "254 254 255",
    "--color-typography-50": "245 245 245",
    "--color-typography-100": "229 229 229",
    "--color-typography-200": "219 219 220",
    "--color-typography-300": "212 212 212",
    "--color-typography-400": "163 163 163",
    "--color-typography-500": "140 140 140",
    "--color-typography-600": "115 115 115",
    "--color-typography-700": "82 82 82",
    "--color-typography-800": "64 64 64",
    "--color-typography-900": "38 38 39",
    "--color-typography-950": "23 23 23",

    /* Outline */
    "--color-outline-0": "253 254 254",
    "--color-outline-50": "243 243 243",
    "--color-outline-100": "230 230 230",
    "--color-outline-200": "221 220 219",
    "--color-outline-300": "211 211 211",
    "--color-outline-400": "165 163 163",
    "--color-outline-500": "140 141 141",
    "--color-outline-600": "115 116 116",
    "--color-outline-700": "83 82 82",
    "--color-outline-800": "65 65 65",
    "--color-outline-900": "39 38 36",
    "--color-outline-950": "26 23 23",

    /* Background */
    "--color-background-0": "255 255 255",
    "--color-background-50": "246 246 246",
    "--color-background-100": "242 241 241",
    "--color-background-200": "220 219 219",
    "--color-background-300": "213 212 212",
    "--color-background-400": "162 163 163",
    "--color-background-500": "142 142 142",
    "--color-background-600": "116 116 116",
    "--color-background-700": "83 82 82",
    "--color-background-800": "65 64 64",
    "--color-background-900": "39 38 37",
    "--color-background-950": "18 18 18",

    /* Background Special */
    "--color-background-error": "254 241 241",
    "--color-background-warning": "255 243 234",
    "--color-background-success": "237 252 242",
    "--color-background-muted": "247 248 247",
    "--color-background-info": "235 248 254",

    /* Focus Ring Indicator  */
    "--color-indicator-primary": "55 55 55",
    "--color-indicator-info": "83 153 236",
    "--color-indicator-error": "185 28 28",
  }),
  dark: vars({
    // PRIMARY: Use dark backgrounds, yellow as accent
    "--color-primary-0": "61 71 84", // dark tint for surfaces
    "--color-primary-50": "100 110 122", // gray shade
    "--color-primary-100": "147 154 163", // lighter gray
    "--color-primary-200": "203 207 212",
    "--color-primary-300": "230 232 235",
    "--color-primary-400": "245 180 30", // yellow accent
    "--color-primary-500": "255 198 41", // main yellow accent
    "--color-primary-600": "255 210 55",
    "--color-primary-700": "255 221 79",
    "--color-primary-800": "255 236 128",
    "--color-primary-900": "255 247 222",
    "--color-primary-950": "254 251 237",

    // SECONDARY: Bumble Black and tints
    "--color-secondary-0": "29 37 44", // main bumble black
    "--color-secondary-50": "35 42 51",
    "--color-secondary-100": "44 53 63",
    "--color-secondary-200": "61 71 84",
    "--color-secondary-300": "100 110 122",
    "--color-secondary-400": "147 154 163",
    "--color-secondary-500": "175 181 188",
    "--color-secondary-600": "203 207 212",
    "--color-secondary-700": "230 232 235",
    "--color-secondary-800": "245 245 245",
    "--color-secondary-900": "255 255 255",
    "--color-secondary-950": "255 255 255",

    // TERTIARY: golds, white, pollen
    "--color-tertiary-0": "61 71 84",
    "--color-tertiary-50": "100 110 122",
    "--color-tertiary-100": "147 154 163",
    "--color-tertiary-200": "175 181 188",
    "--color-tertiary-300": "203 207 212",
    "--color-tertiary-400": "245 180 30", // gold
    "--color-tertiary-500": "255 198 41", // yellow accent
    "--color-tertiary-600": "255 210 55",
    "--color-tertiary-700": "255 221 79",
    "--color-tertiary-800": "255 236 128",
    "--color-tertiary-900": "255 247 222",
    "--color-tertiary-950": "254 251 237",

    /* Error */
    "--color-error-0": "83 19 19",
    "--color-error-50": "127 29 29",
    "--color-error-100": "153 27 27",
    "--color-error-200": "185 28 28",
    "--color-error-300": "220 38 38",
    "--color-error-400": "230 53 53",
    "--color-error-500": "239 68 68",
    "--color-error-600": "249 97 96",
    "--color-error-700": "229 91 90",
    "--color-error-800": "254 202 202",
    "--color-error-900": "254 226 226",
    "--color-error-950": "254 233 233",

    /* Success */
    "--color-success-0": "27 50 36",
    "--color-success-50": "20 83 45",
    "--color-success-100": "22 101 52",
    "--color-success-200": "32 111 62",
    "--color-success-300": "42 121 72",
    "--color-success-400": "52 131 82",
    "--color-success-500": "72 151 102",
    "--color-success-600": "102 181 132",
    "--color-success-700": "132 211 162",
    "--color-success-800": "162 241 192",
    "--color-success-900": "202 255 232",
    "--color-success-950": "228 255 244",

    /* Warning */
    "--color-warning-0": "84 45 18",
    "--color-warning-50": "108 56 19",
    "--color-warning-100": "130 68 23",
    "--color-warning-200": "180 90 26",
    "--color-warning-300": "215 108 31",
    "--color-warning-400": "231 120 40",
    "--color-warning-500": "251 149 75",
    "--color-warning-600": "253 173 116",
    "--color-warning-700": "254 205 170",
    "--color-warning-800": "255 231 213",
    "--color-warning-900": "255 244 237",
    "--color-warning-950": "255 249 245",

    /* Info */
    "--color-info-0": "3 38 56",
    "--color-info-50": "5 64 93",
    "--color-info-100": "7 90 131",
    "--color-info-200": "9 115 168",
    "--color-info-300": "11 141 205",
    "--color-info-400": "13 166 242",
    "--color-info-500": "50 180 244",
    "--color-info-600": "87 194 246",
    "--color-info-700": "124 207 248",
    "--color-info-800": "162 221 250",
    "--color-info-900": "199 235 252",
    "--color-info-950": "236 248 254",

    /* Typography */
    "--color-typography-0": "23 23 23",
    "--color-typography-50": "38 38 39",
    "--color-typography-100": "64 64 64",
    "--color-typography-200": "82 82 82",
    "--color-typography-300": "115 115 115",
    "--color-typography-400": "140 140 140",
    "--color-typography-500": "163 163 163",
    "--color-typography-600": "212 212 212",
    "--color-typography-700": "219 219 220",
    "--color-typography-800": "229 229 229",
    "--color-typography-900": "245 245 245",
    "--color-typography-950": "254 254 255",

    /* Outline */
    "--color-outline-0": "26 23 23",
    "--color-outline-50": "39 38 36",
    "--color-outline-100": "65 65 65",
    "--color-outline-200": "83 82 82",
    "--color-outline-300": "115 116 116",
    "--color-outline-400": "140 141 141",
    "--color-outline-500": "165 163 163",
    "--color-outline-600": "211 211 211",
    "--color-outline-700": "221 220 219",
    "--color-outline-800": "230 230 230",
    "--color-outline-900": "243 243 243",
    "--color-outline-950": "253 254 254",

    /* Background */
    "--color-background-0": "18 18 18",
    "--color-background-50": "39 38 37",
    "--color-background-100": "65 64 64",
    "--color-background-200": "83 82 82",
    "--color-background-300": "116 116 116",
    "--color-background-400": "142 142 142",
    "--color-background-500": "162 163 163",
    "--color-background-600": "213 212 212",
    "--color-background-700": "229 228 228",
    "--color-background-800": "242 241 241",
    "--color-background-900": "246 246 246",
    "--color-background-950": "255 255 255",

    /* Background Special */
    "--color-background-error": "66 43 43",
    "--color-background-warning": "65 47 35",
    "--color-background-success": "28 43 33",
    "--color-background-muted": "51 51 51",
    "--color-background-info": "26 40 46",

    /* Focus Ring Indicator  */
    "--color-indicator-primary": "247 247 247",
    "--color-indicator-info": "161 199 245",
    "--color-indicator-error": "232 70 69",
  }),
};
