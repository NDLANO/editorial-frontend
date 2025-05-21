/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant } from "slate";
import {
  createDataAttributes,
  createHtmlTag,
  deserializeFromHtml,
  NOOP_ELEMENT_TYPE,
  PARAGRAPH_ELEMENT_TYPE,
  serializeToHtml,
  SlateSerializer,
} from "@ndla/editor";
import { AudioEmbedData, BrightcoveEmbedData, H5pEmbedData, ImageEmbedData } from "@ndla/types-embed";
import { parseEmbedTag } from "./embedTagHelpers";
import { Plain } from "./slatePlainSerializer";
import { blocks, inlines, isVisualElementSlateElement } from "../components/SlateEditor/helpers";
import { asideSerializer } from "../components/SlateEditor/plugins/aside/asideSerializer";
import { audioSerializer } from "../components/SlateEditor/plugins/audio/audioSerializer";
import { blockQuoteSerializer } from "../components/SlateEditor/plugins/blockquote/blockquoteSerializer";
import { breakSerializer } from "../components/SlateEditor/plugins/break";
import { campaignBlockSerializer } from "../components/SlateEditor/plugins/campaignBlock";
import { codeblockSerializer } from "../components/SlateEditor/plugins/codeBlock";
import { commentBlockSerializer } from "../components/SlateEditor/plugins/comment/block";
import { commentInlineSerializer } from "../components/SlateEditor/plugins/comment/inline";
import { blockConceptSerializer } from "../components/SlateEditor/plugins/concept/block";
import { inlineConceptSerializer } from "../components/SlateEditor/plugins/concept/inline";
import { contactBlockSerializer } from "../components/SlateEditor/plugins/contactBlock";
import { copyrightSerializer } from "../components/SlateEditor/plugins/copyright";
import { definitionDescriptionSerializer } from "../components/SlateEditor/plugins/definitionList/definitionDescriptionPlugin";
import { definitionListSerializer } from "../components/SlateEditor/plugins/definitionList/definitionListPlugin";
import { definitionTermSerializer } from "../components/SlateEditor/plugins/definitionList/definitionTermPlugin";
import { detailsSerializer } from "../components/SlateEditor/plugins/details/detailsSerializer";
import { summarySerializer } from "../components/SlateEditor/plugins/details/summarySerializer";
import { divSerializer } from "../components/SlateEditor/plugins/div";
import { embedSerializer } from "../components/SlateEditor/plugins/embed";
import { TYPE_NDLA_EMBED } from "../components/SlateEditor/plugins/embed/types";
import { defaultEmbedBlock } from "../components/SlateEditor/plugins/embed/utils";
import { externalSerializer, iframeSerializer } from "../components/SlateEditor/plugins/external";
import { fileSerializer } from "../components/SlateEditor/plugins/file";
import { footnoteSerializer } from "../components/SlateEditor/plugins/footnote";
import { framedContentSerializer } from "../components/SlateEditor/plugins/framedContent/framedContentSerializer";
import { gridCellSerializer } from "../components/SlateEditor/plugins/grid/gridCellPlugin";
import { gridSerializer } from "../components/SlateEditor/plugins/grid/gridPlugin";
import { h5pSerializer } from "../components/SlateEditor/plugins/h5p";
import { headingSerializer } from "../components/SlateEditor/plugins/heading";
import { imageSerializer } from "../components/SlateEditor/plugins/image";
import { keyFigureSerializer } from "../components/SlateEditor/plugins/keyFigure";
import { contentLinkSerializer, linkSerializer } from "../components/SlateEditor/plugins/link";
import { linkBlockListSerializer } from "../components/SlateEditor/plugins/linkBlockList";
import { listSerializer } from "../components/SlateEditor/plugins/list";
import { markSerializer } from "../components/SlateEditor/plugins/mark";
import { mathmlSerializer } from "../components/SlateEditor/plugins/mathml/mathSerializer";
import { noEmbedSerializer } from "../components/SlateEditor/plugins/noEmbed";
import { noopSerializer } from "../components/SlateEditor/plugins/noop";
import { paragraphSerializer } from "../components/SlateEditor/plugins/paragraph";
import { pitchSerializer } from "../components/SlateEditor/plugins/pitch";
import { relatedSerializer } from "../components/SlateEditor/plugins/related";
import { sectionSerializer } from "../components/SlateEditor/plugins/section";
import { TYPE_SECTION } from "../components/SlateEditor/plugins/section/types";
import { spanSerializer } from "../components/SlateEditor/plugins/span";
import { symbolSerializer } from "../components/SlateEditor/plugins/symbol/serializer";
import {
  tableBodySerializer,
  tableCaptionSerializer,
  tableCellSerializer,
  tableHeaderSerializer,
  tableHeadSerializer,
  tableRowSerializer,
  tableSerializer,
} from "../components/SlateEditor/plugins/table/tableSerializers";
import { disclaimerSerializer } from "../components/SlateEditor/plugins/uuDisclaimer";
import { brightcoveSerializer } from "../components/SlateEditor/plugins/video";
import { Embed, ErrorEmbed } from "../interfaces";

