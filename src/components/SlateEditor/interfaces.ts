import { Element, Editor } from 'new-slate';

export type SlatePlugin = (editor: Editor) => Editor;

export interface SlateSerializer {
  serialize: (node: Element, children: any) => string;
  deserialize: (el: HTMLElement | ChildNode, children: Element[]) => any;
}
export type CustomText = { text: string };

export type CustomEditor = {
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
};
