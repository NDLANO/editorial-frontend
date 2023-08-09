/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { spacing, colors } from '@ndla/core';
import { Editor, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';
import { IconButtonV2 } from '@ndla/button';
import { useCallback } from 'react';
import { GridCellElement } from '.';

interface Props extends RenderElementProps {
  editor: Editor;
  element: GridCellElement;
}

const StyledButton = styled(IconButtonV2)`
  position: absolute;
  width: 40px;
  height: 40px;
  top: ${spacing.xxsmall};
  right: ${spacing.xxsmall};
`;

const GridCell = ({ element, editor, attributes, children }: Props) => {
  const onClickSticky = useCallback(() => {
    const parallaxCell = element.data?.parallaxCell === 'true' ? 'false' : 'true';
    const path = ReactEditor.findPath(editor, element);
    Transforms.setNodes(editor, { data: { ...element.data, parallaxCell } }, { at: path });
  }, [editor, element]);

  return (
    <StyledGridCell {...attributes}>
      <StyledButton
        onClick={onClickSticky}
        variant={element.data?.parallaxCell === 'true' ? 'solid' : 'ghost'}
        aria-label="sticky"
      >
        S
      </StyledButton>
      {children}
    </StyledGridCell>
  );
};

const StyledGridCell = styled.div`
  position: relative;
  border: 1px solid ${colors.brand.light};
  min-width: 50px;

  overflow-wrap: break-word;

  > p {
    padding: 0 ${spacing.xxsmall};
    word-break: break-word;
  }

  > div,
  > figure,
  > iframe {
    width: 100% !important;
    inset: 0;
  }
`;

export default GridCell;
