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
import { reduceElementDataAttributesV2 } from "../../../../util/embedTagHelpers";
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
      const embedAttributes = reduceElementDataAttributesV2(Array.from(embed.attributes));
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
  serialize(node: Descendant, children: JSX.Element[]) {
    if (!Element.isElement(node)) return;
    if (node.type === TYPE_LINK) {
      return (
        <a href={node.data?.href} target={node.data?.target} title={node.data?.title} rel={node.data?.rel}>
          {children}
        </a>
      );
    }
    if (node.type === TYPE_CONTENT_LINK) {
      return (
        <ndlaembed
          data-content-id={node.data.contentId}
          data-open-in={node.data.openIn}
          data-resource="content-link"
          data-content-type={node.data.contentType}
        >
          {children}
        </ndlaembed>
      );
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
