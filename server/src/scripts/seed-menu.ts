/**
 * One-time script to seed the "Menu" Google Sheet with Japanese/sushi menu content.
 * Clears the existing sheet data and writes all sections in a single batch operation.
 * Run with: pnpm --filter server tsx src/scripts/seed-menu.ts
 */
import { config } from "../config";
import { googleAuth } from "../config/google";
import { SheetsService } from "../services/sheets";

const MENU_SHEET_NAME = "Menu";

const COLUMN_HEADER_ROW = [
  "title",
  "Description",
  "Price_1_description",
  "Price_1",
  "Price_2_description",
  "Price_2",
  "ImageUrl",
  "Ingredients",
  "Type",
];

// ── Section data ──────────────────────────────────────────────────────────────
// Columns: title | description | price1Desc | price1 | price2Desc | price2 | imageUrl | ingredients | type

const STARTERS: string[][] = [
  [
    "Edamame",
    "Steamed young soybeans lightly seasoned with sea salt",
    "Bowl", "7.50", "", "", "",
    "Soybeans, sea salt",
    "",
  ],
  [
    "Miso Soup",
    "Traditional Japanese soup with silken tofu, wakame seaweed and spring onion in dashi broth",
    "Bowl", "5.00", "", "", "",
    "White miso paste, silken tofu, wakame, spring onion, dashi",
    "",
  ],
  [
    "Gyoza",
    "Crispy pan-fried Japanese pork and cabbage dumplings served with ponzu dipping sauce",
    "5 pcs", "12.00", "10 pcs", "22.00", "",
    "Pork mince, cabbage, ginger, garlic, sesame oil, gyoza wrappers, ponzu sauce",
    "",
  ],
  [
    "Agedashi Tofu",
    "Silken tofu lightly dusted in potato starch, deep-fried to golden perfection, served in dashi broth with grated daikon and spring onion",
    "3 pcs", "11.00", "", "", "",
    "Silken tofu, potato starch, dashi broth, daikon, spring onion, bonito flakes",
    "",
  ],
  [
    "Karaage Chicken",
    "Bite-sized Japanese fried chicken marinated in soy, sake and ginger, served with Kewpie mayo and lemon",
    "Regular", "13.50", "Large", "18.00", "",
    "Chicken thigh, soy sauce, sake, ginger, garlic, potato starch, Kewpie mayo, lemon",
    "",
  ],
  [
    "Sunomono",
    "Refreshing Japanese cucumber and wakame salad with crab stick, dressed in a light rice vinegar and sesame dressing",
    "Bowl", "9.00", "", "", "",
    "Cucumber, wakame, crab stick, rice vinegar, mirin, soy sauce, sesame seeds",
    "",
  ],
];

const MAIN_DISHES: string[][] = [
  [
    "Salmon Nigiri",
    "Delicate slices of fresh Atlantic salmon draped over hand-pressed Japanese sushi rice, seasoned with a touch of wasabi",
    "5 pcs", "16.00", "10 pcs", "30.00", "",
    "Atlantic salmon, sushi rice, rice vinegar, nori, wasabi, pickled ginger",
    "SIGNATURE",
  ],
  [
    "Sashimi Platter",
    "Chef's selection of premium sashimi-grade fish and seafood, sliced to order and served with pickled ginger, wasabi and soy sauce",
    "12 pcs", "32.00", "18 pcs", "46.00", "",
    "Chef's selection of tuna, salmon, kingfish, scallop, pickled ginger, wasabi",
    "SIGNATURE",
  ],
  [
    "Dragon Roll",
    "A showstopper inside-out roll filled with prawn tempura, avocado and cucumber, topped with fresh salmon, tobiko and drizzled with spicy mayo",
    "8 pcs", "22.00", "", "", "",
    "Prawn tempura, avocado, cucumber, salmon, tobiko, spicy mayo, nori, sushi rice",
    "SIGNATURE",
  ],
  [
    "Chicken Teriyaki Donburi",
    "Tender grilled chicken thigh glazed in our house-made teriyaki sauce, served over steamed Japanese short-grain rice with pickled cucumber and shredded nori",
    "Regular", "19.90", "Large", "23.90", "",
    "Chicken thigh, teriyaki sauce, Japanese rice, pickled cucumber, nori, spring onion, sesame",
    "",
  ],
  [
    "Beef Yakiniku Donburi",
    "Thinly sliced marinated beef with caramelised onion in a rich yakiniku sauce, served over steamed Japanese rice, topped with a soft-cooked egg and spring onion",
    "Regular", "23.90", "Large", "27.90", "",
    "Beef sirloin, yakiniku sauce, onion, Japanese rice, soft-cooked egg, spring onion, sesame",
    "HOME",
  ],
  [
    "Chirashi Bowl",
    "A generous bowl of seasoned sushi rice topped with the chef's daily selection of sashimi, ikura, cucumber, tamago and micro herbs",
    "Bowl", "29.90", "", "", "",
    "Chef's selection sashimi, sushi rice, ikura, cucumber, tamago, micro herbs, nori",
    "",
  ],
];

