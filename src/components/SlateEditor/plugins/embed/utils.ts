/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Element, Node } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { BrightcoveEmbedElement, EmbedElements, ErrorEmbedElement, ExternalEmbedElement, ImageEmbedElement } from ".";
import { TYPE_EMBED_BRIGHTCOVE, TYPE_EMBED_ERROR, TYPE_EMBED_IMAGE } from "./types";
import { Embed } from "../../../../interfaces";
import { AudioElement, TYPE_AUDIO } from "../audio/types";
import { H5pElement, TYPE_H5P } from "../h5p/types";

export const defaultEmbedBlock = (data: Partial<Embed>) =>
  slatejsx("element", { type: defineTypeOfEmbed(data?.resource), data }, { text: "" });

export const isSlateEmbed = (
  node: Node,
): node is
  | H5pElement
  | ImageEmbedElement
  | AudioElement
  | ErrorEmbedElement
  | ExternalEmbedElement
  | BrightcoveEmbedElement => {
  return (
    Element.isElement(node) &&
    (node.type === TYPE_EMBED_BRIGHTCOVE ||
      node.type === TYPE_EMBED_ERROR ||
      node.type === TYPE_H5P ||
      node.type === TYPE_EMBED_IMAGE ||
      node.type === TYPE_AUDIO)
  );
};

export const defineTypeOfEmbed = (type?: string) => {
  if (type === "video" || type === "brightcove") {
    return TYPE_EMBED_BRIGHTCOVE;
  } else if (type === "h5p") {
    return TYPE_H5P;
  } else if (type === "image") {
    return TYPE_EMBED_IMAGE;
  } else if (type === "audio") {
    return TYPE_AUDIO;
  } else if (type === undefined) {
    return TYPE_EMBED_ERROR;
  }
  return type;
};

export const isSlateEmbedElement = (element: Element): element is EmbedElements => isEmbedType(element.type);

export const isEmbedType = (type: string) =>
  type === TYPE_EMBED_BRIGHTCOVE || type === TYPE_EMBED_ERROR || type === TYPE_EMBED_IMAGE;
