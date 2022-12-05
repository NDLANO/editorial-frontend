import {
  Editor,
  Descendant,
  BaseEditor,
  NodeEntry,
  BaseRange,
  BaseSelection,
  Node,
  Element,
} from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor, RenderElementProps, RenderLeafProps } from 'slate-react';
import { BlockQuoteElement } from './plugins/blockquote';
import { BreakElement } from './plugins/break';
import { FootnoteElement } from './plugins/footnote';
import { HeadingElement } from './plugins/heading';
import { ContentLinkElement, LinkElement } from './plugins/link';
import { CustomTextWithMarks } from './plugins/mark';
import { ParagraphElement } from './plugins/paragraph';
import { SectionElement } from './plugins/section';
import { ListElement, ListItemElement } from './plugins/list';
import { MathmlElement } from './plugins/mathml';
import { ConceptInlineElement } from './plugins/concept/inline/interfaces';
import { AsideElement } from './plugins/aside';
import { FileElement } from './plugins/file';
import { DetailsElement, SummaryElement } from './plugins/details';
import {
  TableBodyElement,
  TableCaptionElement,
  TableCellElement,
  TableElement,
  TableHeadElement,
  TableRowElement,
} from './plugins/table/interfaces';
import { RelatedElement } from './plugins/related';
import { EmbedElement } from './plugins/embed';
import { BodyboxElement } from './plugins/bodybox';
import { CodeblockElement } from './plugins/codeBlock';
import { DivElement } from './plugins/div';
import { SpanElement } from './plugins/span';
import { ConceptListElement } from './plugins/conceptList';
import { ConceptBlockElement } from './plugins/concept/block/interfaces';

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
  shouldShowBlockPicker?: () => boolean;
  decorations?: (editor: Editor, entry: NodeEntry) => BaseRange[];
  mathjaxInitialized?: boolean;
};

declare module 'slate' {
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
      | EmbedElement
      | BodyboxElement
      | DivElement
      | SpanElement
      | ConceptListElement;
    Text: CustomTextWithMarks;
  }
}

export type ElementType = Element['type'];
