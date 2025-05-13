/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { parseElementAttributes } from "@ndla/editor";
import { TYPE_NDLA_EMBED } from "../components/SlateEditor/plugins/embed/types";
import { isEmpty } from "../components/validators";
import { Embed } from "../interfaces";

export const parseEmbedTag = (embedTag?: string): Embed | undefined => {
  if (!embedTag) {
    return undefined;
  }
  const el = document.createElement("html");
  el.innerHTML = embedTag;
  const embedElements = el.getElementsByTagName(TYPE_NDLA_EMBED);

  if (embedElements.length !== 1) {
    return undefined;
  }

  const obj = parseElementAttributes(Array.from(embedElements[0].attributes));
  delete obj.id;

  return obj as unknown as Embed;
};

export const isUserProvidedEmbedDataValid = (embed: Embed) => {
  if (embed.resource === "image") {
    const isDecorative = embed.isDecorative === "true";
    return isDecorative || (!isDecorative && !isEmpty(embed.alt));
  }
  return true;
};
