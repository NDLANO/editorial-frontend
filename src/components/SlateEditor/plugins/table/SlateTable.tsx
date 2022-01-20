/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ReactNode } from 'react';
import { Editor } from 'slate';
import { RenderElementProps } from 'slate-react';
import { TableElement } from './interfaces';

interface Props {
  editor: Editor;
  attributes: RenderElementProps['attributes'];
  element: TableElement;
  children: ReactNode;
}

const StyledTable = styled.table`
  display: block;
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

const SlateTable = (props: Props) => {
  const { attributes, children } = props;
  return (
    <StyledWrapper className="c-table__wrapper">
      <StyledTable className="c-table" {...attributes}>
        {children}
      </StyledTable>
    </StyledWrapper>
  );
};

export default SlateTable;
