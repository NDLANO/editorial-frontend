/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Editor, Descendant, BaseEditor, NodeEntry, BaseRange, BaseSelection, Node, Element } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor, RenderElementProps, RenderLeafProps } from "slate-react";
import { AsideElement } from "./plugins/aside";
import { AudioElement } from "./plugins/audio/types";
import { BlockQuoteElement } from "./plugins/blockquote";
import { BlogPostElement } from "./plugins/blogPost/types";
import { BreakElement } from "./plugins/break";
import { CampaignBlockElement } from "./plugins/campaignBlock";
import { CodeblockElement } from "./plugins/codeBlock";
import { ConceptBlockElement } from "./plugins/concept/block/interfaces";
import { ConceptInlineElement } from "./plugins/concept/inline/interfaces";
import { ConceptListElement } from "./plugins/conceptList";
import { ContactBlockElement } from "./plugins/contactBlock";
import { DefinitionDescriptionElement, DefinitionListElement, DefinitionTermElement } from "./plugins/definitionList";
import { DetailsElement, SummaryElement } from "./plugins/details";
import { DivElement } from "./plugins/div";
import { BrightcoveEmbedElement, ErrorEmbedElement, ExternalEmbedElement, ImageEmbedElement } from "./plugins/embed";
import { FileElement } from "./plugins/file";
import { FootnoteElement } from "./plugins/footnote";
import { FramedContentElement } from "./plugins/framedContent";
import { GridCellElement, GridElement } from "./plugins/grid";
import { H5pElement } from "./plugins/h5p/types";
import { HeadingElement } from "./plugins/heading";
import { KeyFigureElement } from "./plugins/keyFigure";
import { ContentLinkElement, LinkElement } from "./plugins/link";
import { LinkBlockListElement } from "./plugins/linkBlockList/types";
import { ListElement, ListItemElement } from "./plugins/list";
import { CustomTextWithMarks } from "./plugins/mark";
import { MathmlElement } from "./plugins/mathml";
import { ParagraphElement } from "./plugins/paragraph";
import { RelatedElement } from "./plugins/related";
import { SectionElement } from "./plugins/section";
import { SpanElement } from "./plugins/span";
import {
  TableBodyElement,
  TableCaptionElement,
  TableCellElement,
  TableElement,
  TableHeadElement,
  TableRowElement,
} from "./plugins/table/interfaces";
import { DisclaimerElement } from "./plugins/uuDisclaimer/types";

export type SlatePlugin = (editor: Editor) => Editor;

export interface SlateSerializer {
  deserialize: (el: HTMLElement, children: Descendant[]) => Descendant | Descendant[] | undefined;
  serialize: (node: Descendant, children: JSX.Element[]) => JSX.Element | null | undefined;
}

export type CustomEditor = {
  onKeyDown?: (event: KeyboardEvent) => void;
  renderElement?: (props: RenderElementProps) => JSX.Element | undefined;
  renderLeaf?: (props: RenderLeafProps) => JSX.Element | undefined;
  lastSelection?: BaseSelection;
  lastSelectedBlock?: Node;
  removeSection?: () => void;
  shouldShowToolbar: () => boolean;
  shouldHideBlockPicker?: () => boolean | undefined;
  decorations?: (editor: Editor, entry: NodeEntry) => BaseRange[];
  mathjaxInitialized?: boolean;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor & CustomEditor;
    Element:
      | ParagraphElement
      | SectionElement
      | BreakElement
      | LinkElement
      | ContentLinkElement
      | BlockQuoteElement
      | HeadingElement
      | ListElement
      | ListItemElement
      | FootnoteElement
      | MathmlElement
      | ConceptInlineElement
      | ConceptBlockElement
      | AsideElement
      | FileElement
      | DetailsElement
      | SummaryElement
      | CodeblockElement
      | TableElement
      | TableCaptionElement
      | TableRowElement
      | TableCellElement
      | TableHeadElement
      | TableBodyElement
      | RelatedElement
      | ImageEmbedElement
      | BrightcoveEmbedElement
      | AudioElement
      | ErrorEmbedElement
      | ExternalEmbedElement
      | H5pElement
      | FramedContentElement
      | DivElement
      | SpanElement
      | ConceptListElement
      | DefinitionListElement
      | DefinitionDescriptionElement
      | DefinitionTermElement
      | BlogPostElement
      | GridElement
      | GridCellElement
      | KeyFigureElement
      | ContactBlockElement
      | CampaignBlockElement
      | LinkBlockListElement
      | DisclaimerElement;
    Text: CustomTextWithMarks;
  }
}

export type ElementType = Element["type"];
