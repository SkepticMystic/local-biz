const CATEGORY_IDS = [
  "restaurant",
  "retail",
  "service",
  "healthcare",
  "education",
  "entertainment",
  "professional",
  "automotive",
  "home_garden",
  "beauty_wellness",
  "sports_recreation",
  "arts",
  "other",
] as const;

const CATEGORY_MAP = {
  restaurant: {
    label: "Restaurant & Food",
    icon: "lucide/utensils",
  },
  retail: {
    label: "Retail & Shopping",
    icon: "lucide/shopping-bag",
  },
  service: {
    label: "Services",
    icon: "lucide/wrench",
  },
  healthcare: {
    label: "Healthcare",
    icon: "lucide/heart-pulse",
  },
  education: {
    label: "Education",
    icon: "lucide/graduation-cap",
  },
  entertainment: {
    label: "Entertainment",
    icon: "lucide/ticket",
  },
  professional: {
    label: "Professional Services",
    icon: "lucide/briefcase",
  },
  automotive: {
    label: "Automotive",
    icon: "lucide/car",
  },
  home_garden: {
    label: "Home & Garden",
    icon: "lucide/home",
  },
  beauty_wellness: {
    label: "Beauty & Wellness",
    icon: "lucide/sparkles",
  },
  sports_recreation: {
    label: "Sports & Recreation",
    icon: "lucide/dumbbell",
  },
  arts: {
    label: "Arts & Entertainment",
    icon: "lucide/paint-brush",
  },
  other: {
    label: "Other",
    icon: "lucide/tag",
  },
} satisfies Record<CategoryId, { label: string; icon: string }>;

export const BUSINESS = {
  CATEGORY: {
    IDS: CATEGORY_IDS,
    MAP: CATEGORY_MAP,
  },

  TAGS: {
    LIMITS: {
      MAX_PER_RESOURCE: 10,
      MIN_LENGTH: 2,
      MAX_LENGTH: 50,
    },
  },
} as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];
