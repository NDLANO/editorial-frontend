/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldArrayRenderProps, useField } from 'formik';
import { ComponentType, useCallback, useMemo } from 'react';
import styled from '@emotion/styled';
import { DragEndEvent } from '@dnd-kit/core';
import { DragVertical } from '@ndla/icons/editor';
import { useTranslation } from 'react-i18next';
import { MenuWithArticle } from './types';
import FrontpageNode from './FrontpageNode';
import DndList from '../../components/DndList';
import { DragHandle } from '../../components/DraggableItem';

interface Props extends FieldArrayRenderProps {
  level: number;
}

export const FRONTPAGE_DEPTH_LIMIT = 2;

const StyledList = styled.ul`
  list-style: none;
  margin: 0px;
  padding: 0px;
`;

const StyledDragHandle = styled(DragHandle)`
  align-self: flex-start;
`;

const FrontpageNodeList: ComponentType<Props> = ({ name, replace, remove, level, move }: Props) => {
  const { t } = useTranslation();
  const [menuField] = useField<MenuWithArticle[]>(name);

  const sortableItems = useMemo(
    () => menuField.value.map((menu) => ({ ...menu, id: menu.articleId })),
    [menuField.value],
  );

  const onDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (active.data.current?.index !== undefined && over?.data.current?.index !== undefined) {
        move(active!.data!.current!.index!, over!.data.current!.index!);
      }
    },
    [move],
  );

  return (
    <StyledList>
      <DndList
        items={sortableItems}
        disabled={menuField.value.length < FRONTPAGE_DEPTH_LIMIT}
        onDragEnd={onDragEnd}
        dragHandle={
          <StyledDragHandle aria-label={t('dragAndDrop.handle')}>
            <DragVertical />
          </StyledDragHandle>
        }
        renderItem={(_, index) => (
          <FrontpageNode
            key={index}
            name={`${name}.${index}`}
            remove={remove}
            replace={replace}
            index={index}
            level={level}
          />
        )}
      ></DndList>
    </StyledList>
  );
};

export default FrontpageNodeList;
