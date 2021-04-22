import { Element, Editor, Descendant, BaseEditor } from 'new-slate';
import { HistoryEditor } from 'new-slate-history';
import { ReactEditor, RenderElementProps } from 'new-slate-react';
import React from 'react';
import { BreakElement } from './plugins/break';
import { ParagraphElement } from './plugins/paragraph';
import { SectionElement } from './plugins/section';

export type SlatePlugin = (editor: Editor) => Editor;

export interface SlateSerializer {
  serialize: (node: Element, children: string) => string | undefined | null;
  deserialize: (
    el: HTMLElement,
    children: (Descendant[] | Descendant | null)[],
  ) => Descendant[] | Descendant | undefined;
}
export type CustomText = { text: string };

export type CustomEditor = {
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  renderElement?: (props: RenderElementProps) => JSX.Element | undefined;
};

declare module 'new-slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor & CustomEditor;
    Element: ParagraphElement | SectionElement | BreakElement;
    Text: CustomText;
  }
}
