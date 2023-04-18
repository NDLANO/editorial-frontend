/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { Pencil } from '@ndla/icons/lib/action';
import { ModalBody, ModalCloseButton, ModalHeaderV2, ModalV2 } from '@ndla/modal';
import { IImageMetaInformationV3 } from '@ndla/types-backend/build/image-api';
import { KeyNumberEmbedData } from '@ndla/types-embed';
import { KeyNumber } from '@ndla/ui';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Editor, Path, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { KeyNumberElement } from '.';
import { fetchImage } from '../../../../modules/image/imageApi';
import DeleteButton from '../../../DeleteButton';
import KeyNumberForm from './KeyNumberForm';

interface Props extends RenderElementProps {
  element: KeyNumberElement;
  editor: Editor;
}

const KeyNumberWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const StyledModalHeader = styled(ModalHeaderV2)`
  padding-bottom: 0px;
`;

const StyledModalBody = styled(ModalBody)`
  padding-top: 0px;
  h2 {
    margin: 0px;
  }
`;

const SlateKeyNumber = ({ element, editor }: Props) => {
  const [keyNumber, setKeyNumber] = useState<KeyNumberEmbedData>(element.data);
  const [isEditing, setIsEditing] = useState<boolean | undefined>(element.isFirstEdit);
  const [image, setImage] = useState<IImageMetaInformationV3 | undefined>(undefined);
  const { t } = useTranslation();

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
    (data: KeyNumberEmbedData) => {
      setKeyNumber(data);
      setIsEditing(false);
      fetchImage(data.imageId).then((image) => setImage(image));
    },
    [setImage],
  );

  return (
    <>
      {keyNumber && (
        <KeyNumberWrapper>
          <ButtonContainer>
            <IconButtonV2 variant="ghost" onClick={() => setIsEditing(true)} aria-label={t('edit')}>
              <Pencil />
            </IconButtonV2>
            <DeleteButton aria-label={t('delete')} onClick={handleRemove} />
          </ButtonContainer>
          <KeyNumber title={keyNumber.title} subTitle={keyNumber.subTitle} image={image} />
        </KeyNumberWrapper>
      )}
      {isEditing && (
        <ModalV2
          controlled
          isOpen
          size="small"
          aria-label={t('keyNumberForm.title')}
          onClose={onClose}
        >
          {(close) => (
            <>
              <StyledModalHeader>
                <h1>{t('keyNumberForm.title')}</h1>
                <ModalCloseButton onClick={close} />
              </StyledModalHeader>
              <StyledModalBody>
                <KeyNumberForm onSave={onSave} initialData={keyNumber} onCancel={close} />
              </StyledModalBody>
            </>
          )}
        </ModalV2>
      )}
    </>
  );
};

export default SlateKeyNumber;
