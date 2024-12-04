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
import { ErrorWarningLine } from "@ndla/icons";
import { MessageBox } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { EmbedElements } from ".";
import { isSlateEmbed } from "./utils";
import DeleteButton from "../../../DeleteButton";

interface Props {
  attributes: RenderElementProps["attributes"];
  editor: Editor;
  element: EmbedElements;
  children: ReactNode;
}

const StyledMessageBox = styled(MessageBox, {
  base: {
    position: "relative",
  },
});

const StyledDeleteButton = styled(DeleteButton, {
  base: {
    alignSelf: "flex-end",
  },
});

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

  return (
    <StyledMessageBox variant="error" {...attributes} contentEditable={false}>
      <ErrorWarningLine />
      {embed?.resource === "error"
        ? embed.message
        : t("form.content.figure.notSupported", { mediaType: embed?.resource })}
      {children}
      {embed?.resource === "error" && <StyledDeleteButton aria-label={t("form.remove")} onClick={onRemoveClick} />}
    </StyledMessageBox>
  );
};

export default SlateFigure;
