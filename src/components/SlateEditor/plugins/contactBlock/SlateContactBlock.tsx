/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import styled from "@emotion/styled";
import { Pencil } from "@ndla/icons/action";
import { DeleteForever } from "@ndla/icons/editor";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from "@ndla/modal";
import { IconButton } from "@ndla/primitives";
import { IImageMetaInformationV3 } from "@ndla/types-backend/image-api";
import { ContactBlockEmbedData } from "@ndla/types-embed";
import { ContactBlock, ContactBlockBackground, EmbedWrapper } from "@ndla/ui";
import { ContactBlockElement } from ".";
import ContactBlockForm from "./ContactBlockForm";
import { fetchImage } from "../../../../modules/image/imageApi";
import { StyledFigureButtons } from "../embed/FigureButtons";

interface Props extends RenderElementProps {
  element: ContactBlockElement;
  editor: Editor;
}

const StyledModalHeader = styled(ModalHeader)`
  padding-bottom: 0px;
`;

const StyledModalBody = styled(ModalBody)`
  padding-top: 0px;
  h2 {
    margin: 0px;
  }
`;

const SlateContactBlock = ({ element, editor, attributes, children }: Props) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(element.isFirstEdit);
  const contactBlock = element.data;
  const [image, setImage] = useState<IImageMetaInformationV3 | undefined>(undefined);

  const onClose = () => {
    ReactEditor.focus(editor);
    setIsEditing(false);
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
  };

  const onSave = useCallback(
    (data: ContactBlockEmbedData) => {
      setIsEditing(false);

      const properties = {
        data: data,
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
    [setIsEditing, editor, element],
  );

  useEffect(() => {
    if (contactBlock?.imageId) {
      fetchImage(contactBlock.imageId).then((img) => setImage(img));
    }
  }, [contactBlock?.imageId, setImage]);

  const handleRemove = () =>
    Transforms.removeNodes(editor, {
      at: ReactEditor.findPath(editor, element),
      voids: true,
    });

  return (
    <Modal open={isEditing} onOpenChange={setIsEditing}>
      <EmbedWrapper {...attributes} contentEditable={false} data-testid="slate-contact-block">
        {contactBlock && image && (
          <>
            <StyledFigureButtons>
              <ModalTrigger>
                <IconButton
                  variant="secondary"
                  size="small"
                  aria-label={t("contactBlockForm.edit")}
                  title={t("contactBlockForm.edit")}
                >
                  <Pencil />
                </IconButton>
              </ModalTrigger>
              <IconButton
                aria-label={t("contactBlockForm.delete")}
                title={t("contactBlockForm.delete")}
                variant="danger"
                size="small"
                onClick={handleRemove}
                data-testid="remove-contact-block"
              >
                <DeleteForever />
              </IconButton>
            </StyledFigureButtons>
            <ContactBlock
              image={image}
              embedAlt={element.data?.alt}
              jobTitle={contactBlock.jobTitle}
              name={contactBlock.name}
              description={contactBlock.description}
              email={contactBlock.email}
              backgroundColor={contactBlock.background as ContactBlockBackground | undefined}
            />
          </>
        )}
        {children}
      </EmbedWrapper>
      <ModalContent>
        <StyledModalHeader>
          <ModalTitle>{t("contactBlockForm.title")}</ModalTitle>
          <ModalCloseButton />
        </StyledModalHeader>
        <StyledModalBody>
          <ContactBlockForm initialData={contactBlock} onSave={onSave} onCancel={onClose} />
        </StyledModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SlateContactBlock;
