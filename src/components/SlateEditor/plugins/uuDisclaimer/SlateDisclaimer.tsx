/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Element, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import styled from "@emotion/styled";
import { colors, spacing } from "@ndla/core";
import { Pencil } from "@ndla/icons/action";
import { Modal, ModalCloseButton, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from "@ndla/modal";
import { IconButton } from "@ndla/primitives";
import { IArticleV2 } from "@ndla/types-backend/article-api";
import { UuDisclaimerEmbedData, UuDisclaimerMetaData } from "@ndla/types-embed";
import { EmbedWrapper, UuDisclaimerEmbed } from "@ndla/ui";
import DisclaimerForm from "./DisclaimerForm";
import { DisclaimerElement, TYPE_DISCLAIMER } from "./types";
import { toEditPage } from "./utils";
import { getArticle } from "../../../../modules/article/articleApi";
import DeleteButton from "../../../DeleteButton";
import MoveContentButton from "../../../MoveContentButton";

interface Props {
  attributes: RenderElementProps["attributes"];
  children: ReactNode;
  editor: Editor;
  element: DisclaimerElement;
}

const StyledEmbedWrapper = styled(EmbedWrapper)`
  [data-uu-content] {
    border: 1px solid ${colors.brand.primary};
    margin-top: ${spacing.xsmall};
    padding: ${spacing.xsmall};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: -${spacing.large};
`;

const StyledModalHeader = styled(ModalHeader)`
  padding-bottom: 0px;
`;

const SlateDisclaimer = ({ attributes, children, element, editor }: Props) => {
  const { t, i18n } = useTranslation();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [embed, setEmbed] = useState<UuDisclaimerMetaData>({
    status: "success",
    data: {},
    embedData: element.data,
    resource: element.data.resource,
  });

  useEffect(() => {
    const initDisclaimerLink = async () => {
      let response: IArticleV2 | undefined = undefined;
      element.data.articleId && (response = await getArticle(Number(element.data.articleId)));

      setEmbed((prevState) => ({
        ...prevState,
        data: response
          ? {
              disclaimerLink: {
                text: response.title.title,
                href: toEditPage(response.articleType, response.id, i18n.language),
              },
            }
          : {},
        embedData: element.data,
        resource: element.data.resource,
      }));
    };
    initDisclaimerLink();
  }, [element.data, i18n.language]);

  const handleDelete = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && node.type === TYPE_DISCLAIMER,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor);
    }, 0);
  };

  const handleRemoveDisclaimer = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.unwrapNodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && node.type === TYPE_DISCLAIMER,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor);
    }, 0);
  };

  const onSaveDisclaimerText = useCallback(
    (values: UuDisclaimerEmbedData) => {
      setModalOpen(false);
      ReactEditor.focus(editor);
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(
        editor,
        {
          data: values,
          isFirstEdit: false,
        },
        { at: path },
      );
      if (Editor.hasPath(editor, Path.next(path))) {
        setTimeout(() => {
          Transforms.select(editor, Path.next(path));
        }, 0);
      }
    },
    [setModalOpen, editor, element],
  );

  return (
    <StyledEmbedWrapper data-testid="slate-disclaimer-block" {...attributes}>
      <ButtonContainer contentEditable={false}>
        <DeleteButton aria-label={t("delete")} data-testid="delete-disclaimer" onClick={handleDelete} />
        <Modal open={modalOpen} onOpenChange={setModalOpen}>
          <ModalTrigger>
            <IconButton
              variant="tertiary"
              size="small"
              aria-label={t("form.disclaimer.edit")}
              data-testid="edit-disclaimer"
              title={t("form.disclaimer.edit")}
            >
              <Pencil />
            </IconButton>
          </ModalTrigger>
          <ModalContent size="normal">
            <StyledModalHeader>
              <ModalTitle>{t("form.disclaimer.title")}</ModalTitle>
              <ModalCloseButton />
            </StyledModalHeader>
            <DisclaimerForm initialData={embed?.embedData} onOpenChange={setModalOpen} onSave={onSaveDisclaimerText} />
          </ModalContent>
        </Modal>
        <MoveContentButton
          aria-label={t("form.moveContent")}
          data-testid="move-disclaimer"
          onMouseDown={handleRemoveDisclaimer}
        />
      </ButtonContainer>
      <UuDisclaimerEmbed embed={embed}>{children}</UuDisclaimerEmbed>
    </StyledEmbedWrapper>
  );
};

export default SlateDisclaimer;
