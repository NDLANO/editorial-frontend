/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { IImageMetaInformationV3 } from "@ndla/types-backend/image-api";
import {
  AudioEmbedData,
  AudioMeta,
  AudioMetaData,
  BrightcoveEmbedData,
  BrightcoveMetaData,
  ConceptVisualElement,
  ConceptVisualElementMeta,
  H5pData,
  H5pEmbedData,
  H5pMetaData,
  IframeData,
  IframeEmbedData,
  ImageEmbedData,
  ImageMetaData,
  OembedData,
  OembedEmbedData,
} from "@ndla/types-embed";
import { fetchH5PInfo, fetchH5pLicenseInformation, fetchH5pPreviewOembed } from "../../components/H5PElement/h5pApi";
import { fetchExternalOembed } from "../../util/apiHelpers";
import { reduceElementDataAttributesV2 } from "../../util/embedTagHelpers";
import { fetchAudio } from "../audio/audioApi";
import { fetchImage } from "../image/imageApi";
import { fetchBrightcoveSources, fetchBrightcoveVideo, getBrightcoveCopyright } from "../video/brightcoveApi";

export const fetchAudioMeta = async (resourceId: string, language: string): Promise<AudioMeta> => {
  const audio = await fetchAudio(parseInt(resourceId), language);
  let image: IImageMetaInformationV3 | undefined;
  if (audio.podcastMeta?.coverPhoto.id) {
    image = await fetchImage(audio.podcastMeta?.coverPhoto.id, language);
  }

  return {
    ...audio,
    imageMeta: image,
  };
};

export const fetchBrightcoveMeta = async (videoId: string, language: string) => {
  const [sources, brightcoveData] = await Promise.all([fetchBrightcoveSources(videoId), fetchBrightcoveVideo(videoId)]);
  return {
    ...brightcoveData,
    copyright: getBrightcoveCopyright(brightcoveData.custom_fields, language),
    sources,
  };
};

const fetchVisualImageMeta = async (embed: ImageEmbedData, language: string): Promise<ImageMetaData> => {
  try {
    const res = await fetchImage(embed.resourceId, language);
    return {
      resource: "image",
      status: "success",
      data: res,
      embedData: embed,
    };
  } catch (_) {
    return {
      resource: "image",
      status: "error",
      embedData: embed,
      message: "Failed to fetch image",
    };
  }
};

const fetchVisualAudioMeta = async (embed: AudioEmbedData, language: string): Promise<AudioMetaData> => {
  try {
    const res = await fetchAudioMeta(embed.resourceId, language);
    return {
      resource: "audio",
      status: "success",
      embedData: embed,
      data: res,
    };
  } catch (e) {
    return {
      resource: "audio",
      status: "error",
      embedData: embed,
      message: "Failed to fetch audio",
    };
  }
};

export const fetchIframeMeta = async (embed: IframeEmbedData, language: string): Promise<IframeData> => {
  const image = embed.imageid
    ? await fetchImage(embed.imageid, language).catch(() => undefined)
    : await Promise.resolve(undefined);
  return { iframeImage: image };
};

const fetchVisualBrightcoveMeta = async (
  embedData: BrightcoveEmbedData,
  language: string,
): Promise<BrightcoveMetaData> => {
  try {
    const videoId = embedData.videoid.replace("&t=", "");
    const data = await fetchBrightcoveMeta(videoId, language);
    return {
      resource: "brightcove",
      status: "success",
      embedData,
      data,
    };
  } catch (e) {
    return {
      resource: "brightcove",
      status: "error",
      embedData,
      message: "Failed to fetch brightcove video",
    };
  }
};

export const fetchExternalMeta = async (embedData: OembedEmbedData, language: string): Promise<OembedData> => {
  const [oembed, iframeImage] = await Promise.all([
    fetchExternalOembed(embedData.url),
    embedData.imageid
      ? fetchImage(embedData.imageid, language).catch(undefined)
      : Promise.resolve<undefined>(undefined),
  ]);
  return { oembed, iframeImage };
};

export const fetchH5pMeta = async (path: string, url: string): Promise<H5pData> => {
  const pathArr = path.split("/") || [];
  const h5pId = pathArr[pathArr.length - 1];
  const [oembedData, h5pLicenseInformation, h5pInfo] = await Promise.all([
    // This differs from graphql. We only allow preview here
    fetchH5pPreviewOembed(url),
    fetchH5pLicenseInformation(h5pId),
    fetchH5PInfo(h5pId),
  ]);

  return {
    h5pLicenseInformation: {
      h5p: {
        ...h5pLicenseInformation?.h5p,
        authors: h5pLicenseInformation?.h5p.authors ?? [],
        title: h5pInfo?.title ?? "",
      },
    },
    h5pUrl: url,
    oembed: oembedData,
  };
};

export const fetchVisualH5pMeta = async (embedData: H5pEmbedData): Promise<H5pMetaData> => {
  try {
    const data = await fetchH5pMeta(embedData.path, embedData.url);
    return {
      resource: "h5p",
      status: "success",
      embedData,
      data,
    };
  } catch (e) {
    return {
      resource: "h5p",
      status: "error",
      embedData,
      message: "Failed to fetch h5p",
    };
  }
};

export const fetchConceptVisualElement = async (
  visualElement: string,
  language: string,
): Promise<ConceptVisualElementMeta | undefined> => {
  const parsedVisEl = parse(visualElement);
  if (typeof parsedVisEl === "string" || Array.isArray(parsedVisEl)) return;
  const attributes = Object.entries<string>(parsedVisEl.props).map(([name, value]) => ({
    name,
    value,
  }));
  const embed = reduceElementDataAttributesV2(attributes) as ConceptVisualElement;

  if (embed.resource === "image") {
    return await fetchVisualImageMeta(embed, language);
  } else if (embed.resource === "audio") {
    return await fetchVisualAudioMeta(embed, language);
  } else if (embed.resource === "iframe") {
    const data = await fetchIframeMeta(embed, language);
    return { resource: "iframe", status: "success", embedData: embed, data };
  } else if (embed.resource === "brightcove") {
    return await fetchVisualBrightcoveMeta(embed, language);
  } else if (embed.resource === "external") {
    try {
      const data = await fetchExternalMeta(embed, language);
      return {
        resource: "external",
        status: "success",
        embedData: embed,
        data,
      };
    } catch (e) {
      return {
        resource: "external",
        status: "error",
        embedData: embed,
        message: "Failed to fetch external oembed",
      };
    }
  } else if (embed.resource === "h5p") {
    return await fetchVisualH5pMeta(embed);
  }

  return undefined;
};

export const fetchExternal = async (
  embedData: OembedEmbedData | IframeEmbedData,
  language: string,
): Promise<OembedData | IframeData> => {
  if (embedData.resource === "iframe") {
    return await fetchIframeMeta(embedData, language);
  } else {
    return await fetchExternalMeta(embedData, language);
  }
};
