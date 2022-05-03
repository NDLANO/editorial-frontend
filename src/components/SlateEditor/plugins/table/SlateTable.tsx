/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { MouseEvent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Editor } from 'slate';
import { RenderElementProps } from 'slate-react';
import DeleteButton from '../../../DeleteButton';
import EditColgroupsModal from './EditColgroupsModal';
import { TableElement } from './interfaces';
import { removeTable } from './utils';

interface Props {
  editor: Editor;
  attributes: RenderElementProps['attributes'];
  element: TableElement;
  children: ReactNode;
}

const StyledTable = styled.table`
  display: block;
  position: relative;
  margin-left: auto;
  margin-right: auto;
  padding: 0 24px;
  margin-top: 64px;
  margin-bottom: 64px;
  &:before {
    display: none;
  }
  &:after {
    display: none;
  }
`;

const StyledWrapper = styled.div`
  display: flex;
  padding: 0;
  margin: 0;
`;

const SlateTable = ({ attributes, children, element, editor }: Props) => {
  const { t } = useTranslation();
  return (
    <StyledWrapper className="c-table__wrapper">
      <StyledTable className="c-table" {...attributes}>
        <DeleteButton
          stripped
          onClick={(e: MouseEvent<HTMLButtonElement>) => removeTable(editor, element)}
          data-cy="remove-fact-aside"
          title={t('form.content.table.table-remove')}
          tabIndex="-1"
        />
        {children}
      </StyledTable>
      <EditColgroupsModal element={element} />
    </StyledWrapper>
  );
};

export default SlateTable;
