/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEventHandler, ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { RenderElementProps } from "slate-react";
import styled from "@emotion/styled";
import { FactBox } from "@ndla/ui";
import DeleteButton from "../../../DeleteButton";
import MoveContentButton from "../../../MoveContentButton";

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`;

const StyledFactBox = styled(FactBox)`
  margin: 0px;
`;

interface Props {
  children: ReactNode;
  onRemoveClick?: MouseEventHandler;
  onMoveContent?: MouseEventHandler;
  attributes: RenderElementProps["attributes"];
}

const SlateFactAside = ({ children, onRemoveClick, attributes, onMoveContent }: Props) => {
  const [open, setIsOpen] = useState(true);
  const { t } = useTranslation();

  return (
    <div>
      <ButtonContainer>
        <MoveContentButton onMouseDown={onMoveContent} aria-label={t("form.moveContent")} />
        <DeleteButton aria-label={t("form.remove")} onMouseDown={onRemoveClick} data-testid="remove-fact-aside" />
      </ButtonContainer>
      <StyledFactBox open={open} draggable {...attributes} onOpenChange={setIsOpen}>
        {children}
      </StyledFactBox>
    </div>
  );
};

export default SlateFactAside;
