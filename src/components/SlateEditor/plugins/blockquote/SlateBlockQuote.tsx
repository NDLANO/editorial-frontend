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
import { BlockQuote, IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { EmbedWrapper } from "@ndla/ui";
import { BlockQuoteElement } from "./blockquoteTypes";

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
  const variant = element.data?.variant ?? "neutral";

  const changeVariant = () => {
    const newData = { variant: element.data?.variant === "colored" ? "neutral" : "colored" };
    Transforms.setNodes(editor, { data: newData }, { at: ReactEditor.findPath(editor, element) });
  };

  return (
    <EmbedWrapper {...attributes}>
      <BlockQuote variant={element.data?.variant === "colored" ? "brand1" : undefined}>
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
      </BlockQuote>
    </EmbedWrapper>
  );
};
