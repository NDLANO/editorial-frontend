import { Element, Editor, Descendant } from 'new-slate';
import { RenderElementProps } from 'new-slate-react';
import React from 'react';

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