const DESSERTS: string[][] = [
  [
    "Mochi Ice Cream",
    "Soft and chewy Japanese rice cake filled with premium ice cream — choose from matcha, vanilla or mango",
    "3 pcs", "9.50", "", "", "",
    "Sweet rice flour, ice cream (matcha/vanilla/mango), cornstarch",
    "",
  ],
  [
    "Matcha Tiramisu",
    "A Japanese-Italian fusion dessert layered with matcha-soaked sponge fingers, mascarpone cream and a dusting of premium ceremonial-grade matcha",
    "Serving", "11.00", "", "", "",
    "Mascarpone, cream, matcha powder, sponge fingers, sugar, eggs",
    "",
  ],
  [
    "Tempura Ice Cream",
    "Creamy vanilla ice cream encased in a light, crispy tempura shell, served immediately with a drizzle of honey and a dusting of matcha",
    "Serving", "10.50", "", "", "",
    "Vanilla ice cream, tempura batter, honey, matcha powder",
    "",
  ],
];

const DRINKS: string[][] = [
  [
    "Green Tea",
    "Delicate Japanese sencha green tea, served hot",
    "Cup", "4.50", "Pot", "7.50", "",
    "Sencha green tea leaves, hot water",
    "",
  ],
  [
    "Matcha Latte",
    "Premium ceremonial-grade matcha whisked with steamed milk",
    "Regular", "6.50", "Large", "7.50", "",
    "Ceremonial matcha, steamed milk",
    "",
  ],
  [
    "Japanese Black Tea",
    "A smooth, full-bodied Japanese black tea blend",
    "Cup", "4.00", "Pot", "6.50", "",
    "Japanese black tea leaves, hot water",
    "",
  ],
  [
    "Iced Matcha Latte",
    "Chilled ceremonial matcha poured over ice with cold milk",
    "Regular", "7.00", "Large", "8.00", "",
    "Ceremonial matcha, cold milk, ice",
    "",
  ],
  [
    "Ramune",
    "Classic Japanese carbonated soft drink in an iconic glass bottle",
    "Bottle", "5.50", "", "", "",
    "Carbonated water, sugar, citric acid",
    "",
  ],
  [
    "Calpis",
    "A refreshing Japanese fermented milk soft drink, lightly sweet and slightly tangy",
    "Glass", "5.00", "", "", "",
    "Calpis concentrate, water, citric acid",
    "",
  ],
  [
    "Yuzu Lemonade",
    "Bright and refreshing house-made lemonade infused with fragrant Japanese yuzu citrus",
    "Glass", "6.50", "Jug", "22.00", "",
    "Yuzu juice, lemon juice, sugar syrup, soda water, ice",
    "",
  ],
  [
    "Asahi Super Dry",
    "Japan's iconic crisp, clean lager — refreshing with a dry finish",
    "330ml", "8.50", "650ml", "13.00", "",
    "Water, barley malt, rice, hops",
    "",
  ],
  [
    "Sake (Junmai)",
    "A clean, full-bodied junmai sake with a dry finish, served warm or cold",
    "180ml", "12.00", "300ml", "18.00", "",
    "Fermented rice, koji, water",
    "",
  ],
  [
    "Umeshu (Plum Wine)",
    "Traditional Japanese plum wine with a delicate balance of sweet, tart and fruity notes",
    "90ml", "9.50", "", "", "",
    "Japanese plum, sugar, shochu",
    "",
  ],
];

// ── Sheet builder ─────────────────────────────────────────────────────────────

function buildSheetRows(): string[][] {
  const separator: string[] = [""];

  return [
    ["Starters"],
    COLUMN_HEADER_ROW,
    ...STARTERS,
    separator,
    ["Main Dishes"],
    COLUMN_HEADER_ROW,
    ...MAIN_DISHES,
    separator,
    ["Desserts"],
    COLUMN_HEADER_ROW,
    ...DESSERTS,
    separator,
    ["Drinks"],
    COLUMN_HEADER_ROW,
    ...DRINKS,
  ];
}

// ── Runner ────────────────────────────────────────────────────────────────────

async function seedMenu(): Promise<void> {
  const sheetsId = config.google.sheetsId;

  if (!sheetsId) {
    console.error("GOOGLE_SHEETS_ID is not configured");
    process.exit(1);
  }

  const sheetsService = new SheetsService(googleAuth);
  const allRows = buildSheetRows();

  console.log(`Clearing sheet "${MENU_SHEET_NAME}"…`);
  await sheetsService.clearRange(sheetsId, MENU_SHEET_NAME);
  console.log(`✓ Cleared "${MENU_SHEET_NAME}" sheet`);

  console.log(`Writing ${allRows.length} rows…`);
  await sheetsService.batchWrite(sheetsId, `${MENU_SHEET_NAME}!A1`, allRows);
  console.log(`✓ Written ${allRows.length} rows to "${MENU_SHEET_NAME}"`);

  console.log("Done.");
}

seedMenu().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
