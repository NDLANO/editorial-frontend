/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import escapeHtml from "escape-html";
import compact from "lodash/compact";
import toArray from "lodash/toArray";
import { cloneElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Descendant, Node, Text } from "slate";
import { AudioEmbedData, ImageEmbedData } from "@ndla/types-embed";
import { convertFromHTML } from "./convertFromHTML";
import { parseEmbedTag, createEmbedTag, createEmbedTagV2 } from "./embedTagHelpers";
import { Plain } from "./slatePlainSerializer";
import { SlateSerializer } from "../components/SlateEditor/interfaces";
import { asideSerializer } from "../components/SlateEditor/plugins/aside";
import { audioSerializer } from "../components/SlateEditor/plugins/audio";
import { blockQuoteSerializer } from "../components/SlateEditor/plugins/blockquote";
import { breakSerializer } from "../components/SlateEditor/plugins/break";
import { campaignBlockSerializer } from "../components/SlateEditor/plugins/campaignBlock";
import { codeblockSerializer } from "../components/SlateEditor/plugins/codeBlock";
import { commentBlockSerializer } from "../components/SlateEditor/plugins/comment/block";
import { commentInlineSerializer } from "../components/SlateEditor/plugins/comment/inline";
import { blockConceptSerializer } from "../components/SlateEditor/plugins/concept/block";
import { inlineConceptSerializer } from "../components/SlateEditor/plugins/concept/inline";
import { contactBlockSerializer } from "../components/SlateEditor/plugins/contactBlock";
import { copyrightSerializer } from "../components/SlateEditor/plugins/copyright";
import { definitionListSerializer } from "../components/SlateEditor/plugins/definitionList";
import { detailsSerializer } from "../components/SlateEditor/plugins/details";
import { divSerializer } from "../components/SlateEditor/plugins/div";
import { embedSerializer } from "../components/SlateEditor/plugins/embed";
import { defaultEmbedBlock, isSlateEmbed } from "../components/SlateEditor/plugins/embed/utils";
import { externalSerializer } from "../components/SlateEditor/plugins/external";
import { fileSerializer } from "../components/SlateEditor/plugins/file";
import { footnoteSerializer } from "../components/SlateEditor/plugins/footnote";
import { framedContentSerializer } from "../components/SlateEditor/plugins/framedContent";
import { gridSerializer } from "../components/SlateEditor/plugins/grid";
import { h5pSerializer } from "../components/SlateEditor/plugins/h5p";
import { headingSerializer } from "../components/SlateEditor/plugins/heading";
import { imageSerializer } from "../components/SlateEditor/plugins/image";
import { keyFigureSerializer } from "../components/SlateEditor/plugins/keyFigure";
import { linkSerializer } from "../components/SlateEditor/plugins/link";
import { linkBlockListSerializer } from "../components/SlateEditor/plugins/linkBlockList";
import { listSerializer } from "../components/SlateEditor/plugins/list";
import { markSerializer } from "../components/SlateEditor/plugins/mark";
import { mathmlSerializer } from "../components/SlateEditor/plugins/mathml";
import { noEmbedSerializer } from "../components/SlateEditor/plugins/noEmbed";
import { noopSerializer } from "../components/SlateEditor/plugins/noop";
import { TYPE_NOOP } from "../components/SlateEditor/plugins/noop/types";
import { paragraphSerializer } from "../components/SlateEditor/plugins/paragraph";
import { TYPE_PARAGRAPH } from "../components/SlateEditor/plugins/paragraph/types";
import { pitchSerializer } from "../components/SlateEditor/plugins/pitch";
import { relatedSerializer } from "../components/SlateEditor/plugins/related";
import { sectionSerializer } from "../components/SlateEditor/plugins/section";
import { TYPE_SECTION } from "../components/SlateEditor/plugins/section/types";
import { spanSerializer } from "../components/SlateEditor/plugins/span";
import { tableSerializer } from "../components/SlateEditor/plugins/table";
import { disclaimerSerializer } from "../components/SlateEditor/plugins/uuDisclaimer";
import { Embed } from "../interfaces";

export const sectionSplitter = (html: string) => {
  const node = document.createElement("div");
  node.insertAdjacentHTML("beforeend", html);
  const sections = [];
  for (let i = 0; i < node.children.length; i += 1) {
    sections.push(node.children[i].outerHTML);
  }
  node.remove();
  return sections;
};

export const createEmptyValue = (): Descendant[] => [
  {
    type: TYPE_SECTION,
    children: [
      {
        type: TYPE_PARAGRAPH,
        children: [
          {
            text: "",
          },
        ],
      },
    ],
  },
];

export const createNoop = (): Descendant[] => [{ type: TYPE_NOOP, children: [{ text: "" }] }];

