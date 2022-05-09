/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/react';
import { spacing, colors } from '@ndla/core';
import { NodeType } from '../../modules/nodes/nodeApiTypes';
import { createGuard } from '../../util/guards';
import { nodePathToUrnPath } from '../../util/taxonomyHelpers';
import Fade from '../../components/Taxonomy/Fade';
import {
  ItemTitleButton,
  StructureWrapper,
  StyledItemBar,
  StyledStructureItem,
} from '../../components/Taxonomy/nodeStyles';
import {
  DiffResultType,
  DiffTree,
  DiffType,
  DiffTypeWithChildren,
  removeUnchangedFromTree,
} from './diffUtils';

interface Props {
  node: DiffType<NodeType> | DiffTypeWithChildren;
  level: number;
  onNodeSelected: (node?: DiffType<NodeType>) => void;
  selectedNode?: DiffType<NodeType> | DiffTypeWithChildren;
  parentActive: boolean;
  nodes?: DiffTypeWithChildren[];
}

interface RootNodeProps {
  tree: DiffTree;
  onNodeSelected: (node?: DiffType<NodeType>) => void;
  selectedNode?: DiffType<NodeType> | DiffTypeWithChildren;
}

export const RootNode = ({ tree, onNodeSelected, selectedNode }: RootNodeProps) => {
  const root = tree.root;
  const [params] = useSearchParams();

  const nodeView = params.get('nodeView') ?? 'changed';
  if (
    root.changed.diffType === 'NONE' &&
    root.childrenChanged?.diffType === 'NONE' &&
    nodeView === 'changed'
  )
    return null;
  const children = nodeView === 'changed' ? removeUnchangedFromTree(tree.children) : tree.children;

  return (
    <TreeNode
      selectedNode={selectedNode}
      node={root}
      nodes={children}
      level={1}
      onNodeSelected={onNodeSelected}
      parentActive={true}
    />
  );
};

interface StyledChangedPillProps {
  color: string;
  textColor?: string;
}
const StyledChangedPill = styled.div<StyledChangedPillProps>`
  padding: 0 ${spacing.small};
  background-color: ${props => props.color};
  color: ${props => props.textColor};
  border-radius: 5px;
`;

const DiffPills = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${spacing.small};
`;

interface DiffTypePillProps {
  diffType: DiffResultType;
}

const diffTypeToColorMap: Record<DiffResultType, string> = {
  NONE: 'transparent',
  MODIFIED: colors.support.yellow,
  ADDED: colors.support.green,
  DELETED: colors.support.red,
};

export const DiffTypePill = ({ diffType }: DiffTypePillProps) => {
  const { t } = useTranslation();
  if (diffType === 'NONE') return null;
  return (
    <StyledChangedPill color={diffTypeToColorMap[diffType]} textColor="white">
      {t(`diff.diffTypes.${diffType}`)}
    </StyledChangedPill>
  );
};

const styledItemBarCss = css`
  justify-content: space-between;
`;

const isChildNode = createGuard<DiffTypeWithChildren>('children');

export const TreeNode = ({
  node,
  onNodeSelected,
  selectedNode,
  parentActive,
  nodes,
  level,
}: Props) => {
  const { t } = useTranslation();
  const path = nodePathToUrnPath(node.path.other ?? node.path?.original!);
  const isActive =
    (selectedNode?.id.other ?? selectedNode?.id.original) === (node.id.other ?? node.id.original);
  const hasChildNodes = nodes && nodes.length > 0;
  const connectionId = isChildNode(node)
    ? node.connectionId.other ?? node.connectionId.original
    : undefined;

  const onItemClick = () => {
    onNodeSelected(node);
  };

  return (
    <StyledStructureItem
      connectionId={connectionId}
      id={node.id.other ?? node.id.original}
      key={path}
      greyedOut={!parentActive && !isActive}>
      <StyledItemBar level={level} highlight={isActive} css={styledItemBarCss}>
        <ItemTitleButton
          type="button"
          id={node.id.other ?? node.id.original}
          hasChildNodes={hasChildNodes}
          isRootNode={false}
          lastItemClickable={true}
          arrowDirection={90}
          onClick={onItemClick}
          isVisible={node.metadata?.visible.other ?? node.metadata?.visible.original}>
          {node.name.other ?? node.name.original}
        </ItemTitleButton>
        <DiffPills>
          {node.resourcesChanged &&
            node.resourcesChanged?.diffType !== 'NONE' &&
            node.changed.diffType !== 'DELETED' &&
            node.changed.diffType !== 'ADDED' && (
              <StyledChangedPill color={colors.tasksAndActivities.dark} textColor={'white'}>
                {t('diff.resourcesChanged')}
              </StyledChangedPill>
            )}
          {node.childrenChanged && node.childrenChanged?.diffType !== 'NONE' && (
            <StyledChangedPill color={colors.brand.primary} textColor={'white'}>
              {t('diff.childrenChanged')}
            </StyledChangedPill>
          )}
          {node.changed.diffType !== 'NONE' && <DiffTypePill diffType={node.changed.diffType} />}
        </DiffPills>
      </StyledItemBar>
      {hasChildNodes &&
        nodes &&
        nodes.map(node => (
          <StructureWrapper key={`${path}/${node.id.other ?? node.id.original}`}>
            <Fade show={true} fadeType="fadeInTop">
              <TreeNode
                key={`${path}/${node.id.other ?? node.id.original}`}
                parentActive={isActive}
                onNodeSelected={onNodeSelected}
                node={node}
                nodes={node.children}
                selectedNode={selectedNode}
                level={level + 1}
              />
            </Fade>
          </StructureWrapper>
        ))}
    </StyledStructureItem>
  );
};
