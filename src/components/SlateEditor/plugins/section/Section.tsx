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
import { DeleteBinLine } from "@ndla/icons";
import { IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { SectionElement } from ".";
import StyledFormContainer from "../../common/StyledFormContainer";

interface Props {
  attributes: RenderElementProps["attributes"];
  element: SectionElement;
  children: ReactNode;
  editor: Editor;
}

const ButtonWrapper = styled("div", {
  base: {
    position: "absolute",
    top: "xsmall",
    right: "0px",
  },
});

const Section = ({ attributes, children, element, editor }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledFormContainer>
      <section {...attributes}>{children}</section>
      {editor.children.length > 1 && (
        <ButtonWrapper contentEditable={false}>
          <IconButton
            aria-label={t("form.section.remove")}
            contentEditable={false}
            variant="danger"
            size="small"
            onClick={() => {
              const path = ReactEditor.findPath(editor, element);
              Transforms.removeNodes(editor, { at: path });
            }}
            title={t("form.section.remove")}
          >
            <DeleteBinLine />
          </IconButton>
        </ButtonWrapper>
      )}
    </StyledFormContainer>
  );
};

export default Section;
