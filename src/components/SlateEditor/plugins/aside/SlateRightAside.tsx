/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { RenderElementProps } from "slate-react";
import styled from "@emotion/styled";
import { colors, stackOrder } from "@ndla/core";
import { Aside } from "@ndla/ui";
import DeleteButton from "../../../DeleteButton";
import MoveContentButton from "../../../MoveContentButton";

const StyledAsideType = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${colors.brand.greyDark};
  color: white;
  position: absolute;
  width: 100%;
  padding: 3.2px;
  z-index: ${stackOrder.offsetSingle};
`;

const StyledAside = styled(Aside)`
  > div {
    padding: 0;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
`;

interface Props {
  onRemoveClick: () => void;
  children: ReactNode;
  onMoveContent: () => void;
  attributes: RenderElementProps["attributes"];
}

const SlateRightAside = ({ children, onRemoveClick, onMoveContent, attributes }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledAside contentEditable={false}>
      <StyledAsideType contentEditable={false}>
        {t("learningResourceForm.fields.rightAside.title")}
        <ButtonContainer>
          <MoveContentButton
            onMouseDown={onMoveContent}
            aria-label={t("learningResourceForm.fields.rightAside.moveContent")}
          />
          <DeleteButton
            aria-label={t("learningResourceForm.fields.rightAside.delete")}
            variant="stripped"
            onMouseDown={onRemoveClick}
          />
        </ButtonContainer>
      </StyledAsideType>
      <div {...attributes} contentEditable>
        {children}
      </div>
    </StyledAside>
  );
};

export default SlateRightAside;
