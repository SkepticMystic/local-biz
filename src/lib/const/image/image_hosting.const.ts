import { MEGABYTE } from "$lib/components/ui/file-drop-zone";

const PROVIDER_IDS = ["cloudinary"] as const;

export const IMAGE_HOSTING = {
  PROVIDER: {
    IDS: PROVIDER_IDS,
  },

  BLURHASH: {
    COMPONENTS: { X: 4, Y: 4 },
  },

  LIMITS: {
    MAX_FILE_SIZE_BYTES: 5 * MEGABYTE, // Megabytes

    MAX_COUNT: {
      PER_RESOURCE: 10,
    },
  },
};
