/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Element, Text, Node, Transforms, Path, Range } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { ContentLinkEmbedData } from "@ndla/types-embed";
import { TYPE_CONTENT_LINK, TYPE_LINK } from "./types";
import { reduceElementDataAttributesV2 } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";
import { KEY_ARROW_RIGHT } from "../../utils/keys";
import { TYPE_NDLA_EMBED } from "../embed/types";

export interface LinkElement {
  type: "link";
  href: string;
  target?: string;
  title?: string;
  rel?: string;
  children: Descendant[];
}

export interface ContentLinkElement {
  type: "content-link";
  data: ContentLinkEmbedData;
  children: Descendant[];
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
          href: a.href ?? "#",
          target: a.target !== "" ? a.target : undefined,
          title: a.title !== "" ? a.title : undefined,
          rel: a.rel !== "" ? a.rel : undefined,
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
        <a href={node.href} target={node.target} title={node.title} rel={node.rel}>
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
  const { isInline: nextIsInline, normalizeNode: nextNormalizeNode, onKeyDown: nextOnKeyDown } = editor;

  editor.onKeyDown = (e) => {
    if (e.key === KEY_ARROW_RIGHT) {
      if (editor.selection) {
        const [entry] = Editor.nodes<ContentLinkElement | LinkElement>(editor, {
          at: Editor.unhangRange(editor, editor.selection),
          match: (n) => Element.isElement(n) && (n.type === "link" || n.type === "content-link"),
        });
        if (entry) {
          const [node, path] = entry;
          if (Node.string(node).length - 1 === editor.selection.anchor.offset) {
            Transforms.select(editor, Path.next(path));
            Transforms.collapse(editor, { edge: "start" });
            return;
          }
        }
      }
    }
    return nextOnKeyDown?.(e);
  };

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
