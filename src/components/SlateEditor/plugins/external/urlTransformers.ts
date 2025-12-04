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
    const urlObj = urlAsATag(url);
    if (!domains.includes(urlObj.hostname)) {
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
    const urlObj = new URL(url);
    const oldMediaId = new URLSearchParams(urlObj.search).get("mediaId");
    const newMediaId = Number(urlObj.pathname.split("/skole-deling/")[1]);
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
    const urlObj = urlAsATag(url);
    if (!domains.includes(urlObj.hostname)) {
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
    const urlObj = urlAsATag(url);

    if (!domains.includes(urlObj.hostname)) {
      return false;
    }
    if (!urlObj.href.includes("/pen/")) {
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
    const urlObj = urlAsATag(url);
    if (!domains.includes(urlObj.hostname)) {
      return false;
    }
    if (urlObj.href.endsWith("/embed")) {
      return false;
    }
    return true;
  },
  transform: async (url) => {
    const obj = new URL(url);
    obj.pathname = obj.pathname.replace(/\/+$/, "") + "/embed";
    return obj.href;
  },
};

// Replaces 'model' with 'embed' in path
const sketchupTransformer: UrlTransformer = {
  domains: ["3dwarehouse.sketchup.com"],
  shouldTransform: (url, domains) => {
    const urlObj = urlAsATag(url);
    if (!domains.includes(urlObj.hostname)) {
      return false;
    }
    if (!urlObj.href.includes("/model/")) {
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
    const urlObj = urlAsATag(url);
    if (!domains.includes(urlObj.hostname)) {
      return false;
    }
    if (!urlObj.href.includes("/3d-models/")) {
      return false;
    }
    return true;
  },
  transform: async (url) => {
    const urlObj = new URL(url);
    const embedId = urlObj.href.split("-").pop();
    if (embedId?.match(/\b[0-9a-f]{32}/)) {
      urlObj.pathname = `/models/${embedId}/embed`;
    }
    return urlObj.href;
  },
};

const jeopardyLabTransformer: UrlTransformer = {
  domains: ["jeopardylabs.com"],
  shouldTransform: (url, domains) => {
    const urlObj = urlAsATag(url);
    if (!domains.includes(urlObj.hostname)) {
      return false;
    }
    if (!urlObj.href.includes("/play/")) {
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
    const urlObj = urlAsATag(url);
    if (!domains.includes(urlObj.hostname)) {
      return false;
    }
    if (urlObj.href.includes("?embedded=true")) {
      return false;
    }
    return true;
  },
  transform: async (url) => {
    const urlObj = new URL(url);
    urlObj.href = urlObj.href.replace("tools/", "tools/?embedded=true");
    return urlObj.href;
  },
};

const norgesfilmTransformer: UrlTransformer = {
  domains: ["ndla.filmiundervisning.no", "ndla2.filmiundervisning.no"],
  shouldTransform: (url, domains) => {
    const urlObj = urlAsATag(url);
    if (!config.norgesfilmNewUrl) {
      return false;
    }
    if (!domains.includes(urlObj.hostname)) {
      return false;
    }
    if (!urlObj.href.includes("ndlafilm.aspx?filmId=")) {
      return false;
    }
    return true;
  },
  transform: async (url) => {
    const urlObj = new URL(url);
    urlObj.href = urlObj.href.replace("ndlafilm.aspx?filmId=", "");
    return urlObj.href;
  },
};

const kartiskolenTransformer: UrlTransformer = {
  domains: ["kartiskolen.no"],
  shouldTransform: (url, domains) => {
    const urlObj = urlAsATag(url);
    if (!config.kartiskolenEnabled) {
      return false;
    }

    if (!domains.includes(urlObj.hostname)) {
      return false;
    }
    if (urlObj.pathname.startsWith("/embed.html")) {
      return false;
    }
    return true;
  },
  transform: async (url) => {
    const urlObj = new URL(url);
    urlObj.pathname = urlObj.pathname.replace(/\/?$/, "/embed.html");
    return urlObj.href;
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
  kartiskolenTransformer,
];
