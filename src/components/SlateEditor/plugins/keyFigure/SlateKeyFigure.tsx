/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { Pencil } from '@ndla/icons/action';
import { Modal, ModalBody, ModalCloseButton, ModalHeader, ModalTitle } from '@ndla/modal';
import { IImageMetaInformationV3 } from '@ndla/types-backend/image-api';
import { KeyFigureEmbedData } from '@ndla/types-embed';
import { KeyFigure } from '@ndla/ui';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Editor, Path, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { KeyFigureElement } from '.';
import { fetchImage } from '../../../../modules/image/imageApi';
import DeleteButton from '../../../DeleteButton';
import KeyFigureForm from './KeyFigureForm';

interface Props extends RenderElementProps {
  element: KeyFigureElement;
  editor: Editor;
}

const KeyFigureWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
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

const SlateKeyFigure = ({ element, editor, attributes, children }: Props) => {
  const [isEditing, setIsEditing] = useState<boolean | undefined>(element.isFirstEdit);
  const [image, setImage] = useState<IImageMetaInformationV3 | undefined>(undefined);
  const { t } = useTranslation();

  const { data } = element;

  const handleRemove = () => {
    Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element), voids: true });
  };

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
    (data: KeyFigureEmbedData) => {
      setIsEditing(false);
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
    [element, editor],
  );

  useEffect(() => {
    if (data?.imageId) {
      fetchImage(data.imageId).then((image) => setImage(image));
    }
  }, [data?.imageId, setImage]);

  return (
    <div {...attributes}>
      {data && image && (
        <KeyFigureWrapper contentEditable={false}>
          <ButtonContainer>
            <IconButtonV2
              variant="ghost"
              onClick={() => setIsEditing(true)}
              aria-label={t('keyFigureForm.edit')}
            >
              <Pencil />
            </IconButtonV2>
            <DeleteButton aria-label={t('delete')} onClick={handleRemove} />
          </ButtonContainer>
          <KeyFigure
            title={data.title}
            subtitle={data.subtitle}
            image={{ src: image.image.imageUrl, alt: image.alttext.alttext }}
          />
        </KeyFigureWrapper>
      )}
      {isEditing && (
        <Modal controlled isOpen size="normal" onClose={onClose}>
          {(close) => (
            <>
              <StyledModalHeader>
                <ModalTitle>{t('keyFigureForm.title')}</ModalTitle>
                <ModalCloseButton onClick={close} />
              </StyledModalHeader>
              <StyledModalBody>
                <KeyFigureForm onSave={onSave} initialData={data} onCancel={close} />
              </StyledModalBody>
            </>
          )}
        </Modal>
      )}
      {children}
    </div>
  );
};

export default SlateKeyFigure;