/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import { Pencil } from '@ndla/icons/action';
import { Modal, ModalBody, ModalCloseButton, ModalHeader, ModalTitle } from '@ndla/modal';
import { Grid, GridType } from '@ndla/ui';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Editor, Path, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { GridElement } from '.';
import DeleteButton from '../../../DeleteButton';
import GridForm from './GridForm';

interface Props extends RenderElementProps {
  element: GridElement;
  editor: Editor;
}

const StyledModalHeader = styled(ModalHeader)`
  padding-bottom: 0px;
`;

const StyledModalBody = styled(ModalBody)`
  padding-top: 0px;
`;

const GridWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  padding: ${spacing.nsmall};
  justify-content: flex-end;
  display: flex;
  width: 100%;
`;

const StyledGrid = styled(Grid)`
  width: 100%;
`;

export const SlateGrid = ({ element, editor, children }: Props) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  const handleRemove = () => {
    Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element), voids: true });
  };

  const onClose = () => {
    setIsEditing(false);
    ReactEditor.focus(editor);
    const path = ReactEditor.findPath(editor, element);
    if (Editor.hasPath(editor, Path.next(path))) {
      setTimeout(() => Transforms.select(editor, Path.next(path)), 0);
    }
  };

  const onSave = useCallback(
    (data: GridType) => {
      setIsEditing(false);
      const properties = {
        data: data,
      };
      ReactEditor.focus(editor);
      const path = ReactEditor.findPath(editor, element);
      Transforms.setNodes(editor, properties, { at: path });
      if (Editor.hasPath(editor, Path.next(path))) {
        setTimeout(() => Transforms.select(editor, Path.next(path)), 0);
      }
    },
    [editor, element],
  );

  return (
    <>
      <GridWrapper>
        <ButtonContainer>
          <IconButtonV2
            variant="ghost"
            onClick={() => setIsEditing(true)}
            aria-label={t('gridForm.title')}
          >
            <Pencil />
          </IconButtonV2>
          <DeleteButton aria-label={t('delete')} onClick={handleRemove} />
        </ButtonContainer>
        <StyledGrid
          border={'none'}
          columns={element.data.columns}
          background={element.data.background}
        >
          {children}
        </StyledGrid>
      </GridWrapper>
      {isEditing && (
        <Modal controlled isOpen size="small" onClose={onClose}>
          {(close) => (
            <>
              <StyledModalHeader>
                <ModalTitle>{t('gridForm.title')}</ModalTitle>
                <ModalCloseButton onClick={close} />
              </StyledModalHeader>
              <StyledModalBody>
                <GridForm onCancel={close} initialData={element.data} onSave={onSave} />
              </StyledModalBody>
            </>
          )}
        </Modal>
      )}
    </>
  );
};
