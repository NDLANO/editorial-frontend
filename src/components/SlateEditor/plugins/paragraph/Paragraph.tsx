/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ReactNode } from "react";
import { Editor } from "slate";
import { RenderElementProps } from "slate-react";
import styled from "@emotion/styled";
import { ParagraphElement } from ".";

interface Props {
  attributes: RenderElementProps["attributes"];
  element: ParagraphElement;
  children: ReactNode;
  editor: Editor;
}

const StyledParagraph = styled.p`
  position: relative;
  &[data-align="center"] {
    text-align: center;
  }
`;

const Paragraph = ({ attributes, children, element }: Props) => {
  return (
    <StyledParagraph data-align={element.data?.align ?? ""} {...attributes}>
      {children}
    </StyledParagraph>
  );
};

export default Paragraph;
