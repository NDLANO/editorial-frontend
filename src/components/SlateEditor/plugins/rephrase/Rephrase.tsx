/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo } from "react";
import { Editor, Path, Node, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import { PARAGRAPH_ELEMENT_TYPE } from "@ndla/editor";
import { useArticleLanguage } from "../../ArticleLanguageProvider";
import { isRephraseElement } from "./queries/rephraseQueries";
import { RephraseElement } from "./rephraseTypes";
import { AiPromptDialog } from "../../../AiPromptDialog";
import mergeLastUndos from "../../utils/mergeLastUndos";

interface Props extends RenderElementProps {
  element: RephraseElement;
  editor: Editor;
}

export const Rephrase = ({ attributes, editor, element, children }: Props) => {
  const language = useArticleLanguage();

  // TODO Handle marks and inlines in query.
  const currentText = useMemo(() => Node.string(element), [element]);

  const onClose = useCallback(() => {
    const path = ReactEditor.findPath(editor, element);
    const startOfNextPath = editor.start(Path.next(path));
    Transforms.select(editor, startOfNextPath);
    Transforms.unwrapNodes(editor, {
      match: isRephraseElement,
      at: path,
      voids: true,
    });
    setTimeout(() => ReactEditor.focus(editor), 0);
  }, [editor, element]);

  const onReplace = (generatedText: string) => {
    if (generatedText) {
      editor.insertText(generatedText);
      mergeLastUndos(editor);
    }
    onClose();
  };

  const onAppend = (generatedText: string) => {
    if (generatedText) {
      const [entry] = editor.nodes({ match: isRephraseElement });
      const [_node, path] = entry;
      editor.insertNode({ type: PARAGRAPH_ELEMENT_TYPE, children: [{ text: generatedText }] }, { at: Path.next(path) });
      mergeLastUndos(editor);
    }
    onClose();
  };

  return (
    <AiPromptDialog
      defaultOpen
      promptVariables={{
        type: "alternativePhrasing",
        text: currentText,
        excerpt: currentText,
      }}
      language={language}
      onExitComplete={onClose}
      onReplace={onReplace}
      onAppend={onAppend}
    >
      <span {...attributes}>{children}</span>
    </AiPromptDialog>
  );
};
