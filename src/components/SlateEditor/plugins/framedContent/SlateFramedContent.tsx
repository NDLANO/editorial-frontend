/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Editor, Element, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { FramedContent } from "@ndla/ui";
import { TYPE_FRAMED_CONTENT } from "./types";
import DeleteButton from "../../../DeleteButton";
import MoveContentButton from "../../../MoveContentButton";

const StyledFramedContent = styled(FramedContent)`
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  display: flex;
  padding: ${spacing.xsmall};
  justify-content: flex-end;
  flex: 0;
`;

const ChildrenWrapper = styled.div`
  flex: 1;
  padding: 0 ${spacing.medium} ${spacing.medium} ${spacing.medium};
`;

interface Props {
  editor: Editor;
}

const SlateFramedContent = (props: Props & RenderElementProps) => {
  const { element, editor, attributes, children } = props;
  const { t } = useTranslation();

  const onRemoveClick = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && node.type === TYPE_FRAMED_CONTENT,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor);
    }, 0);
  };

  const onMoveContent = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.unwrapNodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && node.type === TYPE_FRAMED_CONTENT,
      voids: true,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor, { edge: "start" });
    }, 0);
  };

  return (
    <StyledFramedContent draggable {...attributes}>
      <ButtonContainer>
        <MoveContentButton onMouseDown={onMoveContent} />
        <DeleteButton
          aria-label={t("form.remove")}
          tabIndex={-1}
          data-testid="remove-framedContent"
          colorTheme="danger"
          onMouseDown={onRemoveClick}
        />
      </ButtonContainer>
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </StyledFramedContent>
  );
};

export default SlateFramedContent;
