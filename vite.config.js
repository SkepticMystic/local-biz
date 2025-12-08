import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import sonda from "sonda/sveltekit";

const SONDA = process.env.SONDA;

/** @type {import('vite').UserConfig} */
const config = {
  build: {
    sourcemap: Boolean(SONDA),
    // NOTE: Already the default
    target: "baseline-widely-available",
  },

  plugins: [sentrySvelteKit({ telemetry: false }), tailwindcss(), sveltekit()],
};

if (SONDA) {
  config.plugins?.push(
    sonda({
      server: true,
      open: false,
      deep: true,
      sources: true,
    }),
  );
}

export default config;
