import queryString from 'query-string';
import { fetchNrkMedia } from '../../modules/video/nrkApi';
import { urlAsATag } from '../../util/htmlHelpers';

export interface UrlTransformer {
  domains: string[];
  shouldTransform: (url: string, domains: string[]) => boolean;
  transform: (url: string) => Promise<string>;
}

const nrkTransformer: UrlTransformer = {
  domains: ['nrk.no', 'www.nrk.no'],
  shouldTransform: (url, domains) => {
    const aTag = urlAsATag(url);

    if (!domains.includes(aTag.hostname)) {
      return false;
    }

    const oldMediaId = queryString.parse(aTag.search).mediaId;
    const newMediaId = Number(aTag.pathname.split('/skole-deling/')[1]);
    const mediaId = !!newMediaId ? newMediaId : oldMediaId;
    if (mediaId) {
      return true;
    }
    return false;
  },
  transform: async url => {
    const aTag = urlAsATag(url);
    const oldMediaId = queryString.parse(aTag.search).mediaId;
    const newMediaId = Number(aTag.pathname.split('/skole-deling/')[1]);
    const mediaId = !!newMediaId ? newMediaId : oldMediaId;
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

const kahootTransformer: UrlTransformer = {
  domains: ['create.kahoot.it'],
  shouldTransform: (url, domains) => {
    const aTag = urlAsATag(url);

    if (!domains.includes(aTag.hostname)) {
      return false;
    }
    if (!aTag.href.includes(domains[0] + '/share/')) {
      return false;
    }
    const kahootID = url.split('/').pop();
    if (kahootID?.match(/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/)) {
      return true;
    }
    return false;
  },
  transform: async url => {
    const kahootID = url.split('/').pop();
    if (kahootID?.match(/\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/)) {
      return `https://embed.kahoot.it/${kahootID}`;
    }
    return url;
  },
};

const tedTransformer: UrlTransformer = {
  domains: ['www.ted.com'],
  shouldTransform: (url, domains) => {
    const aTag = urlAsATag(url);

    if (!domains.includes(aTag.hostname)) {
      return false;
    }
    return true;
  },
  transform: async url => {
    const obj = new URL(url);
    obj.host = obj.host.replace(/www/, 'embed');
    return obj.href;
  },
};

const codepenTransformer: UrlTransformer = {
  domains: ['codepen.io'],
  shouldTransform: (url, domains) => {
    const aTag = urlAsATag(url);

    if (!domains.includes(aTag.hostname)) {
      return false;
    }
    if (!aTag.href.includes('/pen/')) {
      return false;
    }
    return true;
  },
  transform: async url => {
    const obj = new URL(url);
    obj.pathname = obj.pathname.replace(/pen/, 'embed');
    const penID = obj.pathname.split('/').pop();
    if (penID) {
      return obj.href;
    }
    return url;
  },
};

export const urlTransformers: UrlTransformer[] = [
  nrkTransformer,
  kahootTransformer,
  codepenTransformer,
  tedTransformer,
];