// Rules are checked from first to last
const extendedRules: SlateSerializer[] = [
  noopSerializer,
  paragraphSerializer,
  sectionSerializer,
  breakSerializer,
  markSerializer,
  linkSerializer,
  blockQuoteSerializer,
  headingSerializer,
  listSerializer,
  definitionListSerializer,
  footnoteSerializer,
  mathmlSerializer,
  inlineConceptSerializer,
  blockConceptSerializer,
  commentInlineSerializer,
  commentBlockSerializer,
  asideSerializer,
  disclaimerSerializer,
  fileSerializer,
  detailsSerializer,
  tableSerializer,
  relatedSerializer,
  gridSerializer,
  pitchSerializer,
  codeblockSerializer,
  keyFigureSerializer,
  contactBlockSerializer,
  campaignBlockSerializer,
  linkBlockListSerializer,
  audioSerializer,
  imageSerializer,
  h5pSerializer,
  externalSerializer,
  copyrightSerializer,
  embedSerializer,
  framedContentSerializer,
  divSerializer,
  spanSerializer,
];

// Rules are checked from first to last
const commonRules: SlateSerializer[] = [
  noopSerializer,
  paragraphSerializer,
  sectionSerializer,
  breakSerializer,
  markSerializer,
  linkSerializer,
  blockQuoteSerializer,
  headingSerializer,
  listSerializer,
  definitionListSerializer,
  footnoteSerializer,
  mathmlSerializer,
  inlineConceptSerializer,
  commentInlineSerializer,
  noEmbedSerializer,
  divSerializer,
  spanSerializer,
];

const articleContentToHTML = (value: Descendant[], rules: SlateSerializer[]) => {
  const serialize = (node: Descendant, nodeIdx: number): JSX.Element | null => {
    let children: JSX.Element[];
    if (Text.isText(node)) {
      children = [escapeHtml(node.text)];
    } else {
      children = compact(node.children.map((n: Descendant, idx: number) => serialize(n, idx)));
    }

    for (const rule of rules) {
      if (!rule.serialize) {
        continue;
      }
      const ret = rule.serialize(node, children);

      if (ret === undefined) {
        continue;
      } else if (ret === null) {
        return null;
      } else {
        return cloneElement(ret, { key: nodeIdx });
      }
    }
    return <>{children}</>;
  };

  const elements = value
    .map((descendant: Descendant, idx: number) => {
      const html = serialize(descendant, idx);
      return html ? renderToStaticMarkup(html) : "";
    })
    .join("");

  return elements.replace(/<deleteme><\/deleteme>/g, "");
};

const articleContentToEditorValue = (html: string, rules: SlateSerializer[], noop?: boolean) => {
  if (!html) {
    return noop ? createNoop() : createEmptyValue();
  }
  const deserialize = (el: HTMLElement | ChildNode): Descendant | Descendant[] => {
    if (el.nodeType === 3) {
      return { text: el.textContent || "" };
    } else if (el.nodeType !== 1) {
      return { text: "" };
    }

    let children = Array.from(el.childNodes).flatMap(deserialize);
    if (children.length === 0) {
      children = [{ text: "" }];
    }

    for (const rule of rules) {
      if (!rule.deserialize) {
        continue;
      }
      // Already checked that nodeType === 1 -> el must be of type HTMLElement.
      const ret = rule.deserialize(el as HTMLElement, children);
      if (ret === undefined) {
        continue;
      } else {
        return ret;
      }
    }

    return children;
  };

  const document = new DOMParser().parseFromString(noop ? `<div data-noop="true">${html}</div>` : html, "text/html");
  const nodes = toArray(document.body.children).map(deserialize);
  const normalizedNodes = compact(nodes.map((n) => convertFromHTML(Node.isNodeList(n) ? n[0] : n)));
  return normalizedNodes;
};

export const blockContentToEditorValue = (html: string): Descendant[] => {
  return articleContentToEditorValue(html, extendedRules);
};

export function blockContentToHTML(contentValues: Descendant[]) {
  return articleContentToHTML(contentValues, extendedRules);
}

export function inlineContentToEditorValue(html: string, noop?: boolean) {
  return articleContentToEditorValue(html, commonRules, noop);
}

export function inlineContentToHTML(value: Descendant[]) {
  return articleContentToHTML(value, commonRules);
}

export function plainTextToEditorValue(text: string): Descendant[] {
  return Plain.deserialize(text);
}

export function editorValueToPlainText(editorValue?: Descendant[]) {
  return editorValue ? Plain.serialize(editorValue) : "";
}

export function embedToEditorValue(embed?: Partial<Embed>) {
  return embed ? [defaultEmbedBlock(embed)] : [];
}

export function embedTagToEditorValue(embedTag: string) {
  const embed = parseEmbedTag(embedTag);
  return embed ? embedToEditorValue(embed) : [];
}

export function editorValueToEmbed(editorValue?: Descendant[]) {
  const embed = editorValue && editorValue[0];
  if (embed && isSlateEmbed(embed)) return embed.data;
  else return undefined;
}

export function editorValueToEmbedTag(editorValue?: Descendant[]) {
  const embed = editorValueToEmbed(editorValue);
  if (embed) {
    const embedTag =
      embed?.resource === "audio" || embed?.resource === "image"
        ? createEmbedTagV2<ImageEmbedData | AudioEmbedData>(embed, undefined, undefined)
        : createEmbedTag(embed, undefined);
    return embedTag ? renderToStaticMarkup(embedTag) : "";
  }
  return "";
}
