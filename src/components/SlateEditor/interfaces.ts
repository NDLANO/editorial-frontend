import { Editor, Descendant, BaseEditor } from 'new-slate';
import { HistoryEditor } from 'new-slate-history';
import { ReactEditor, RenderElementProps, RenderLeafProps } from 'new-slate-react';
import React from 'react';
import { BlockQuoteElement } from './plugins/blockquote';
import { BreakElement } from './plugins/break';
import { HeadingElement } from './plugins/heading';
import { ContentLinkElement, LinkElement } from './plugins/link';
import { CustomTextWithMarks } from './plugins/mark';
import { ParagraphElement } from './plugins/paragraph';
import { SectionElement } from './plugins/section';
import { ListElement, ListText } from './plugins/list';

export type SlatePlugin = (editor: Editor) => Editor;

export interface SlateSerializer {
  serialize: (node: Descendant, children: string) => string | undefined | null;
  deserialize: (el: HTMLElement, children: (Descendant | null)[]) => Descendant | undefined;
}

export type CustomEditor = {
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  renderElement?: (props: RenderElementProps) => JSX.Element | undefined;
  renderLeaf?: (props: RenderLeafProps) => JSX.Element | undefined;
  removeSection?: () => void;
};

declare module 'new-slate' {
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
      | ListText;
    Text: CustomTextWithMarks;
  }
}
