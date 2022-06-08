/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import { RenderElementProps } from 'slate-react';
import Button from '@ndla/button';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import { ChevronLeft } from '@ndla/icons/common';
import darken from 'polished/lib/color/darken';
import DeleteButton from '../../../DeleteButton';

const MoveAsideButton = styled(Button)`
  position: absolute;
  top: 0.1rem;
  right: 1.2rem;
  color: ${colors.support.green};
  &:hover,
  &:focus {
    color: ${darken(0.2, colors.support.green)};
  }
`;

const StyledAsideType = styled.div`
  background-color: #444;
  color: white;
  position: absolute;
  width: 100%;
  padding: 3.2px;
`;

const StyledAsideContent = styled.div`
  padding-top: 60px;
`;

interface Props {
  onRemoveClick: () => void;
  children: ReactNode;
  onMoveContent: () => void;
  attributes: RenderElementProps['attributes'];
}

const SlateRightAside = ({ children, onRemoveClick, onMoveContent, attributes }: Props) => {
  const { t } = useTranslation();

  return (
    <aside className="c-aside" {...attributes}>
      <StyledAsideType contentEditable={false}>
        {t('learningResourceForm.fields.rightAside.title')}
      </StyledAsideType>
      <StyledAsideContent className="c-aside__content">{children}</StyledAsideContent>
      <DeleteButton
        title={t('learningResourceForm.fields.rightAside.delete')}
        stripped
        onMouseDown={onRemoveClick}
        tabIndex="-1"
      />
      <MoveAsideButton
        contentEditable={false}
        title={t('learningResourceForm.fields.rightAside.moveContent')}
        stripped
        onMouseDown={onMoveContent}>
        <ChevronLeft />
      </MoveAsideButton>
    </aside>
  );
};

export default SlateRightAside;
