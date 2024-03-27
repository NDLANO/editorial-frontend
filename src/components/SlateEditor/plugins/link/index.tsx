/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ElementType } from "react";
import { Descendant, Editor, Element, Text, Node, Transforms, NodeEntry } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import { ContentLinkEmbedData } from "@ndla/types-embed";
import { TYPE_CONTENT_LINK, TYPE_LINK } from "./types";
import { reduceElementDataAttributesV2 } from "../../../../util/embedTagHelpers";
import { SlateSerializer } from "../../interfaces";
import { TYPE_NDLA_EMBED } from "../embed/types";
import { Normalize, createPlugin } from "../PluginFactory";

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

const unwrapPargraphsInLink = ([node, path]: NodeEntry<Element>, editor: Editor) => {
  for (const [index, child] of node.children.entries()) {
    if (!Text.isText(child)) {
      Transforms.unwrapNodes(editor, { at: [...path, index] });
      return true;
    }
  }
  return false;
};
const removeEmptyLinkNodes = ([node, path]: NodeEntry, editor: Editor) => {
  if (Node.string(node) === "") {
    Transforms.removeNodes(editor, { at: path });
    return true;
  }
  return false;
};

const normalizeLink: Normalize<LinkElement | ContentLinkElement>[] = [
  { description: "Remove empty nodes", normalize: removeEmptyLinkNodes },
  { description: "Unwrap paragraphs in link", normalize: unwrapPargraphsInLink },
];

export const linkPlugin = createPlugin<LinkElement["type"]>({
  type: TYPE_LINK,
  isInline: true,
  normalize: normalizeLink,
  childPlugins: [
    {
      type: TYPE_CONTENT_LINK,
      isInline: true,
      normalize: normalizeLink,
    },
  ],
});
