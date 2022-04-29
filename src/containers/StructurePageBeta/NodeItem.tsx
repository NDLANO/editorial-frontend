/*
 * Copyright (c) 2021-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { HTMLProps, MutableRefObject, ReactNode, useEffect } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { colors } from '@ndla/core';
import { Spinner } from '@ndla/ui';
import { Star } from '@ndla/icons/editor';
// import FolderItem from './folderComponents/FolderItem';
import Fade from './Fade';
import MakeDndList from './MakeDNDList';
import { createGuard } from '../../util/guards';
import { ChildNodeType, NodeType } from '../../modules/nodes/nodeApiTypes';
import { nodePathToUrnPath } from '../../util/taxonomyHelpers';
import FolderItem from './folderComponents/FolderItem';
import {
  ItemTitleButton,
  StructureWrapper,
  StyledIcon,
  StyledItemBar,
  StyledStructureItem,
} from './nodeStyles';

export type RenderBeforeFunction = (
  input: ChildNodeType | NodeType,
  isRoot: boolean,
  articleType?: string,
) => ReactNode;

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
            onCurrentNodeChanged={node => (isChildNode(node) ? onChildNodeSelected(node) : null)}
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
