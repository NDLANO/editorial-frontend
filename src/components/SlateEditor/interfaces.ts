import { Editor } from 'new-slate';

export type SlatePlugin = (editor: Editor) => Editor;

export type CustomText = { text: string };
export type CustomElement = { type: 'paragraph'; children: CustomText[] };
export type CustomEditor = {
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
};
