import { Editor, Descendant, BaseEditor, NodeEntry, BaseRange } from 'slate';
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
import { ConceptElement } from './plugins/concept';
import { AsideElement } from './plugins/aside';
import { FileElement } from './plugins/file';
import { DetailsElement, SummaryElement } from './plugins/details';
import { TableCellElement, TableElement, TableRowElement } from './plugins/table';
import { RelatedElement } from './plugins/related';
import { EmbedElement } from './plugins/embed';
import { BodyboxElement } from './plugins/bodybox';
import { CodeblockElement } from './plugins/codeBlock';
import { VisualElementPickerElement } from './plugins/visualElementPicker';

export type SlatePlugin = (editor: Editor) => Editor;

export interface SlateSerializer {
  deserialize: (el: HTMLElement, children: Descendant[]) => Descendant | Descendant[] | undefined;
  serialize: (node: Descendant, children: (JSX.Element | null)[]) => JSX.Element | null | undefined;
}

export type CustomEditor = {
  onKeyDown?: (event: KeyboardEvent) => void;
  renderElement?: (props: RenderElementProps) => JSX.Element | undefined;
  renderLeaf?: (props: RenderLeafProps) => JSX.Element | undefined;
  removeSection?: () => void;
  shouldShowToolbar: () => boolean;
  shouldShowBlockPicker?: () => boolean;
  decorations?: (editor: Editor, entry: NodeEntry) => BaseRange[];
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
      | ConceptElement
      | AsideElement
      | FileElement
      | DetailsElement
      | SummaryElement
      | CodeblockElement
      | TableElement
      | TableRowElement
      | TableCellElement
      | RelatedElement
      | EmbedElement
      | BodyboxElement
      | VisualElementPickerElement;
    Text: CustomTextWithMarks;
  }
}
