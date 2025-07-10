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

export const getFormTypeFromStep = (step?: ILearningStepV2DTO): "text" | "resource" | "external" => {
  if (
    step?.embedUrl?.url &&
    EXTERNAL_EMBED_TYPES.includes(step.embedUrl.embedType) &&
    isNDLAEmbedUrl(step.embedUrl.url) &&
    step.embedUrl.url.match(/(resource:[:\da-fA-F-]+)/g)?.pop()
  ) {
    return "resource";
  }
  if (step?.embedUrl?.url && step.embedUrl.embedType === "iframe") return "external";
  if (step?.embedUrl?.url && step.embedUrl.embedType === "oembed" && step.embedUrl.url !== "https://ndla.no")
    return "external";
  // if (!step?.resource && !step?.oembed && !step?.embedUrl) return "text";
  // if (step?.resource || step.embedUrl?.url.includes("resource")) return "resource";
  // if (step?.embedUrl?.embedType === "external") return "external";
  return "text";
};
