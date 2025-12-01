/** Represents the tables users can interact with */

const KIND_IDS = ["business", "seller_profile"] as const;
export type ResourceKind = (typeof KIND_IDS)[number];

const KIND_MAP = {
  business: { label: "Business" },
  seller_profile: { label: "Seller Profile" },
} satisfies Record<ResourceKind, { label: string }>;

export const RESOURCES = {
  KIND: {
    IDS: KIND_IDS,
    MAP: KIND_MAP,
  },
};
