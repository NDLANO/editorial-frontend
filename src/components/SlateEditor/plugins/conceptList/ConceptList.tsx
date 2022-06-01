/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { Pencil } from '@ndla/icons/lib/action';
import { DeleteForever } from '@ndla/icons/lib/editor';
import Tooltip from '@ndla/tooltip';
import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Editor, Transforms } from 'slate';
import { RenderElementProps, ReactEditor, useSelected } from 'slate-react';
import { ConceptListElement } from '.';
import IconButton from '../../../IconButton';
import ConceptSearchResult from './ConceptSearchResult';
import ConceptTagPicker from './ConceptTagPicker';

interface Props {
  element: ConceptListElement;
  language: string;
  editor: Editor;
  attributes: RenderElementProps['attributes'];
  children: ReactNode;
}

const StyledWrapper = styled.div<{ isSelected: boolean }>`
  position: relative;
  padding: 5px;
  border: ${p =>
    p.isSelected ? `2px solid ${colors.brand.primary}` : `2px dashed ${colors.brand.greyLighter}`};

  & > h2 {
    margin-bottom: 0;
  }
  & p {
    margin-top: 0;
  }
`;

const StyledHeader = styled.h2`
  margin-bottom: 0;
`;

const ButtonContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding-left: 5px;
  transform: translateX(100%);
`;

const ConceptList = ({ element, language, editor, attributes, children }: Props) => {
  const [editMode, setEditMode] = useState<boolean>(!!element.isFirstEdit);
  const isSelected = useSelected();
  const { t } = useTranslation();
  const onClose = () => {
    ReactEditor.focus(editor);
    if (element.isFirstEdit) {
      Transforms.removeNodes(editor, { at: [], match: node => element === node });
    }
    setEditMode(false);
  };

  const onRemoveClick = () => {
    Transforms.removeNodes(editor, { at: [], match: node => element === node });
  };

  const onEditClick = () => {
    setEditMode(true);
  };

  const { tag, title, subjectId } = element.data;

  return (
    <>
      <StyledWrapper
        {...attributes}
        isSelected={isSelected}
        tabIndex={1}
        draggable
        className="c-figure u-float">
        <ButtonContainer contentEditable={false}>
          <Tooltip tooltip={t('form.remove')} align="right">
            <IconButton color="red" type="button" onClick={onRemoveClick} tabIndex={-1}>
              <DeleteForever />
            </IconButton>
          </Tooltip>
          <Tooltip tooltip={t('form.edit')} align="right">
            <IconButton type="button" onClick={onEditClick} tabIndex={-1}>
              <Pencil />
            </IconButton>
          </Tooltip>
        </ButtonContainer>
        {title && <StyledHeader contentEditable={false}>{title}</StyledHeader>}
        {tag && <ConceptSearchResult tag={tag} subjectId={subjectId} language={language} />}
        {children}
      </StyledWrapper>
      {editMode && <ConceptTagPicker element={element} onClose={onClose} language={language} />}
    </>
  );
};

export default ConceptList;