export const createEmptyValue = (): Descendant[] => [
  {
    type: TYPE_SECTION,
    children: [
      {
        type: PARAGRAPH_ELEMENT_TYPE,
        children: [
          {
            text: "",
          },
        ],
      },
    ],
  },
];

export const createNoop = (): Descendant[] => [{ type: NOOP_ELEMENT_TYPE, children: [{ text: "" }] }];

// Rules are checked from first to last
const extendedRules: SlateSerializer<any>[] = [
  noopSerializer,
  paragraphSerializer,
  sectionSerializer,
  breakSerializer,
  markSerializer,
  linkSerializer,
  contentLinkSerializer,
  blockQuoteSerializer,
  headingSerializer,
  listSerializer,
  definitionListSerializer,
  definitionDescriptionSerializer,
  definitionTermSerializer,
  footnoteSerializer,
  mathmlSerializer,
  inlineConceptSerializer,
  blockConceptSerializer,
  commentInlineSerializer,
  commentBlockSerializer,
  asideSerializer,
  disclaimerSerializer,
  fileSerializer,
  summarySerializer,
  detailsSerializer,
  tableSerializer,
  tableRowSerializer,
  tableCaptionSerializer,
  tableHeadSerializer,
  tableBodySerializer,
  tableCellSerializer,
  tableHeaderSerializer,
  relatedSerializer,
  gridSerializer,
  gridCellSerializer,
  pitchSerializer,
  codeblockSerializer,
  keyFigureSerializer,
  contactBlockSerializer,
  campaignBlockSerializer,
  linkBlockListSerializer,
  audioSerializer,
  imageSerializer,
  brightcoveSerializer,
  h5pSerializer,
  externalSerializer,
  iframeSerializer,
  copyrightSerializer,
  symbolSerializer,
  embedSerializer,
  framedContentSerializer,
  divSerializer,
  spanSerializer,
];

// Rules are checked from first to last
const commonRules: SlateSerializer<any>[] = [
  noopSerializer,
  paragraphSerializer,
  sectionSerializer,
  breakSerializer,
  markSerializer,
  linkSerializer,
  contentLinkSerializer,
  blockQuoteSerializer,
  headingSerializer,
  listSerializer,
  definitionListSerializer,
  definitionDescriptionSerializer,
  definitionTermSerializer,
  footnoteSerializer,
  mathmlSerializer,
  inlineConceptSerializer,
  commentInlineSerializer,
  noEmbedSerializer,
  divSerializer,
  spanSerializer,
  symbolSerializer,
];

export const blockContentToEditorValue = (html: string): Descendant[] => {
  return deserializeFromHtml(html, extendedRules, { inlines, blocks });
};

export function blockContentToHTML(contentValues: Descendant[]) {
  return serializeToHtml(contentValues, extendedRules);
}

export function inlineContentToEditorValue(html: string, noop?: boolean) {
  return deserializeFromHtml(html, commonRules, { noop, inlines, blocks });
}

export function inlineContentToHTML(value: Descendant[]) {
  return serializeToHtml(value, commonRules);
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
  if (embed && isVisualElementSlateElement(embed)) return embed.data;
  else return undefined;
}

export function editorValueToEmbedTag(editorValue?: Descendant[]) {
  const embed = editorValueToEmbed(editorValue);
  if (embed) {
    const embedTag = createHtmlTag<"ndlaembed">({
      tag: TYPE_NDLA_EMBED,
      data: createDataAttributes<ErrorEmbed | ImageEmbedData | BrightcoveEmbedData | AudioEmbedData | H5pEmbedData>(
        embed,
      ),
      bailOnEmpty: true,
    });
    return embedTag ?? "";
  }
  return "";
}
