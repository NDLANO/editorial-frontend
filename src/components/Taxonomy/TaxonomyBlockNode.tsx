import { Node, NodeChild } from '@ndla/types-taxonomy';
import { useCallback, useMemo } from 'react';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { colors, fonts, spacing } from '@ndla/core';
import { Check } from '@ndla/icons/editor';
import { useTranslation } from 'react-i18next';
import { NodeChildWithChildren } from '../../modules/nodes/nodeQueries';
import {
  ItemTitleButton,
  StructureWrapper,
  StyledItemBar,
  StyledStructureItem,
} from './nodeStyles';
import Fade from './Fade';
import { MinimalNodeChild } from '../../containers/ArticlePage/LearningResourcePage/components/LearningResourceTaxonomy';

export interface NodeWithChildren extends Node {
  childNodes?: NodeChildWithChildren[];
}

const ItemBar = styled(StyledItemBar)`
  display: flex;
  justify-content: space-between;
  &:hover,
  &:active,
  &:focus-within {
    [data-select-button] {
      opacity: 1;
    }
  }
`;

const StyledStructureWrapper = styled(StructureWrapper)`
  padding-left: ${spacing.small};
`;

interface Props {
  node: NodeWithChildren;
  openedPaths: string[];
  toggleOpen: (node: Node) => void;
  onSelect: (node: NodeChild) => void;
  selectedNodes: MinimalNodeChild[] | Node[];
}

export const RootNode = ({ node, toggleOpen, openedPaths, onSelect, selectedNodes }: Props) => {
  const isOpen = useMemo(() => openedPaths.includes(node.id), [openedPaths, node.id]);
  const isActive = useMemo(
    () => openedPaths[openedPaths.length - 1] === node.id,
    [openedPaths, node.id],
  );

  const onClick = useCallback(() => toggleOpen(node), [node, toggleOpen]);

  return (
    <StyledStructureItem key={node.path} greyedOut={!isActive}>
      <StyledItemBar highlight={isActive}>
        <ItemTitleButton
          type="button"
          hasChildNodes
          isRootNode={false}
          lastItemClickable
          arrowDirection={isOpen ? 90 : 0}
          onClick={onClick}
        >
          {node.name}
        </ItemTitleButton>
      </StyledItemBar>
      {isOpen && node.childNodes && (
        <Fade show fadeType="fadeInTop">
          <StyledStructureWrapper>
            {node.childNodes?.map((childNode) => (
              <ChildNode
                key={childNode.id}
                node={childNode}
                onSelect={onSelect}
                toggleOpen={toggleOpen}
                parentActive={isActive}
                openedPaths={openedPaths}
                selectedNodes={selectedNodes}
              />
            ))}
          </StyledStructureWrapper>
        </Fade>
      )}
    </StyledStructureItem>
  );
};

interface NodeItemProps {
  node: NodeChildWithChildren;
  onSelect: (node: NodeChild) => void;
  toggleOpen: (node: Node) => void;
  openedPaths: string[];
  selectedNodes: MinimalNodeChild[] | Node[];
  parentActive: boolean;
}

const StyledChecked = styled('div')`
  ${fonts.sizes(16, 1.1)}

  font-weight: ${fonts.weight.semibold};
  display: flex;
  align-items: center;

  svg {
    fill: ${colors.support.green};
  }
`;

const StyledButton = styled(ButtonV2)`
  opacity: 0;
`;

const ChildNode = ({
  node,
  onSelect,
  toggleOpen,
  openedPaths,
  parentActive,
  selectedNodes,
}: NodeItemProps) => {
  const { t } = useTranslation();
  const isOpen = useMemo(() => openedPaths.includes(node.id), [openedPaths, node.id]);
  const isActive = useMemo(
    () => openedPaths[openedPaths.length - 1] === node.id,
    [openedPaths, node.id],
  );

  const isSelected = useMemo(() => {
    return selectedNodes.some((sel) => sel.id === node.id);
  }, [selectedNodes, node]);

  const onClick = useCallback(() => toggleOpen(node), [node, toggleOpen]);

  const onSelected = useCallback(() => onSelect(node), [node, onSelect]);

  return (
    <StyledStructureItem key={node.path} greyedOut={parentActive}>
      <ItemBar highlight={isActive}>
        <ItemTitleButton
          type="button"
          hasChildNodes={!!node.childNodes?.length}
          arrowDirection={isOpen ? 90 : 0}
          onClick={onClick}
          isVisible={node.metadata.visible}
        >
          {node.name}
        </ItemTitleButton>
        {isSelected ? (
          <StyledChecked>
            <Check />
            <span>{t('taxonomy.topics.addedTopic')}</span>
          </StyledChecked>
        ) : (
          <StyledButton data-select-button="" variant="outline" size="small" onClick={onSelected}>
            {t('taxonomy.topics.filestructureButton')}
          </StyledButton>
        )}
      </ItemBar>
      {isOpen && node.childNodes && (
        <Fade show fadeType="fadeInTop">
          <StyledStructureWrapper>
            {node.childNodes?.map((childNode) => (
              <ChildNode
                key={childNode.id}
                node={childNode}
                onSelect={onSelect}
                toggleOpen={toggleOpen}
                parentActive={isActive}
                openedPaths={openedPaths}
                selectedNodes={selectedNodes}
              />
            ))}
          </StyledStructureWrapper>
        </Fade>
      )}
    </StyledStructureItem>
  );
};

export default RootNode;
