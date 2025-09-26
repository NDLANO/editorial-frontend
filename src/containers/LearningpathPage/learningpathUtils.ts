/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ILearningStepV2DTO } from "@ndla/types-backend/learningpath-api";

const EXTERNAL_EMBED_TYPES = ["oembed", "iframe"];

export function isNDLAEmbedUrl(url: string) {
  return /^https:\/(.*).ndla.no/.test(url) || /^http:\/\/localhost/.test(url);
}

const EMBED_URL_NODE_ID_REGEX = /(resource:[:\da-fA-F-]+)/g;
export const getNodeIdFromEmbedUrl = (embedUrl: string | undefined): string | undefined => {
  return embedUrl?.match(EMBED_URL_NODE_ID_REGEX)?.pop();
};

const isResourceStep = (step?: ILearningStepV2DTO): boolean => {
  if (step?.articleId) return true;
  if (
    !step?.embedUrl?.url ||
    !isNDLAEmbedUrl(step.embedUrl.url) ||
    !EXTERNAL_EMBED_TYPES.includes(step.embedUrl.embedType)
  ) {
    return false;
  }
  const resourceId = getNodeIdFromEmbedUrl(step.embedUrl.url);
  return !!resourceId;
};

export const getFormTypeFromStep = (step?: ILearningStepV2DTO): "text" | "resource" | "external" => {
  if (isResourceStep(step)) {
    return "resource";
  }
  if (!step?.embedUrl) return "text";
  return "external";
};

export const learningStepEditId = (id: number | string) => `learningstep-edit-${id}`;
