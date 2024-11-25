/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element } from "slate";
import { TYPE_FILE } from "./types";
import { defaultFileBlock } from "./utils";
import { File } from "../../../../interfaces";
import { createEmbedTag } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";
import { defaultBlockNormalizer, NormalizerConfig } from "../../utils/defaultNormalizer";
import { afterOrBeforeTextBlockElement } from "../../utils/normalizationHelpers";
import { TYPE_PARAGRAPH } from "../paragraph/types";

export interface FileElement {
  type: "file";
  data: File[];
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

export const fileSerializer: SlateSerializer = {
  deserialize(el: HTMLElement) {
    if (el.tagName.toLowerCase() !== "div") return;
    if (el.dataset.type !== TYPE_FILE) return;

    const children: DOMStringMap[] = [];
    el.childNodes.forEach((node) => {
      children.push((node as HTMLEmbedElement).dataset);
    });
    return defaultFileBlock(children);
  },
  serialize(node: Descendant) {
    if (!Element.isElement(node)) return;
    if (node.type !== TYPE_FILE) return;
    const children = node.data.map((file) => createEmbedTag(file, file.path));
    return <div data-type="file">{children}</div>;
  },
};

export const filePlugin = (editor: Editor) => {
  const { normalizeNode: nextNormalizeNode, isVoid: nextIsVoid } = editor;

  editor.isVoid = (element: Element) => {
    if (element.type === TYPE_FILE) {
      return true;
    }
    return nextIsVoid(element);
  };

  editor.normalizeNode = (entry) => {
    const [node] = entry;

    if (Element.isElement(node) && node.type === TYPE_FILE) {
      if (defaultBlockNormalizer(editor, entry, normalizerConfig)) {
        return;
      }
    }
    nextNormalizeNode(entry);
  };

  return editor;
};
