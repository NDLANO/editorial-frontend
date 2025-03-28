/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CampaignBlockEmbedData } from "@ndla/types-embed";
import { Descendant } from "slate";

export interface CampaignBlockElement {
  type: "campaign-block";
  data?: CampaignBlockEmbedData;
  isFirstEdit?: boolean;
  children: Descendant[];
}

export const CAMPAIGN_BLOCK_ELEMENT_TYPE = "campaign-block";
export const CAMPAIGN_BLOCK_PLUGIN = "campaign-block";
