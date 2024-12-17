/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element, Text, Node, Transforms } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { ContentLinkEmbedData } from "@ndla/types-embed";
import { LinkEmbedData, TYPE_CONTENT_LINK, TYPE_LINK } from "./types";
import { createDataAttributes, createHtmlTag, parseElementAttributes } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";
import { TYPE_NDLA_EMBED } from "../embed/types";

export interface LinkElement {
  type: "link";
  data: LinkEmbedData;
  children: Descendant[];
  isFirstEdit?: boolean;
}

export interface ContentLinkElement {
  type: "content-link";
  data: ContentLinkEmbedData;
  children: Descendant[];
  isFirstEdit?: boolean;
}

export const linkSerializer: SlateSerializer = {
  deserialize(el: HTMLElement, children: Descendant[]) {
    const tag = el.tagName.toLowerCase();
    if (tag === "a") {
      const a = el as HTMLLinkElement;
      return slatejsx(
        "element",
        {
          type: TYPE_LINK,
          data: {
            href: a.href ?? "#",
            target: a.target !== "" ? a.target : undefined,
            title: a.title !== "" ? a.title : undefined,
            rel: a.rel !== "" ? a.rel : undefined,
          },
        },
        children,
      );
    }
    if (tag === TYPE_NDLA_EMBED) {
      const embed = el as HTMLEmbedElement;
      const embedAttributes = parseElementAttributes(Array.from(embed.attributes));
      if (embedAttributes.resource !== "content-link") return;
      return slatejsx(
        "element",
        {
          type: TYPE_CONTENT_LINK,
          data: embedAttributes,
        },
        children,
      );
    }
    return;
  },
  serialize(node, children) {
    if (!Element.isElement(node)) return;
    if (node.type === TYPE_LINK) {
      return createHtmlTag({
        tag: "a",
        data: {
          href: node.data?.href,
          target: node.data?.target,
          title: node.data?.title,
          rel: node.data?.rel,
        },
        children,
      });
    }
    if (node.type === TYPE_CONTENT_LINK) {
      const data = createDataAttributes({
        contentId: node.data.contentId,
        openIn: node.data.openIn,
        resource: "content-link",
        contentType: node.data.contentType,
      });
      return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, bailOnEmpty: true, children });
    }
  },
};

export const linkPlugin = (editor: Editor) => {
  const { isInline: nextIsInline, normalizeNode: nextNormalizeNode } = editor;

  editor.isInline = (element: Element) => {
    if (element.type === "link" || element.type === "content-link") {
      return true;
    } else {
      return nextIsInline(element);
    }
  };

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;
    if (Element.isElement(node)) {
      if (node.type === "content-link" || node.type === "link") {
        for (const [index, child] of node.children.entries()) {
          if (!Text.isText(child)) {
            return Transforms.unwrapNodes(editor, { at: [...path, index] });
          }
        }
        if (Node.string(node) === "") {
          return Transforms.removeNodes(editor, { at: path });
        }
      }
    }
    nextNormalizeNode(entry);
  };

  return editor;
};
