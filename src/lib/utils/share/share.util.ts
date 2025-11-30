import type { SHARE } from "$lib/const/share/share.const";
import { result } from "../result.util";
import { Url } from "../urls";

const native = async (data: ShareData) => {
  if (!navigator.share) return result.err();

  try {
    return result.suc(await navigator.share(data));
  } catch (error) {
    console.log("navigator.share error", error);
    return result.err();
  }
};

// SOURCE: https://github.com/bradvin/social-share-urls/blob/master/code/javascript/javascript/social-share-media.js
const build_social_url: Record<
  (typeof SHARE.SOCIAL.IDS)[number],
  (data: ShareData) => URL
> = {
  twitter: (data) =>
    Url.build("https://twitter.com", "/intent/tweet", {
      url: data.url,
      text: data.text,
    }),

  facebook: (data) =>
    Url.build("https://www.facebook.com", "/sharer.php", {
      u: data.url,
    }),

  linkedin: (data) =>
    Url.build("https://www.linkedin.com", "/sharing/share-offsite", {
      url: data.url,
    }),

  whatsapp: (data) =>
    Url.build("https://wa.me", "/", {
      url: data.url,
      text: data.text,
    }),

  telegram: (data) =>
    Url.build("https://t.me", "/share/url", {
      url: data.url,
      text: data.text,
    }),

  reddit: (data) =>
    Url.build("https://www.reddit.com", "/submit", {
      url: data.url,
      title: data.text,
    }),

  pinterest: (data) =>
    Url.build("https://pinterest.com", "/pin/create/button", {
      url: data.url,
      description: data.text,
    }),
};

export const Share = {
  native,
  build_social_url,
};
