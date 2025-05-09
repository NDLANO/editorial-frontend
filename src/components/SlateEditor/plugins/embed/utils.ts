/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Element, Node } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { ErrorEmbedElement } from ".";
import { Embed } from "../../../../interfaces";
import { AudioElement, AUDIO_ELEMENT_TYPE } from "../audio/audioTypes";
import { H5pElement, H5P_ELEMENT_TYPE } from "../h5p/types";
import { ImageElement, IMAGE_ELEMENT_TYPE } from "../image/types";
import { BrightcoveEmbedElement, BRIGHTCOVE_ELEMENT_TYPE } from "../video/types";

export const defaultEmbedBlock = (data: Partial<Embed>) =>
  slatejsx("element", { type: data?.resource, data }, { text: "" });

export const isSlateEmbed = (
  node: Node,
): node is H5pElement | ImageElement | AudioElement | ErrorEmbedElement | BrightcoveEmbedElement => {
  return (
    Element.isElement(node) &&
    (node.type === IMAGE_ELEMENT_TYPE ||
      node.type === AUDIO_ELEMENT_TYPE ||
      node.type === H5P_ELEMENT_TYPE ||
      node.type === BRIGHTCOVE_ELEMENT_TYPE)
  );
};
