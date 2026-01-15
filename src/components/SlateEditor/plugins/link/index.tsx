/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Node, Transforms, ElementType } from "slate";
import { jsx as slatejsx } from "slate-hyperscript";
import {
  createDataAttributes,
  createHtmlTag,
  createPlugin,
  createSerializer,
  parseElementAttributes,
  PluginConfiguration,
} from "@ndla/editor";
import { ContentLinkEmbedData } from "@ndla/types-embed";
import { isContentLinkElement, isLinkElement } from "./queries";
import { CONTENT_LINK_ELEMENT_TYPE, CONTENT_LINK_PLUGIN, LINK_ELEMENT_TYPE, LINK_PLUGIN, LinkEmbedData } from "./types";
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

export const linkSerializer = createSerializer({
  deserialize(el, children) {
    if (el.tagName.toLowerCase() !== "a") return;
    const a = el as HTMLLinkElement;
    return slatejsx(
      "element",
      {
        type: LINK_ELEMENT_TYPE,
        data: {
          href: a.href ?? "#",
          target: a.target !== "" ? a.target : undefined,
          title: a.title !== "" ? a.title : undefined,
          rel: a.rel !== "" ? a.rel : undefined,
        },
      },
      children,
    );
  },
  serialize(node, children) {
    if (!isLinkElement(node)) return;
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
  },
});

export const contentLinkSerializer = createSerializer({
  deserialize(el, children) {
    if (el.tagName.toLowerCase() !== TYPE_NDLA_EMBED) return;
    const embed = el as HTMLEmbedElement;
    const embedAttributes = parseElementAttributes(Array.from(embed.attributes));
    if (embedAttributes.resource !== "content-link") return;
    return slatejsx(
      "element",
      {
        type: CONTENT_LINK_ELEMENT_TYPE,
        data: embedAttributes,
      },
      children,
    );
  },
  serialize(node, children) {
    if (!isContentLinkElement(node)) return;
    const data = createDataAttributes({
      contentId: node.data.contentId,
      openIn: node.data.openIn,
      resource: "content-link",
      contentType: node.data.contentType,
    });
    return createHtmlTag({ tag: TYPE_NDLA_EMBED, data, bailOnEmpty: true, children });
  },
});

const normalizeNode =
  <T extends ElementType>(type: T): PluginConfiguration<T, undefined>["normalize"] =>
  (editor, node, path, logger) => {
    if (!Node.isElement(node) || node.type !== type) return false;
    if (Node.string(node) === "") {
      // we unwrap instead of remove here to keep the cursor position in the new paragraph
      logger.log("Link element is empty, unwrapping it");
      Transforms.unwrapNodes(editor, { at: path });
      return true;
    }
    const nonTextEntries = Array.from(node.children.entries()).filter(([_, child]) => !Node.isText(child));
    if (nonTextEntries.length) {
      logger.log("Link element contains non-text children, unwrapping them");
      editor.withoutNormalizing(() => {
        for (const [index] of nonTextEntries) {
          Transforms.unwrapNodes(editor, { at: path.concat(index) });
        }
        return true;
      });
    }
    return false;
  };

// TODO: Consider changing the implementation in frontend-packages to allow for customizing the type checked for in normalizer.
// This would allow us to use the same normalizer for both link and content-link elements.
// We also need to change the serializer if we choose to go through with that.

export const linkPlugin = createPlugin({
  name: LINK_PLUGIN,
  type: LINK_ELEMENT_TYPE,
  isInline: true,
  normalize: normalizeNode(LINK_ELEMENT_TYPE),
});

export const contentLinkPlugin = createPlugin({
  name: CONTENT_LINK_PLUGIN,
  type: CONTENT_LINK_ELEMENT_TYPE,
  isInline: true,
  normalize: normalizeNode(CONTENT_LINK_ELEMENT_TYPE),
});
