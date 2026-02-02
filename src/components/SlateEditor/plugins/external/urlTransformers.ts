/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from "../../../../config";
import { fetchNrkMedia } from "../../../../modules/video/nrkApi";
import { urlAsATag } from "../../../../util/htmlHelpers";

interface UrlTransformer {
  domains: string[];
  shouldTransform: (url: string, domains: string[]) => boolean;
  transform: (url: string) => Promise<string>;
}

// Fetches media-id from url and returns embed url
const nrkTransformer: UrlTransformer = {
  domains: ["nrk.no", "www.nrk.no"],
  shouldTransform: (url, domains) => {
    const aTag = urlAsATag(url);

    if (!domains.includes(aTag.hostname)) {
      return false;
    }

    const oldMediaId = new URLSearchParams(aTag.search).get("mediaId");
    const newMediaId = Number(aTag.pathname.split("/skole-deling/")[1]);
    const mediaId = newMediaId ? newMediaId : oldMediaId;
    if (mediaId) {
      return true;
    }
    return false;
  },
  transform: async (url) => {
    const aTag = urlAsATag(url);
    const oldMediaId = new URLSearchParams(aTag.search).get("mediaId");
    const newMediaId = Number(aTag.pathname.split("/skole-deling/")[1]);
    const mediaId = newMediaId ? newMediaId : oldMediaId;
    if (!mediaId) {
      return url;
    }
    try {
      const nrkMedia = await fetchNrkMedia(mediaId);
      if (nrkMedia.psId) {
        return `https://static.nrk.no/ludo/latest/video-embed.html#id=${nrkMedia.psId}`;
      }
      return url;
    } catch {
      return url;
    }
  },
};

// Replaces www-hostname with embed-hostname
const tedTransformer: UrlTransformer = {
  domains: ["www.ted.com"],
  shouldTransform: (url, domains) => {
    const aTag = urlAsATag(url);

    if (!domains.includes(aTag.hostname)) {
      return false;
    }
    return true;
  },
  transform: async (url) => {
    const obj = new URL(url);
    obj.host = obj.host.replace(/www/, "embed");
    return obj.href;
  },
};

// Replaces 'pen' with 'embed' in path
const codepenTransformer: UrlTransformer = {
  domains: ["codepen.io"],
  shouldTransform: (url, domains) => {
    const aTag = urlAsATag(url);

    if (!domains.includes(aTag.hostname)) {
      return false;
    }
    if (!aTag.href.includes("/pen/")) {
      return false;
    }
    return true;
  },
  transform: async (url) => {
    const obj = new URL(url);
    obj.pathname = obj.pathname.replace(/pen/, "embed");
    const penID = obj.pathname.split("/").pop();
    if (penID) {
      return obj.href;
    }
    return url;
  },
};

// Ensures url ends with /embed
const flourishTransformer: UrlTransformer = {
  domains: ["public.flourish.studio", "flo.uri.sh"],
  shouldTransform: (url, domains) => {
    const aTag = urlAsATag(url);

    if (!domains.includes(aTag.hostname)) {
      return false;
    }
    if (aTag.href.endsWith("/embed")) {
      return false;
    }
    return true;
  },
  transform: async (url) => {
    const obj = new URL(url);
    const parts = obj.pathname.split("/").filter((n) => n);
    parts.push("embed");
    obj.pathname = parts.join("/");
    return obj.href;
  },
};

// Replaces 'model' with 'embed' in path
const sketchupTransformer: UrlTransformer = {
  domains: ["3dwarehouse.sketchup.com"],
  shouldTransform: (url, domains) => {
    const aTag = urlAsATag(url);

    if (!domains.includes(aTag.hostname)) {
      return false;
    }
    if (!aTag.href.includes("/model/")) {
      return false;
    }
    return true;
  },
  transform: async (url) => {
    const obj = new URL(url);
    obj.pathname = obj.pathname.replace(/model/, "embed");
    const parts = obj.pathname.split("/");
    const index =
      parts.findIndex((part) => part.match(/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/)) ??
      parts.length;
    obj.pathname = parts.slice(0, index + 1).join("/");
    return obj.href;
  },
};

const sketcfabTransformer: UrlTransformer = {
  domains: ["sketchfab.com"],
  shouldTransform: (url, domains) => {
    const aTag = urlAsATag(url);

    if (!domains.includes(aTag.hostname)) {
      return false;
    }
    if (!aTag.href.includes("/3d-models/")) {
      return false;
    }
    return true;
  },
  transform: async (url) => {
    const embedId = url.split("-").pop();
    if (embedId?.match(/\b[0-9a-f]{32}/)) {
      return `https://sketchfab.com/models/${embedId}/embed`;
    }
    return url;
  },
};

const jeopardyLabTransformer: UrlTransformer = {
  domains: ["jeopardylabs.com"],
  shouldTransform: (url, domains) => {
    const aTag = urlAsATag(url);

    if (!domains.includes(aTag.hostname)) {
      return false;
    }
    if (!aTag.href.includes("/play/")) {
      return false;
    }
    return true;
  },
  transform: async (url) => {
    if (url.endsWith("?embed=1")) {
      return url;
    }
    return url.concat("?embed=1");
  },
};

const gapminderTransformer: UrlTransformer = {
  domains: ["www.gapminder.org"],
  shouldTransform: (url, domains) => {
    const aTag = urlAsATag(url);

    if (!domains.includes(aTag.hostname)) {
      return false;
    }
    if (aTag.href.includes("?embedded=true")) {
      return false;
    }
    return true;
  },
  transform: async (url) => {
    const parts = url.split("/tools/");
    return parts.join("/tools/?embedded=true");
  },
};

const norgesfilmTransformer: UrlTransformer = {
  domains: ["ndla.filmiundervisning.no", "ndla2.filmiundervisning.no"],
  shouldTransform: (url, domains) => {
    const aTag = urlAsATag(url);

    if (!config.norgesfilmNewUrl) {
      return false;
    }

    if (!domains.includes(aTag.hostname)) {
      return false;
    }
    if (!aTag.href.includes("ndlafilm.aspx?filmId=")) {
      return false;
    }
    return true;
  },
  transform: async (url) => {
    const parts = url.split("ndlafilm.aspx?filmId=");
    return parts.join("");
  },
};

export const urlTransformers: UrlTransformer[] = [
  nrkTransformer,
  codepenTransformer,
  tedTransformer,
  flourishTransformer,
  sketchupTransformer,
  sketcfabTransformer,
  jeopardyLabTransformer,
  gapminderTransformer,
  norgesfilmTransformer,
];
