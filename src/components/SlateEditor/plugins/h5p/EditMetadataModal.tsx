/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactEditor } from 'slate-react';
import { Editor, Path, Transforms } from 'slate';
import { useTranslation } from 'react-i18next';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { H5pEmbedData, H5pMetaData } from '@ndla/types-embed';
import { Modal, ModalContent, ModalTrigger } from '@ndla/modal';
import styled from '@emotion/styled';
import { ButtonV2, IconButtonV2 } from '@ndla/button';
import { Pencil } from '@ndla/icons/action';
import { TextAreaV2 } from '@ndla/forms';
import { spacing } from '@ndla/core';
import { H5pElement } from './types';
import FormikFieldDescription from '../../../FormikField/FormikFieldDescription';

const StyledModalBody = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  padding: ${spacing.large};
  gap: ${spacing.medium};
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: end;
  gap: ${spacing.small};
`;

interface Props {
  embed: H5pMetaData | undefined;
  editor: Editor;
  element: H5pElement;
}

const EditMetadataModal = ({ embed, editor, element }: Props) => {
  const [alttext, setAlttext] = useState(embed?.embedData.alt);
  const [isOpen, setOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  const onSaveMetadata = useCallback(() => {
    if (!embed?.embedData) return;
    setOpen(false);
    ReactEditor.focus(editor);
    const data: H5pEmbedData = { ...embed.embedData, alt: alttext };
    Transforms.setNodes(editor, { data }, { at: ReactEditor.findPath(editor, element) });
  }, [alttext, editor, element, embed?.embedData]);

  const onClose = () => {
    setOpen(false);
    ReactEditor.focus(editor);
    const path = ReactEditor.findPath(editor, element);
    if (Editor.hasPath(editor, Path.next(path))) {
      setTimeout(() => {
        Transforms.select(editor, Path.next(path));
      }, 0);
    }
  };

  const onCancel = () => {
    setAlttext(embed?.embedData.alt);
    onClose();
  };

  return (
    <Modal open={isOpen} onOpenChange={setOpen}>
      <ModalTrigger>
        <IconButtonV2
          colorTheme="light"
          title={t('form.h5p.metadata.edit')}
          aria-label={t('form.h5p.metadata.edit')}
        >
          <Pencil />
        </IconButtonV2>
      </ModalTrigger>
      <ModalContent size="small">
        <StyledModalBody>
          <div>
            <label>{t('form.h5p.metadata.edit')}</label>
            <FormikFieldDescription description={t('form.h5p.metadata.description')} />
          </div>
          <TextAreaV2
            name="alt"
            label={t('form.h5p.metadata.alttext')}
            value={alttext}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setAlttext(e.target.value)}
            type="text"
            placeholder={t('form.h5p.metadata.alttext')}
            white
          />
          <ButtonWrapper>
            <ButtonV2 onClick={onCancel}>{t('form.h5p.metadata.cancel')}</ButtonV2>
            <ButtonV2 onClick={onSaveMetadata} disabled={alttext === embed?.embedData.alt}>
              {t('form.h5p.metadata.save')}
            </ButtonV2>
          </ButtonWrapper>
        </StyledModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditMetadataModal;
