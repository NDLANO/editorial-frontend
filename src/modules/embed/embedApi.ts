/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { IConceptSummary } from "@ndla/types-backend/concept-api";
import { IImageMetaInformationV3 } from "@ndla/types-backend/image-api";
import {
  AudioEmbedData,
  AudioMeta,
  AudioMetaData,
  BrightcoveEmbedData,
  BrightcoveMetaData,
  ConceptListData,
  ConceptVisualElement,
  ConceptVisualElementMeta,
  H5pData,
  H5pEmbedData,
  H5pMetaData,
  IframeEmbedData,
  IframeMetaData,
  ImageEmbedData,
  ImageMetaData,
  OembedEmbedData,
  OembedMetaData,
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

const fetchVisualIframeMeta = async (embed: IframeEmbedData, language: string): Promise<IframeMetaData> => {
  const image = embed.imageid
    ? await fetchImage(embed.imageid, language).catch((_) => undefined)
    : await Promise.resolve(undefined);

  return {
    resource: "iframe",
    status: "success",
    embedData: embed,
    data: {
      iframeImage: image,
    },
  };
};

const fetchVisualBrightcoveMeta = async (
  embedData: BrightcoveEmbedData,
  language: string,
): Promise<BrightcoveMetaData> => {
  try {
    const videoId = embedData.videoid.replace("&t=", "");
    const [video, sources] = await Promise.all([fetchBrightcoveVideo(videoId), fetchBrightcoveSources(videoId)]);

    return {
      resource: "brightcove",
      status: "success",
      embedData,
      data: {
        ...video,
        copyright: getBrightcoveCopyright(video.custom_fields, language),
        sources,
      },
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

export const fetchVisualExternalMeta = async (
  embedData: OembedEmbedData,
  language: string,
): Promise<OembedMetaData> => {
  try {
    const [oembed, iframeImage] = await Promise.all([
      fetchExternalOembed(embedData.url),
      embedData.imageid
        ? fetchImage(embedData.imageid, language).catch(undefined)
        : Promise.resolve<undefined>(undefined),
    ]);

    return {
      resource: "external",
      status: "success",
      embedData,
      data: { oembed, iframeImage },
    };
  } catch (e) {
    return {
      resource: "external",
      status: "error",
      embedData,
      message: "Failed to fetch external oembed",
    };
  }
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
    return await fetchVisualIframeMeta(embed, language);
  } else if (embed.resource === "brightcove") {
    return await fetchVisualBrightcoveMeta(embed, language);
  } else if (embed.resource === "external") {
    return await fetchVisualExternalMeta(embed, language);
  } else if (embed.resource === "h5p") {
    return await fetchVisualH5pMeta(embed);
  }

  return undefined;
};

export const fetchConceptListMeta = async (concepts: IConceptSummary[], language: string): Promise<ConceptListData> => {
  const conceptsWithVisualElement = await Promise.all(
    concepts.map(async (concept) => {
      if (!concept.visualElement?.visualElement) return { concept };
      const visualElement = await fetchConceptVisualElement(concept.visualElement?.visualElement, language).catch(
        (_) => undefined,
      );
      return { concept, visualElement };
    }),
  );
  return { concepts: conceptsWithVisualElement };
};
