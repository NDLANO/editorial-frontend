/*
 * Copyright (c) 2021-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { HTMLProps, MutableRefObject, ReactNode, useEffect } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { spacing, colors, fonts } from '@ndla/core';
import { Spinner } from '@ndla/ui';
import { Star } from '@ndla/icons/editor';
import css from '@emotion/css';
import styled from '@emotion/styled';
// import FolderItem from './folderComponents/FolderItem';
import Fade from './Fade';
import MakeDndList from './MakeDNDList';
import { createGuard } from '../../util/guards';
import { ChildNodeType, NodeType } from '../../modules/nodes/nodeApiTypes';
import { nodePathToUrnPath } from '../../util/taxonomyHelpers';
import FolderItem from './folderComponents/FolderItem';

export type RenderBeforeFunction = (
  input: ChildNodeType | NodeType,
  isRoot: boolean,
  articleType?: string,
) => ReactNode;

interface ItemTitleButtonProps {
  isVisible?: boolean;
  hasChildNodes?: boolean;
  lastItemClickable?: boolean;
  isRootNode?: boolean;
  arrowDirection?: number;
}

const itemTitleArrow = css`
  &:before {
    content: '';
    display: block;
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 9px solid ${colors.text.primary};
    margin-right: ${spacing.xsmall};
  }
`;

const itemTitleLinked = css`
  &:before {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    border-bottom: 2px solid ${colors.brand.light};
    border-left: 2px solid ${colors.brand.light};
    border-bottom-left-radius: 2px;
    margin-right: ${spacing.xsmall};
    margin-left: 7px;
  }
`;

const ItemTitleButton = styled.button<ItemTitleButtonProps>`
  ${fonts.sizes(16, 1)};
  font-weight: ${fonts.weight.semibold};
  border: 0;
  background: 0;
  color: ${props => (!props.isVisible ? colors.brand.grey : colors.brand.primary)};
  display: flex;
  align-items: center;
  text-align: left;
  white-space: nowrap;
  font-style: ${props => !props.isVisible && 'italic'};

  ${props => props.hasChildNodes && itemTitleArrow};
  ${props =>
    props.lastItemClickable &&
    css`
      cursor: pointer;
    `};
  ${props => !props.hasChildNodes && !props.isRootNode && itemTitleLinked};

  &:before {
    transition: transform 200ms ease;
    transform: rotate(${props => props.hasChildNodes && props.arrowDirection}deg);
  }
`;

interface StyledItemBarProps {
  level: number;
  highlight?: boolean;
}

const StyledItemBar = styled.div<StyledItemBarProps>`
  display: flex;
  padding: 0 ${spacing.small} 0 calc(${props => props.level} * 17px + ${spacing.small});
  height: 40px;
  border-bottom: 1px solid ${colors.brand.greyLighter};
  background: ${props => props.highlight && colors.brand.light};

  &:hover {
    background: ${props => (props.highlight ? colors.brand.light : '#f1f5f8')};
  }
`;

interface StyledStructureItemProps {
  greyedOut?: boolean;
  connectionId?: string;
}

const StyledStructureItem = styled.li<StyledStructureItemProps>`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  ${props =>
    props.greyedOut &&
    css`
      > div > button {
        color: rgb(32, 88, 143, 0.5);
      }
    `};
`;

const StructureWrapper = styled.ul`
  margin: 0;
  padding: 0;
`;

const StyledIcon = styled.button`
  display: flex;
  align-items: center;

  border: 0;
  background: transparent;

  svg:hover {
    fill: ${colors.favoriteColor};
    cursor: pointer;
  }
`;

interface RoundIconProps {
  smallIcon: ReactNode;
  clicked?: boolean;
  type?: 'button' | 'reset' | 'submit';
}

const RoundIcon = ({ smallIcon, ...rest }: RoundIconProps & HTMLProps<HTMLButtonElement>) => (
  <StyledIcon {...rest}>{smallIcon}</StyledIcon>
);

const isChildNode = createGuard<ChildNodeType>('connectionId');

interface Props {
  id: string;
  item: (ChildNodeType & { articleType?: string }) | NodeType;
  openedPaths: string[];
  toggleOpen: (nodeId: string) => void;
  level: number;
  onChildNodeSelected: (childNode?: ChildNodeType) => void;
  resourceSectionRef: MutableRefObject<HTMLDivElement | null>;
  rootNodeId: string;
  onDragEnd: (result: DropResult, childNodes: ChildNodeType[]) => Promise<void>;
  connectionId: string;
  parentActive: boolean;
  allRootNodes: NodeType[];
  isRoot?: boolean;
  isFavorite: boolean;
  toggleFavorite?: () => void;
  nodes?: ChildNodeType[];
  isLoading?: boolean;
  renderBeforeTitle?: RenderBeforeFunction;
}

const NodeItem = ({
  item,
  openedPaths,
  toggleOpen,
  level,
  onChildNodeSelected,
  rootNodeId,
  resourceSectionRef,
  onDragEnd,
  parentActive,
  allRootNodes,
  isRoot,
  isFavorite,
  toggleFavorite,
  isLoading,
  nodes,
  renderBeforeTitle,
}: Props) => {
  const path = nodePathToUrnPath(item.path);
  const isOpen = openedPaths.includes(path);
  const isActive = openedPaths[openedPaths.length - 1] === path;
  const hasChildNodes = isRoot ? true : nodes && nodes.length > 0;
  const connectionId = isChildNode(item) ? item.connectionId : undefined;
  const articleType = isChildNode(item) ? item.articleType : undefined;

  useEffect(() => {
    if (isActive && isChildNode(item)) {
      onChildNodeSelected(item);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onItemClick = () => {
    toggleOpen(path);
    onChildNodeSelected(isChildNode(item) ? item : undefined);
  };

  return (
    <StyledStructureItem
      connectionId={connectionId}
      id={item.id}
      key={path}
      greyedOut={!parentActive && !isActive}>
      <StyledItemBar level={level} highlight={isActive}>
        {isRoot && (
          <RoundIcon
            onClick={toggleFavorite}
            smallIcon={<Star color={isFavorite ? colors.favoriteColor : colors.brand.greyDark} />}
          />
        )}
        <ItemTitleButton
          type="button"
          id={item.id}
          hasChildNodes={hasChildNodes}
          isRootNode={false}
          lastItemClickable={true}
          arrowDirection={isOpen ? 90 : 0}
          onClick={onItemClick}
          isVisible={item.metadata?.visible}>
          {renderBeforeTitle?.(item, !!isRoot, articleType)}
          {item.name}
        </ItemTitleButton>
        {isActive && (
          <FolderItem
            node={item}
            rootNodeId={rootNodeId}
            key={item.id}
            isMainActive={isOpen}
            structure={allRootNodes}
            jumpToResources={() => resourceSectionRef?.current?.scrollIntoView()}
          />
        )}
        {isLoading && (
          <span>
            <Spinner size="normal" margin="4px 26px" />
          </span>
        )}
      </StyledItemBar>
      {hasChildNodes && isOpen && nodes && (
        <StructureWrapper>
          <Fade show={true} fadeType="fadeInTop">
            <MakeDndList
              disableDND={!isActive || nodes.length < 2}
              dragHandle
              onDragEnd={res => onDragEnd(res, nodes!)}>
              {nodes.map(t => (
                <NodeItem
                  isFavorite={false}
                  renderBeforeTitle={renderBeforeTitle}
                  key={`${path}/${t.id}`}
                  allRootNodes={allRootNodes}
                  parentActive={isActive}
                  connectionId={t.connectionId}
                  id={t.id}
                  rootNodeId={rootNodeId}
                  openedPaths={openedPaths}
                  resourceSectionRef={resourceSectionRef}
                  onChildNodeSelected={onChildNodeSelected}
                  item={t}
                  nodes={t.childNodes}
                  toggleOpen={toggleOpen}
                  level={level + 1}
                  onDragEnd={onDragEnd}
                />
              ))}
            </MakeDndList>
          </Fade>
        </StructureWrapper>
      )}
    </StyledStructureItem>
  );
};

export default NodeItem;
