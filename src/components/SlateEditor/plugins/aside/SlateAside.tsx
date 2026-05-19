/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { styled } from "@ndla/styled-system/jsx";
import { EmbedWrapper, FactBox } from "@ndla/ui";
import { useTranslation } from "react-i18next";
import { Editor } from "slate";
import { RenderElementProps } from "slate-react";
import { DeleteButton } from "../../../DeleteButton";
import { MoveContentButton } from "../../../MoveContentButton";
import { useEditableElement } from "../../utils/useEditableElement";
import { AsideElement } from "./asideTypes";

interface Props extends RenderElementProps {
  element: AsideElement;
  editor: Editor;
}

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

const SlateAside = ({ element, editor, attributes, children }: Props) => {
  const { t } = useTranslation();
  const { handleRemove, handleUnwrap } = useEditableElement(element, editor);

  return (
    <EmbedWrapper>
      <ButtonContainer contentEditable={false}>
        <MoveContentButton onClick={handleUnwrap} aria-label={t("form.moveContent")} />
        <DeleteButton aria-label={t("form.remove")} onMouseDown={handleRemove} data-testid="remove-fact-aside" />
      </ButtonContainer>
      <FactBox defaultOpen {...attributes}>
        {children}
      </FactBox>
    </EmbedWrapper>
  );
};

export default SlateAside;
