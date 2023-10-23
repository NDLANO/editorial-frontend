/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';

import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { colors, spacing } from '@ndla/core';
import { DeleteForever, DragHorizontal } from '@ndla/icons/editor';
import Tooltip from '@ndla/tooltip';
import { Node } from '@ndla/types-taxonomy';

import DndList from '../../../../components/DndList';

const NodeWrapper = styled.div`
  align-items: center;
  background: ${colors.brand.greyLighter};
  display: flex;
  justify-content: space-between;
  margin: ${spacing.xxsmall};
  padding: ${spacing.xxsmall};
  padding-left: ${spacing.small};
  width: 100%;
`;

const ActionsContainer = styled.div`
  display: flex;
`;

const DraggableIconButton = styled(IconButtonV2)`
  cursor: grabbing;
`;

interface Props {
  nodes: Node[];
  nodeSet: string;
  onUpdate: Function;
}

const NodeList = ({ nodes, nodeSet, onUpdate }: Props) => {
  const { t } = useTranslation();

  return (
    <DndList
      items={nodes}
      onDragEnd={(_, newArray) => onUpdate(newArray)}
      renderItem={(node, index) => {
        return (
          <NodeWrapper key={`${nodeSet}-${node.id}-${index}`}>
            {node.name}
            <ActionsContainer>
              <Tooltip tooltip={t('subjectpageForm.moveSubject')}>
                <DraggableIconButton
                  aria-label={t('subjectpageForm.moveSubject')}
                  colorTheme="light"
                  variant="ghost"
                >
                  <DragHorizontal />
                </DraggableIconButton>
              </Tooltip>
              <Tooltip tooltip={t('subjectpageForm.removeSubject')}>
                <IconButtonV2
                  aria-label={t('subjectpageForm.removeSubject')}
                  colorTheme="danger"
                  onClick={() => onUpdate(nodes.filter((item) => item.id !== node.id))}
                  variant="ghost"
                >
                  <DeleteForever />
                </IconButtonV2>
              </Tooltip>
            </ActionsContainer>
          </NodeWrapper>
        );
      }}
    />
  );
};

export default NodeList;
