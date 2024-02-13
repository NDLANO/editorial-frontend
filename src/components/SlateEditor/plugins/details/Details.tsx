/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Editor, Transforms, Element } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import styled from "@emotion/styled";
import { spacing, colors, fonts } from "@ndla/core";
import { ExpandableBox, ExpandableBoxSummary } from "@ndla/ui";
import { TYPE_DETAILS } from "./types";
import DeleteButton from "../../../DeleteButton";
import MoveContentButton from "../../../MoveContentButton";

const StyledDetailsDiv = styled.div`
  padding: ${spacing.small};
  margin: ${spacing.large} 0;
  border: 1px solid ${colors.brand.greyLight};
  overflow: visible;
  > *:last-child {
    margin-bottom: 0;
  }
  position: relative;
`;

const StyledExpendabelBox = styled(ExpandableBoxSummary)`
  span {
    & > * {
      display: inline;
      font-size: ${fonts.size.text.metaText.medium};
      font-weight: ${fonts.weight.normal};
    }
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

interface Props {
  editor: Editor;
}

const Details = ({ children, editor, element, attributes }: Props & RenderElementProps) => {
  const { t } = useTranslation();
  const onRemoveClick = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && node.type === TYPE_DETAILS,
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
      match: (node) => Element.isElement(node) && node.type === TYPE_DETAILS,
      voids: true,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor, { edge: "start" });
    }, 0);
  };

  const [summaryNode, ...contentNodes] = children;

  return (
    <StyledDetailsDiv {...attributes} draggable>
      <ButtonContainer>
        <MoveContentButton
          onMouseDown={onMoveContent}
          aria-label={t("learningResourceForm.fields.rightAside.moveContent")}
        />
        <DeleteButton
          data-testid="remove-details"
          aria-label={t("form.remove")}
          variant="stripped"
          onMouseDown={onRemoveClick}
        />
      </ButtonContainer>
      <ExpandableBox>
        <StyledExpendabelBox>{summaryNode}</StyledExpendabelBox>
        {contentNodes}
      </ExpandableBox>
    </StyledDetailsDiv>
  );
};

export default Details;
