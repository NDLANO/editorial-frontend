/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element } from "slate";
import { ConceptListEmbedData, EmbedData } from "@ndla/types-embed";
import { TYPE_CONCEPT_LIST } from "./types";
import { defaultConceptListBlock } from "./utils";
import { createEmbedTagV2, reduceElementDataAttributesV2 } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";
import { defaultBlockNormalizer, NormalizerConfig } from "../../utils/defaultNormalizer";
import { afterOrBeforeTextBlockElement } from "../../utils/normalizationHelpers";
import { TYPE_NDLA_EMBED } from "../embed/types";
import { TYPE_PARAGRAPH } from "../paragraph/types";

export interface ConceptListElement {
  type: "concept-list";
  data: ConceptListEmbedData;
  isFirstEdit?: boolean;
  children: Descendant[];
}

const normalizerConfig: NormalizerConfig = {
  previous: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: TYPE_PARAGRAPH,
  },
  next: {
    allowed: afterOrBeforeTextBlockElement,
    defaultType: TYPE_PARAGRAPH,
  },
};

export const conceptListSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = reduceElementDataAttributesV2(Array.from(embed.attributes)) as EmbedData;
    if (embedAttributes.resource !== "concept-list") return;
    return defaultConceptListBlock(embedAttributes);
  },
  serialize(node: Descendant) {
    if (!Element.isElement(node)) return;
    if (node.type !== TYPE_CONCEPT_LIST) return;
    return createEmbedTagV2(node.data);
  },
};

export const conceptListPlugin = (editor: Editor) => {
  const { isVoid, normalizeNode } = editor;

  editor.isVoid = (element: Element) => {
    if (element.type === TYPE_CONCEPT_LIST) {
      return true;
    }
    return isVoid(element);
  };

  editor.normalizeNode = (entry) => {
    const [node] = entry;

    if (Element.isElement(node) && node.type === TYPE_CONCEPT_LIST) {
      if (!defaultBlockNormalizer(editor, entry, normalizerConfig)) {
        return normalizeNode(entry);
      }
    } else {
      normalizeNode(entry);
    }
  };

  return editor;
};
