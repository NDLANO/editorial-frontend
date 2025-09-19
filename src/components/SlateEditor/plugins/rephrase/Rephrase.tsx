/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo } from "react";
import { Editor, Element, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import { useArticleLanguage } from "../../ArticleLanguageProvider";
import { isRephraseElement } from "./queries/rephraseQueries";
import { RephraseElement } from "./rephraseTypes";
import { blockContentToEditorValue, blockContentToHTML } from "../../../../util/articleContentConverter";
import { AiPromptDialog } from "../../../AiPromptDialog";
import mergeLastUndos from "../../utils/mergeLastUndos";

interface Props extends RenderElementProps {
  element: RephraseElement;
  editor: Editor;
}

export const Rephrase = ({ attributes, editor, element, children }: Props) => {
  const language = useArticleLanguage();

  const html = useMemo(() => blockContentToHTML(element.children), [element.children]);
  const text = useMemo(() => blockContentToHTML(editor.children), [editor.children]);

  const onClose = useCallback(
    (generatedHtml?: string, shouldReplace?: boolean) => {
      const path = ReactEditor.findPath(editor, element);
      const nextPath = Path.next(path);

      if (generatedHtml) {
        const [node] = blockContentToEditorValue(`<div>${generatedHtml}</div>`) as Element[];
        Transforms.insertNodes(editor, node.children, { at: nextPath });
        mergeLastUndos(editor);
      }

      Transforms.select(editor, nextPath);
      if (shouldReplace) {
        Transforms.removeNodes(editor, { match: isRephraseElement, at: path });
      } else {
        Transforms.unwrapNodes(editor, {
          match: isRephraseElement,
          at: path,
        });
      }

      setTimeout(() => ReactEditor.focus(editor), 0);
    },
    [editor, element],
  );

  return (
    <AiPromptDialog
      defaultOpen
      promptVariables={{
        type: "alternativePhrasing",
        html,
        text,
      }}
      language={language}
      onExitComplete={onClose}
      onReplace={(html) => onClose(html, true)}
      onAppend={(html) => onClose(html, false)}
    >
      <span {...attributes}>{children}</span>
    </AiPromptDialog>
  );
};
