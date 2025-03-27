/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { createPlugin, createSerializer, PARAGRAPH_ELEMENT_TYPE } from "@ndla/editor";
import { CAMPAIGN_BLOCK_ELEMENT_TYPE, CAMPAIGN_BLOCK_PLUGIN } from "./types";
import { createDataAttributes, createHtmlTag, parseElementAttributes } from "../../../../util/embedTagHelpers";
import { defaultBlockNormalizer, NormalizerConfig } from "../../utils/defaultNormalizer";
import { afterOrBeforeTextBlockElement } from "../../utils/normalizationHelpers";
import { TYPE_NDLA_EMBED } from "../embed/types";
import { isCampaignBlockElement } from "./queries/campaignBlockQueries";

const normalizerConfig: NormalizerConfig = {
  previous: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
  next: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: PARAGRAPH_ELEMENT_TYPE,
  },
};

export const campaignBlockSerializer = createSerializer({
  deserialize(el) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = parseElementAttributes(Array.from(embed.attributes));
    if (embedAttributes.resource !== CAMPAIGN_BLOCK_ELEMENT_TYPE) return;
    return slatejsx("element", { type: CAMPAIGN_BLOCK_ELEMENT_TYPE, data: embedAttributes }, { text: "" });
  },
  serialize(node) {
    if (!isCampaignBlockElement(node) || !node.data) return;
    const data = createDataAttributes(node.data);
    return createHtmlTag({ tag: TYPE_NDLA_EMBED, data: data, bailOnEmpty: true });
  },
});

export const campaignBlockPlugin = createPlugin({
  name: CAMPAIGN_BLOCK_PLUGIN,
  type: CAMPAIGN_BLOCK_ELEMENT_TYPE,
  isVoid: true,
  normalize: (editor, node, path, logger) => {
    if (isCampaignBlockElement(node)) {
      return defaultBlockNormalizer(editor, node, path, normalizerConfig, logger);
    }
    return false;
  },
});
