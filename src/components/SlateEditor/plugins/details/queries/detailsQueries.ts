/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isElementOfType } from "@ndla/editor";
import { Node } from "slate";
import { DETAILS_ELEMENT_TYPE } from "../detailsTypes";
import { SUMMARY_ELEMENT_TYPE } from "../summaryTypes";

export const isDetailsElement = (node: Node | undefined) => isElementOfType(node, DETAILS_ELEMENT_TYPE);

export const isSummaryElement = (node: Node | undefined) => isElementOfType(node, SUMMARY_ELEMENT_TYPE);
