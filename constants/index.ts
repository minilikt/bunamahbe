export const coffeeRegions = [
  {
    name: "Sidama",
    description: "Known for its bright, wine-like acidity and complex berry flavors from the southern highlands.",
    flavorNotes: ["Blueberry", "Citrus", "Floral"],
    rating: 4.9,
  },
  {
    name: "Yirgacheffe",
    description: "The crown jewel of Ethiopian coffee, with delicate jasmine and stone fruit characteristics.",
    flavorNotes: ["Jasmine", "Peach", "Bergamot"],
    rating: 4.8,
  },
  {
    name: "Jimma",
    description: "Full-bodied and earthy, Jimma coffees carry the wild spirit of western Ethiopia.",
    flavorNotes: ["Chocolate", "Earthy", "Spice"],
    rating: 4.6,
  },
  {
    name: "Harar",
    description: "Ancient coffee city producing naturally processed beans with bold, fruity intensity.",
    flavorNotes: ["Blueberry", "Wine", "Dark Chocolate"],
    rating: 4.7,
  },
];

export interface Candidate {
  id: string;
  name: string;
  handle: string;
  statement: string;
  voteCount: number;
}

export const candidates: Candidate[] = [
  {
    id: "1",
    name: "Ante",
    handle: "ant_kenz",
    statement: "I've lived coffee culture for years. Now I represent every true Ethiopian coffee lover.",
    voteCount: 1247,
  },
  {
    id: "2",
    name: "Kebron / KB",
    handle: "kzeru",
    statement: "I will take Ethiopian coffee culture global and connect our community beyond borders.",
    voteCount: 982,
  },
  {
    id: "3",
    name: "Ab Kassa",
    handle: "ablex13",
    statement: "Like hip-hop legends before us, I'll prove who truly represents Ethiopian coffee culture.",
    voteCount: 856,
  },
  {
    id: "4",
    name: "Maria",
    handle: "marina.maria1",
    statement: "Women built coffee culture. I'll honor them with home delivery and celebration of ceremony.",
    voteCount: 1103,
  },
  {
    id: "5",
    name: "Bitsiet",
    handle: "bitsiet_asrat16",
    statement: "I promise cheaper coffee, celebration beans, and coffee wisdom included even in marriage counseling.",
    voteCount: 678,
  },
  {
    id: "6",
    name: "Fikrushiferaw",
    handle: "fikrur21",
    statement: "I've tasted 190 Ethiopian coffees. Experience matters when leading true coffee lovers.",
    voteCount: 921,
  },
  {
    id: "7",
    name: "Selamawit Tegen",
    handle: "selamawittegen",
    statement: "I represent the beauty and tradition of authentic Ethiopian coffee ceremony culture.",
    voteCount: 1045,
  },
  {
    id: "8",
    name: "Lila Coffee Man",
    handle: "lila162130",
    statement: "The community already chose me through coffee passion shared daily with loyal viewers.",
    voteCount: 789,
  },
  {
    id: "9",
    name: "Nardyk",
    handle: "nardykk",
    statement: "I grow, study, and drink coffee from tree to cup. True expertise begins at origin.",
    voteCount: 634,
  },
  {
    id: "10",
    name: "GK Coffee",
    handle: "gkcar5",
    statement: "As a certified cupper, I bring professional tasting knowledge to guide our coffee community.",
    voteCount: 567,
  },
  {
    id: "11",
    name: "Dr. Mickey Anteneh",
    handle: "mickey_anteneh",
    statement: "Doctors run on coffee. Medical professionals deserve representation in the coffee community leadership.",
    voteCount: 823,
  },
  {
    id: "12",
    name: "Miss Coffee",
    handle: "fikafosi",
    statement: "I stand as one of the original candidates, ready to represent dedicated coffee enthusiasts.",
    voteCount: 445,
  },
  {
    id: "13",
    name: "Wegen",
    handle: "wegen78",
    statement: "Women lead coffee culture already. Now leadership should officially reflect that reality.",
    voteCount: 912,
  },
  {
    id: "14",
    name: "Sofoniyas",
    handle: "sofoniyas_dreams",
    statement: "I will defend coffee supremacy and eliminate rival drinks from cultural dominance.",
    voteCount: 734,
  },
];

export const CITY_COORDINATES: Record<string, { cx: number; cy: number }> = {
  "Addis Ababa": { cx: 396.5, cy: 398.5 },
  "Afar": { cx: 525.3, cy: 197.4 },
  "Amara": { cx: 349.4, cy: 229.6 },
  "Bahir Dar": { cx: 349.4, cy: 229.6 },
  "Gondar": { cx: 330.4, cy: 180.6 }, // Estimated near Amara
  "Benishangul Gumz": { cx: 201.7, cy: 302.7 },
  "Dire Dawa": { cx: 585.2, cy: 362 },
  "Gambela": { cx: 128.4, cy: 468.8 },
  "Harari": { cx: 602, cy: 379.9 },
  "Harar": { cx: 602, cy: 379.9 },
  "Oromia": { cx: 462.9, cy: 487 },
  "Adama": { cx: 462.9, cy: 437 }, // Near Oromia center
  "Jimma": { cx: 312.9, cy: 487 }, // Western Oromia
  "Sidama": { cx: 370.8, cy: 536.5 },
  "Hawassa": { cx: 370.8, cy: 536.5 },
  "Somali": { cx: 722.1, cy: 522.7 },
  "Tigray": { cx: 421.9, cy: 102.8 },
  "Mekelle": { cx: 421.9, cy: 102.8 },
  "SNNP": { cx: 268.4, cy: 568.9 },
  "Arba Minch": { cx: 268.4, cy: 620 }, // Near SNNP
};
