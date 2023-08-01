/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IconButtonV2 } from '@ndla/button';
import { Pencil } from '@ndla/icons/action';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@ndla/modal';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Editor, Path, Transforms } from 'slate';
import { ContactBlockEmbedData } from '@ndla/types-embed';
import styled from '@emotion/styled';
import { ContactBlock } from '@ndla/ui';
import { IImageMetaInformationV3 } from '@ndla/types-backend/image-api';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { ContactBlockElement } from '.';
import DeleteButton from '../../../DeleteButton';
import ContactBlockForm from './ContactBlockForm';
import { fetchImage } from '../../../../modules/image/imageApi';

interface Props extends RenderElementProps {
  element: ContactBlockElement;
  editor: Editor;
}
const ContactBlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

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
      Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element), voids: true });
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
    Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element), voids: true });

  return (
    <Modal open={isEditing} onOpenChange={setIsEditing}>
      <div {...attributes}>
        {contactBlock && image && (
          <ContactBlockWrapper contentEditable={false}>
            <ButtonContainer>
              <ModalTrigger>
                <IconButtonV2 variant="ghost" aria-label={t('contactBlockForm.edit')}>
                  <Pencil />
                </IconButtonV2>
              </ModalTrigger>
              <DeleteButton aria-label={t('delete')} onClick={handleRemove} />
            </ButtonContainer>
            <ContactBlock
              image={image}
              jobTitle={contactBlock.jobTitle}
              name={contactBlock.name}
              description={contactBlock.description}
              email={contactBlock.email}
              blob={contactBlock.blob}
              blobColor={contactBlock.blobColor}
            />
          </ContactBlockWrapper>
        )}
        {children}
      </div>
      <ModalContent>
        <StyledModalHeader>
          <ModalTitle>{t('contactBlockForm.title')}</ModalTitle>
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
