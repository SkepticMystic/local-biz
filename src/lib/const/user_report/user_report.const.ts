const REASON_IDS = ["duplicate", "spam", "inappropriate", "other"] as const;

export const USER_REPORT = {
  REASON: {
    IDS: REASON_IDS,
    MAP: {
      duplicate: {
        label: "Duplicate",
      },
      spam: {
        label: "Spam",
      },
      inappropriate: {
        label: "Inappropriate",
      },
      other: {
        label: "Other",
      },
    } satisfies Record<(typeof REASON_IDS)[number], { label: string }>,
  },
};
