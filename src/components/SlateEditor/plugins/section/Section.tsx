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
import { ButtonV2 } from "@ndla/button";
import { DeleteForever } from "@ndla/icons/editor";
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
          <ButtonV2
            aria-label={t("form.section.remove")}
            contentEditable={false}
            colorTheme="danger"
            variant="ghost"
            onClick={() => {
              const path = ReactEditor.findPath(editor, element);
              Transforms.removeNodes(editor, { at: path });
            }}
            title={t("form.section.remove")}
          >
            <DeleteForever />
          </ButtonV2>
        </ButtonWrapper>
      )}
    </StyledFormContainer>
  );
};

export default Section;
