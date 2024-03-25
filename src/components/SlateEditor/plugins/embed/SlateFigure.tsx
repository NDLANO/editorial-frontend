/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Transforms, Path } from "slate";
import { RenderElementProps, ReactEditor, useSelected } from "slate-react";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors, fonts, spacing, mq, breakpoints } from "@ndla/core";
import { EmbedElements } from ".";
import SlateImage from "./SlateImage";
import SlateVideo from "./SlateVideo";
import { isSlateEmbed } from "./utils";
import { useArticleLanguage } from "../../ArticleLanguageProvider";
import EditorErrorMessage from "../../EditorErrorMessage";

interface Props {
  attributes: RenderElementProps["attributes"];
  editor: Editor;
  element: EmbedElements;
  children: ReactNode;
  allowDecorative?: boolean;
}

interface ChangesProp {
  // This way we can use generic name as the variable name.
  // The name can vary depending on which component uses this function.
  [x: string]: string | undefined;
}

export const FigureInfo = styled.div`
  margin-bottom: ${spacing.small};
  font-family: ${fonts.sans};
  color: ${colors.text.primary};
  ${fonts.sizes("16px", "24px")};
  white-space: normal;
  ${mq.range({ from: breakpoints.tablet })} {
    flex: 2;
    margin-bottom: ${spacing.small};
  }
  p {
    margin: 0;
  }
`;

export const CaptionButton = styled(ButtonV2)`
  width: 100%;
`;

export const StyledFigcaption = styled.figcaption`
  background-color: ${colors.white};
  width: 100%;
  padding: ${spacing.small};
  display: block;
  border-bottom: 1px solid ${colors.brand.greyLight};
`;

const SlateFigure = ({ attributes, editor, element, children, allowDecorative = true }: Props) => {
  const embed = element.data;
  const { t } = useTranslation();
  const language = useArticleLanguage();

  const saveEmbedUpdates = (updates: ChangesProp) => {
    Transforms.setNodes(editor, { data: { ...embed, ...updates } }, { at: ReactEditor.findPath(editor, element) });
  };

  const isActive = () => {
    if (!editor.selection) return false;
    return Path.isDescendant(editor.selection.anchor.path, ReactEditor.findPath(editor, element));
  };

  const isSelected = useSelected();

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
    case "image":
      return (
        <SlateImage
          attributes={attributes}
          embed={embed}
          language={language}
          onRemoveClick={onRemoveClick}
          saveEmbedUpdates={saveEmbedUpdates}
          visualElement={false}
          active={isActive()}
          isSelectedForCopy={isSelected}
          pathToEmbed={pathToEmbed}
          allowDecorative={allowDecorative}
        >
          {children}
        </SlateImage>
      );
    case "brightcove":
      return (
        <SlateVideo
          attributes={attributes}
          embed={embed}
          onRemoveClick={onRemoveClick}
          saveEmbedUpdates={saveEmbedUpdates}
          active={isActive()}
          isSelectedForCopy={isSelected}
        >
          {children}
        </SlateVideo>
      );
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
