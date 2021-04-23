import { Element, Editor, Descendant, BaseEditor } from 'new-slate';
import { HistoryEditor } from 'new-slate-history';
import { ReactEditor, RenderElementProps, RenderLeafProps } from 'new-slate-react';
import React from 'react';
import { BreakElement } from './plugins/break';
import { CustomTextWithMarks } from './plugins/mark';
import { ParagraphElement } from './plugins/paragraph';
import { SectionElement } from './plugins/section';

export type SlatePlugin = (editor: Editor) => Editor;

export interface SlateSerializer {
  serialize: (node: Descendant, children: string) => string | undefined | null;
  deserialize: (
    el: HTMLElement,
    children: (Descendant[] | Descendant | null)[],
  ) => Descendant[] | Descendant | undefined;
}
export type CustomText = { text: string } & CustomTextWithMarks;

export type CustomEditor = {
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  renderElement?: (props: RenderElementProps) => JSX.Element | undefined;
  renderLeaf?: (props: RenderLeafProps) => JSX.Element | undefined;
};

declare module 'new-slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor & CustomEditor;
    Element: ParagraphElement | SectionElement | BreakElement;
    Text: CustomText;
  }
}
