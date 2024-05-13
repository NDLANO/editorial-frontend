/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Transforms } from "slate";
import { RenderElementProps, ReactEditor } from "slate-react";
import { EmbedElements } from ".";
import { isSlateEmbed } from "./utils";
import EditorErrorMessage from "../../EditorErrorMessage";

interface Props {
  attributes: RenderElementProps["attributes"];
  editor: Editor;
  element: EmbedElements;
  children: ReactNode;
}

const SlateFigure = ({ attributes, editor, element, children }: Props) => {
  const embed = element.data;
  const { t } = useTranslation();

  const pathToEmbed = ReactEditor.findPath(editor, element);

  const onRemoveClick = (e: any) => {
    e.stopPropagation();
    ReactEditor.focus(editor);
    Transforms.removeNodes(editor, {
      at: pathToEmbed,
      match: (node) => isSlateEmbed(node),
    });
  };

  switch (embed?.resource) {
    case "error":
      return (
        <EditorErrorMessage onRemoveClick={onRemoveClick} attributes={attributes} msg={embed.message}>
          {children}
        </EditorErrorMessage>
      );
    default:
      return (
        <EditorErrorMessage
          attributes={attributes}
          msg={t("form.content.figure.notSupported", {
            mediaType: embed?.resource,
          })}
        >
          {children}
        </EditorErrorMessage>
      );
  }
};

export default SlateFigure;
