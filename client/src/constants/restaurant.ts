import type { MenuSection } from "@/types";

export const PHONE_NUMBER = "604 489 3765";
export const PHONE_HREF = "tel:6044893765";

export const ADDRESS_LINE_1 = "424 Lake Road, Shop 1";
export const ADDRESS_LINE_2 = "Takapuna, Auckland 0622";
export const ADDRESS_LINE_3 = "New Zealand";

export const TAGLINE = "Authentic Japanese cuisine — Takapuna, Auckland";

export const QUOTE = '"Fresh flavours, tradition in every bite"';

export const OPENING_HOURS: { days: string; time: string }[] = [
  { days: "Sunday – Friday", time: "10:00 AM – 3:00 PM" },
  { days: "Saturday", time: "Closed" },
];

export interface SignatureDish {
  title: string;
  description: string;
  price: string;
  imageUrl: string;
}

export const SIGNATURE_DISHES: SignatureDish[] = [
  {
    title: "Salmon Teriyaki Donburi",
    description: "Tender salmon glazed with teriyaki sauce, served over a bed of steamed rice with seasonal greens.",
    price: "$26.00",
    imageUrl: "",
  },
  {
    title: "Chicken Katsu Curry",
    description: "Crispy chicken katsu smothered in our rich, velvety Japanese curry sauce, served over steamed rice.",
    price: "$24.90",
    imageUrl: "",
  },
  {
    title: "Beef Donburi",
    description: "Tender beef thinly sliced over rice, a comforting Japanese classic with umami-rich flavours in every bite.",
    price: "$21.80",
    imageUrl: "",
  },
];

export interface HomepageMenuGroup {
  label: string;
  items: { name: string; price: string }[];
}

export const HOMEPAGE_MENU_PREVIEW: HomepageMenuGroup[] = [
  {
    label: "DONBURI & BENTO",
    items: [
      { name: "Chicken Teriyaki Donburi", price: "$20.90" },
      { name: "Spicy Pork Donburi", price: "$27.50" },
      { name: "Chicken Matcha Egg Donburi", price: "$23.90" },
      { name: "Tofu Donburi", price: "$27.50" },
    ],
  },
  {
    label: "SUSHI & SIDES",
    items: [
      { name: "Chicken Katsu", price: "$20.90" },
      { name: "Salmon Teriyaki Donburi", price: "$25.00" },
      { name: "Chicken Katsu Curry Donburi", price: "$23.90" },
      { name: "Beef Donburi", price: "$27.50" },
    ],
  },
];

export interface MenuDrinkSubGroup {
  label: string;
  items: { name: string; price: string }[];
}

export interface ExtendedMenuSection extends MenuSection {
  categoryLabel?: string;
  description?: string;
  drinkSubGroups?: MenuDrinkSubGroup[];
}

export const STATIC_MENU: ExtendedMenuSection[] = [
  {
    name: "The Freshest Catch",
    categoryLabel: "SUSHI & SASHIMI",
    description: "",
    items: [
      { title: "Salmon Nigiri", description: "", price1: "$6.90", price1Description: "", imageUrl: "" },
      { title: "Salmon Sashimi (5pc)", description: "", price1: "$18.95", price1Description: "", imageUrl: "" },
      { title: "Tuna Nigiri", description: "", price1: "$7.90", price1Description: "", imageUrl: "" },
      { title: "Mixed Sashimi (8pc)", description: "", price1: "$28.92", price1Description: "", imageUrl: "" },
      { title: "Prawn Nigiri", description: "", price1: "$6.90", price1Description: "", imageUrl: "" },
      { title: "Sushi Platter (12pc)", description: "", price1: "$22.05", price1Description: "", imageUrl: "" },
      { title: "Shrimp Soba", description: "", price1: "$6.90", price1Description: "", imageUrl: "" },
      { title: "Deluxe Sushi Platter (8pc)", description: "", price1: "$43.00", price1Description: "", imageUrl: "" },
    ],
  },
  {
    name: "Hearty Rice Bowls",
    categoryLabel: "DONBURI & KATSU",
    description: "",
    items: [
      { title: "Chicken Teriyaki Donburi", description: "", price1: "$20.92", price1Description: "", imageUrl: "" },
      { title: "Chicken Katsu Curry", description: "", price1: "$22.92", price1Description: "", imageUrl: "" },
      { title: "Salmon Teriyaki Donburi", description: "", price1: "$25.00", price1Description: "", imageUrl: "" },
      { title: "Chicken Katsu Egg Donburi", description: "", price1: "$23.95", price1Description: "", imageUrl: "" },
      { title: "Spicy Pork Donburi", description: "", price1: "$20.40", price1Description: "", imageUrl: "" },
      { title: "Tofu Donburi", description: "", price1: "$20.40", price1Description: "", imageUrl: "" },
      { title: "Beef Donburi", description: "", price1: "$23.97", price1Description: "", imageUrl: "" },
      { title: "Katsu Curry Udon", description: "", price1: "$22.97", price1Description: "", imageUrl: "" },
    ],
  },
  {
    name: "Drinks",
    categoryLabel: "BEVERAGES",
    description: "Complement your meal with our selection of Japanese and Asian beverages.",
    items: [],
    drinkSubGroups: [
      {
        label: "HOT DRINKS",
        items: [
          { name: "Green Tea", price: "$4.50" },
          { name: "Hojicha Latte", price: "$4.50" },
          { name: "Matcha Latte", price: "$4.50" },
          { name: "Miso Soup", price: "$5.00" },
        ],
      },
      {
        label: "COLD DRINKS",
        items: [
          { name: "Yuzu Matcha Latte", price: "$9.00" },
          { name: "Ramune Soda", price: "$2.50" },
          { name: "Calpico", price: "$3.00" },
          { name: "Iced Hojicha Latte", price: "$7.00" },
        ],
      },
      {
        label: "SAKE & BEER",
        items: [
          { name: "Asahi Super Dry", price: "$9.00" },
          { name: "Kirin Ichiban", price: "$8.00" },
          { name: "Mixed Sake (Hot)", price: "$12.00" },
          { name: "Premium Junmai Sake", price: "$18.00" },
        ],
      },
    ],
  },
];
