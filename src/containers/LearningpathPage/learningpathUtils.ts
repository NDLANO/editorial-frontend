/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const EMBED_URL_NODE_ID_REGEX = /(resource:[:\da-fA-F-]+)/g;
export const getNodeIdFromEmbedUrl = (embedUrl: string | undefined): string | undefined => {
  return embedUrl?.match(EMBED_URL_NODE_ID_REGEX)?.pop();
};

export const learningStepEditId = (id: number | string) => `learningstep-edit-${id}`;
