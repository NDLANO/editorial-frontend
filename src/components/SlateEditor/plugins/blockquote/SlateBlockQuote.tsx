/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Editor, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import { BrushLine } from "@ndla/icons";
import { IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ContentTypeBlockQuote, EmbedWrapper } from "@ndla/ui";
import { BlockQuoteElement } from "./blockquoteTypes";
import { useArticleContentType } from "../../../ContentTypeProvider";

interface Props extends RenderElementProps {
  editor: Editor;
  element: BlockQuoteElement;
}

const StyledIconButton = styled(IconButton, {
  base: {
    position: "absolute",
    top: "-xlarge",
    left: "0",
  },
});

export const SlateBlockQuote = ({ element, editor, attributes, children }: Props) => {
  const { t } = useTranslation();
  const contentType = useArticleContentType();
  const variant = element.data?.variant ?? "neutral";

  const changeVariant = () => {
    const newData = { variant: element.data?.variant === "colored" ? "neutral" : "colored" };
    Transforms.setNodes(editor, { data: newData }, { at: ReactEditor.findPath(editor, element) });
  };

  return (
    <EmbedWrapper {...attributes} draggable>
      <ContentTypeBlockQuote variant={element.data?.variant} contentType={contentType}>
        <StyledIconButton
          size="small"
          onClick={changeVariant}
          variant={variant === "colored" ? "primary" : "secondary"}
          title={t(`blockquoteForm.changeVariant.${variant === "neutral" ? "colored" : "neutral"}`)}
          aria-label={t(`blockquoteForm.changeVariant.${variant === "neutral" ? "colored" : "neutral"}`)}
        >
          <BrushLine />
        </StyledIconButton>
        {children}
      </ContentTypeBlockQuote>
    </EmbedWrapper>
  );
};
