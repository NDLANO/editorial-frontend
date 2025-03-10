/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Element, Node } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { EmbedElements, ErrorEmbedElement } from ".";
import { TYPE_EMBED_ERROR } from "./types";
import { Embed } from "../../../../interfaces";
import { AudioElement, AUDIO_ELEMENT_TYPE } from "../audio/audioTypes";
import { H5pElement, TYPE_H5P } from "../h5p/types";
import { ImageElement, TYPE_IMAGE } from "../image/types";
import { BrightcoveEmbedElement, TYPE_EMBED_BRIGHTCOVE } from "../video/types";

export const defaultEmbedBlock = (data: Partial<Embed>) =>
  slatejsx("element", { type: defineTypeOfEmbed(data?.resource), data }, { text: "" });

export const isSlateEmbed = (
  node: Node,
): node is H5pElement | ImageElement | AudioElement | ErrorEmbedElement | BrightcoveEmbedElement => {
  return (
    Element.isElement(node) &&
    (node.type === TYPE_EMBED_ERROR ||
      node.type === TYPE_IMAGE ||
      node.type === AUDIO_ELEMENT_TYPE ||
      node.type === TYPE_H5P ||
      node.type === TYPE_EMBED_BRIGHTCOVE)
  );
};

export const defineTypeOfEmbed = (type?: string) => {
  if (type === "video" || type === "brightcove") {
    return TYPE_EMBED_BRIGHTCOVE;
  } else if (type === "h5p") {
    return TYPE_H5P;
  } else if (type === "image") {
    return TYPE_IMAGE;
  } else if (type === "audio") {
    return AUDIO_ELEMENT_TYPE;
  } else if (type === undefined) {
    return TYPE_EMBED_ERROR;
  }
  return type;
};

export const isSlateEmbedElement = (element: Element): element is EmbedElements => isEmbedType(element.type);

export const isEmbedType = (type: string) => type === TYPE_EMBED_ERROR;
