/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { colors } from "@ndla/core";
import { DeleteForever } from "@ndla/icons/editor";
import Tooltip from "@ndla/tooltip";
import { SectionElement } from ".";

import StyledFormContainer from "../../common/StyledFormContainer";

interface Props {
  attributes: RenderElementProps["attributes"];
  element: SectionElement;
  children: ReactNode;
  editor: Editor;
}

const StyledSection = styled.section`
  position: relative;
`;

const TooltipWrapper = styled.div`
  display: none;
  ${StyledFormContainer}:hover &,
  ${StyledFormContainer}:focus & {
    color: ${colors.support.red};
    display: block;
    position: absolute;
    top: 0px;
    right: 0px;
  }
`;

const Section = ({ attributes, children, element, editor }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledFormContainer>
      <StyledSection {...attributes}>{children}</StyledSection>
      {editor.children.length > 1 && (
        <TooltipWrapper contentEditable={false}>
          <Tooltip tooltip={t("form.section.remove")}>
            <ButtonV2
              contentEditable={false}
              colorTheme="danger"
              variant="stripped"
              onClick={() => {
                const path = ReactEditor.findPath(editor, element);
                Transforms.removeNodes(editor, { at: path });
              }}
            >
              <DeleteForever />
            </ButtonV2>
          </Tooltip>
        </TooltipWrapper>
      )}
    </StyledFormContainer>
  );
};

export default Section;
