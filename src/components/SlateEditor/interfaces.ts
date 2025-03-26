/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Editor, Descendant, BaseEditor, BaseSelection, Node, Element } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";
import {
  CustomEditor as _CustomEditor,
  BreakElement,
  HeadingElement,
  ListElement,
  ListItemElement,
  NoopElement,
  ParagraphElement,
  SectionElement,
} from "@ndla/editor";
import { AsideElement } from "./plugins/aside/asideTypes";
import { AudioElement } from "./plugins/audio/audioTypes";
import { BlockQuoteElement } from "./plugins/blockquote/blockquoteTypes";
import { CampaignBlockElement } from "./plugins/campaignBlock/types";
import { CodeBlockElement } from "./plugins/codeBlock/types";
import { CommentBlockElement, CommentInlineElement } from "./plugins/comment/interfaces";
import { ConceptBlockElement } from "./plugins/concept/block/interfaces";
import { ConceptInlineElement } from "./plugins/concept/inline/interfaces";
import { ContactBlockElement } from "./plugins/contactBlock";
import { CopyrightElement } from "./plugins/copyright/types";
import { DefinitionDescriptionElement, DefinitionListElement, DefinitionTermElement } from "./plugins/definitionList";
import { DetailsElement } from "./plugins/details/detailsTypes";
import { SummaryElement } from "./plugins/details/summaryTypes";
import { DivElement } from "./plugins/div";
import { ErrorEmbedElement } from "./plugins/embed";
import { ExternalElement, IframeElement } from "./plugins/external/types";
import { FileElement } from "./plugins/file";
import { FootnoteElement } from "./plugins/footnote";
import { FramedContentElement } from "./plugins/framedContent/framedContentTypes";
import { GridCellElement, GridElement } from "./plugins/grid";
import { H5pElement } from "./plugins/h5p/types";
import { ImageElement } from "./plugins/image/types";
import { KeyFigureElement } from "./plugins/keyFigure";
import { ContentLinkElement, LinkElement } from "./plugins/link";
import { LinkBlockListElement } from "./plugins/linkBlockList/types";
import { CustomTextWithMarks } from "./plugins/mark";
import { MathmlElement } from "./plugins/mathml/mathTypes";
import { PitchElement } from "./plugins/pitch/types";
import { RelatedElement } from "./plugins/related";
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
import { BrightcoveEmbedElement } from "./plugins/video/types";

export type SlatePlugin = (editor: Editor) => Editor;

export interface SlateSerializer {
  deserialize: (el: HTMLElement, children: Descendant[]) => Descendant | Descendant[] | undefined;
  serialize: (node: Descendant, children: string | undefined) => string | undefined;
}

export interface CustomEditor extends _CustomEditor {
  lastSelection?: BaseSelection;
  lastSelectedBlock?: Node;
  shouldShowToolbar: () => boolean;
  shouldHideBlockPicker?: () => boolean | undefined;
  mathjaxInitialized?: boolean;
}

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
      | CodeBlockElement
      | TableElement
      | TableCaptionElement
      | TableRowElement
      | TableCellElement
      | TableHeadElement
      | TableBodyElement
      | RelatedElement
      | BrightcoveEmbedElement
      | AudioElement
      | ImageElement
      | ErrorEmbedElement
      | H5pElement
      | FramedContentElement
      | DivElement
      | SpanElement
      | DefinitionListElement
      | DefinitionDescriptionElement
      | DefinitionTermElement
      | PitchElement
      | GridElement
      | GridCellElement
      | KeyFigureElement
      | ContactBlockElement
      | CampaignBlockElement
      | LinkBlockListElement
      | DisclaimerElement
      | NoopElement
      | ExternalElement
      | IframeElement
      | CopyrightElement
      | CommentInlineElement
      | CommentBlockElement;
    Text: CustomTextWithMarks;
  }
}

export type ElementType = Element["type"];
