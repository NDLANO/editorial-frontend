/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isElementOfType } from "@ndla/editor";
import { Node } from "slate";
import { FRAMED_CONTENT_ELEMENT_TYPE } from "../framedContentTypes";

export const isFramedContentElement = (node: Node | undefined) => isElementOfType(node, FRAMED_CONTENT_ELEMENT_TYPE);
