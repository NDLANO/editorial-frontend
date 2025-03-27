/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { jsx as slatejsx } from "slate-hyperscript";
import { defaultParagraphBlock } from "../paragraph/utils";
import { DETAILS_ELEMENT_TYPE } from "./detailsTypes";
import { SUMMARY_ELEMENT_TYPE } from "./summaryTypes";

export const defaultSummaryBlock = () => slatejsx("element", { type: SUMMARY_ELEMENT_TYPE }, defaultParagraphBlock());

export const defaultDetailsBlock = () =>
  slatejsx("element", { type: DETAILS_ELEMENT_TYPE }, defaultSummaryBlock(), defaultParagraphBlock());
