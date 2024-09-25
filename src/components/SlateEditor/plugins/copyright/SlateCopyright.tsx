/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Element, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import styled from "@emotion/styled";
import { colors, spacing } from "@ndla/core";
import { Pencil } from "@ndla/icons/action";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from "@ndla/modal";
import { IconButton } from "@ndla/primitives";
import { CopyrightEmbedData, CopyrightMetaData } from "@ndla/types-embed";
import { CopyrightEmbed, EmbedWrapper } from "@ndla/ui";
import { EmbedCopyrightForm } from "./EmbedCopyrightForm";
import { CopyrightElement, TYPE_COPYRIGHT } from "./types";
import DeleteButton from "../../../DeleteButton";
import MoveContentButton from "../../../MoveContentButton";
import { StyledFigureButtons } from "../embed/FigureButtons";

interface Props {
  attributes: RenderElementProps["attributes"];
  children: ReactNode;
  editor: Editor;
  element: CopyrightElement;
}

const StyledEmbedWrapper = styled(EmbedWrapper)`
  [data-copyright-content] {
    border: 1px solid ${colors.brand.primary};
    padding: ${spacing.xsmall};
  }
`;

const ButtonContainer = styled(StyledFigureButtons)`
  display: flex;
  position: absolute;
  top: -${spacing.large};
  right: 0;
`;

const StyledModalHeader = styled(ModalHeader)`
  padding-bottom: 0px;
`;

const SlateCopyright = ({ attributes, children, element, editor }: Props) => {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState<boolean>(!!element.isFirstEdit);

  const embed: CopyrightMetaData | undefined = useMemo(
    () =>
      element.data
        ? {
            status: "success",
            data: undefined,
            embedData: element.data,
            resource: element.data?.resource,
          }
        : undefined,
    [element.data],
  );

  const handleDelete = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && node.type === TYPE_COPYRIGHT,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, Path.previous(path));
      Transforms.collapse(editor);
    }, 0);
  };

  const handleRemoveCopyright = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.unwrapNodes(editor, {
      at: path,
      match: (node) => Element.isElement(node) && node.type === TYPE_COPYRIGHT,
    });
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, path);
      Transforms.collapse(editor);
    }, 0);
  };

  const onClose = useCallback(() => {
    ReactEditor.focus(editor);
    setModalOpen(false);
    if (element.isFirstEdit) {
      Transforms.removeNodes(editor, {
        at: ReactEditor.findPath(editor, element),
        voids: true,
      });
    }
    const path = ReactEditor.findPath(editor, element);
    if (Editor.hasPath(editor, Path.next(path))) {
      setTimeout(() => {
        Transforms.select(editor, Path.next(path));
      }, 0);
    }
  }, [editor, element]);

  const onSave = useCallback(
    (data: CopyrightEmbedData) => {
      setModalOpen(false);
      const properties = {
        data,
        isFirstEdit: false,
      };
      ReactEditor.focus(editor);
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(editor, properties, { at: path });
      if (Editor.hasPath(editor, Path.next(path))) {
        setTimeout(() => {
          Transforms.select(editor, Path.next(path));
        }, 0);
      }
    },
    [editor, element],
  );

  return (
    <StyledEmbedWrapper data-testid="slate-copyright-block" {...attributes}>
      <ButtonContainer contentEditable={false}>
        <DeleteButton aria-label={t("delete")} data-testid="delete-copyright" onClick={handleDelete} />
        <Modal open={modalOpen} onOpenChange={setModalOpen}>
          <ModalTrigger>
            <IconButton
              variant="tertiary"
              size="small"
              aria-label={t("form.copyright.edit")}
              data-testid="edit-copyright"
              title={t("form.copyright.edit")}
            >
              <Pencil />
            </IconButton>
          </ModalTrigger>
          <ModalContent size="normal">
            <StyledModalHeader>
              <ModalTitle>{t("form.copyright.title")}</ModalTitle>
              <ModalCloseButton />
            </StyledModalHeader>
            <ModalBody>
              <EmbedCopyrightForm embedData={element.data} onCancel={onClose} onSave={onSave} />
            </ModalBody>
          </ModalContent>
        </Modal>
        <MoveContentButton
          aria-label={t("form.moveContent")}
          data-testid="move-copyright"
          onMouseDown={handleRemoveCopyright}
        />
      </ButtonContainer>
      {!!embed && <CopyrightEmbed embed={embed}>{children}</CopyrightEmbed>}
    </StyledEmbedWrapper>
  );
};

export default SlateCopyright;
