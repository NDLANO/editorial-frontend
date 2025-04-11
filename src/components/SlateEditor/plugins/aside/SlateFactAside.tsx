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
import { styled } from "@ndla/styled-system/jsx";
import { EmbedWrapper, FactBox } from "@ndla/ui";
import DeleteButton from "../../../DeleteButton";
import MoveContentButton from "../../../MoveContentButton";

const ButtonContainer = styled("div", {
  base: {
    position: "absolute",
    top: "xsmall",
    right: "xsmall",
    display: "flex",
    justifyContent: "flex-end",
    zIndex: "docked",
    gap: "3xsmall",
  },
});

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
    <EmbedWrapper>
      <ButtonContainer contentEditable={false}>
        <MoveContentButton onMouseDown={onMoveContent} aria-label={t("form.moveContent")} />
        <DeleteButton aria-label={t("form.remove")} onMouseDown={onRemoveClick} data-testid="remove-fact-aside" />
      </ButtonContainer>
      <FactBox open={open} {...attributes} onOpenChange={setIsOpen}>
        {children}
      </FactBox>
    </EmbedWrapper>
  );
};

export default SlateFactAside;
