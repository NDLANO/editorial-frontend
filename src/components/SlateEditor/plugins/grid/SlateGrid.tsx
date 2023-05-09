/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { Pencil } from '@ndla/icons/lib/action';
import { ModalBody, ModalCloseButton, ModalHeaderV2, ModalV2 } from '@ndla/modal';
import { Grid } from '@ndla/ui';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Editor, Path, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { GridElement } from '.';
import DeleteButton from '../../../DeleteButton';
import GridForm, { GridEmbedData } from './GridForm';

interface Props extends RenderElementProps {
  element: GridElement;
  editor: Editor;
}

export const SlateGrid = ({ element, editor, children }: Props) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(element.isFirstEdit);
  const { size, columns } = element.data;

  const handleRemove = () => {
    Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element), voids: true });
  };

  const onClose = () => {
    setIsEditing(false);
    ReactEditor.focus(editor);
    if (element.isFirstEdit) {
      Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, element), voids: true });
    }
    const path = ReactEditor.findPath(editor, element);
    if (Editor.hasPath(editor, Path.next(path))) {
      setTimeout(() => Transforms.select(editor, Path.next(path)), 0);
    }
  };

  const onSave = useCallback(
    (data: GridEmbedData) => {
      setIsEditing(false);
      const properties = {
        data: data,
        isFirstEdit: false,
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

  const StyledModalHeader = styled(ModalHeaderV2)`
    padding-bottom: 0px;
  `;

  const StyledModalBody = styled(ModalBody)`
    padding-top: 0px;
    h2 {
      margin: 0px;
    }
  `;

  const GridWrapper = styled.div`
    display: flex;
    flex-direction: column;
  `;

  const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    width: 100%;
  `;

  return (
    <>
      {size && columns && (
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
          <Grid size={size} columns={columns}>
            {children}
          </Grid>
        </GridWrapper>
      )}
      {isEditing && (
        <ModalV2 controlled isOpen size="small" aria-label={t('gridForm.title')} onClose={onClose}>
          {(close) => (
            <>
              <StyledModalHeader>
                <h1>{t('gridForm.title')}</h1> <ModalCloseButton onClick={close} />
              </StyledModalHeader>
              <StyledModalBody>
                <GridForm
                  onCancel={close}
                  initialData={{ resource: 'grid', size: size, columns: columns }}
                  onSave={onSave}
                />
              </StyledModalBody>
            </>
          )}
        </ModalV2>
      )}
    </>
  );
};
