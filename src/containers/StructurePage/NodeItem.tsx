/*
 * Copyright (c) 2021-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { HTMLProps, MutableRefObject, ReactNode, useEffect } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { colors } from '@ndla/core';
import { Spinner } from '@ndla/icons';
import { Star } from '@ndla/icons/editor';
import Fade from '../../components/Taxonomy/Fade';
import MakeDndList from './MakeDNDList';
import { createGuard } from '../../util/guards';
import { ChildNodeType, NodeType } from '../../modules/nodes/nodeApiTypes';
import { nodePathToUrnPath } from '../../util/taxonomyHelpers';
import FolderItem from './folderComponents/FolderItem';
import { useSession } from '../Session/SessionProvider';
import { TAXONOMY_ADMIN_SCOPE } from '../../constants';
import {
  ItemTitleButton,
  StructureWrapper,
  StyledIcon,
  StyledItemBar,
  StyledStructureItem,
} from '../../components/Taxonomy/nodeStyles';

export type RenderBeforeFunction = (
  input: ChildNodeType | NodeType,
  isRoot: boolean,
  isTaxonomyAdmin: boolean,
  articleType?: string,
  isPublished?: boolean,
) => ReactNode;

interface RoundIconProps {
  smallIcon: ReactNode;
  clicked?: boolean;
  type?: 'button' | 'reset' | 'submit';
}

const RoundIcon = ({
  smallIcon,
  ...rest
}: RoundIconProps & Omit<HTMLProps<HTMLButtonElement>, 'as'>) => (
  <StyledIcon {...rest}>{smallIcon}</StyledIcon>
);

const isChildNode = createGuard<ChildNodeType & { articleType?: string; isPublished?: boolean }>(
  'connectionId',
);

interface Props {
  id: string;
  item: (ChildNodeType & { articleType?: string; isPublished?: boolean }) | NodeType;
  openedPaths: string[];
  toggleOpen: (nodeId: string) => void;
  level: number;
  onNodeSelected: (node?: NodeType) => void;
  resourceSectionRef: MutableRefObject<HTMLDivElement | null>;
  rootNodeId: string;
  onDragEnd: (result: DropResult, childNodes: ChildNodeType[]) => Promise<void>;
  connectionId: string;
  parentActive: boolean;
  isRoot?: boolean;
  isFavorite: boolean;
  toggleFavorite?: () => void;
  nodes?: ChildNodeType[];
  isLoading?: boolean;
  renderBeforeTitle?: RenderBeforeFunction;
  setShowAddTopicModal: (value: boolean) => void;
}

const NodeItem = ({
  item,
  openedPaths,
  toggleOpen,
  level,
  onNodeSelected,
  rootNodeId,
  resourceSectionRef,
  onDragEnd,
  parentActive,
  isRoot,
  isFavorite,
  toggleFavorite,
  isLoading,
  nodes,
  renderBeforeTitle,
  setShowAddTopicModal,
}: Props) => {
  const { userPermissions } = useSession();
  const isTaxonomyAdmin = userPermissions?.includes(TAXONOMY_ADMIN_SCOPE) || false;
  const path = nodePathToUrnPath(item.path);
  const isOpen = openedPaths.includes(path);
  const isActive = openedPaths[openedPaths.length - 1] === path;
  const hasChildNodes = isRoot ? true : nodes && nodes.length > 0;
  const connectionId = isChildNode(item) ? item.connectionId : undefined;
  const articleType = isChildNode(item) ? item.articleType : undefined;
  const isPublished = isChildNode(item) ? item.isPublished : undefined;

  useEffect(() => {
    if (isActive) {
      onNodeSelected(item);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const onItemClick = () => {
    toggleOpen(path);
    onNodeSelected(item);
  };

  return (
    <StyledStructureItem
      connectionId={connectionId}
      id={item.id}
      key={path}
      greyedOut={!parentActive && !isActive}
    >
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
          isVisible={item.metadata?.visible}
        >
          {renderBeforeTitle?.(item, !!isRoot, isTaxonomyAdmin, articleType, isPublished)}
          {item.name}
        </ItemTitleButton>
        {isActive && (
          <FolderItem
            node={item}
            rootNodeId={rootNodeId}
            key={item.id}
            isMainActive={isOpen}
            onCurrentNodeChanged={(node) => onNodeSelected(node)}
            jumpToResources={() => resourceSectionRef?.current?.scrollIntoView()}
            nodeChildren={nodes ?? []}
            setShowAddTopicModal={setShowAddTopicModal}
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
              onDragEnd={(res) => onDragEnd(res, nodes!)}
            >
              {nodes.map((t) => (
                <NodeItem
                  isFavorite={false}
                  renderBeforeTitle={renderBeforeTitle}
                  key={`${path}/${t.id}`}
                  parentActive={isActive}
                  connectionId={t.connectionId}
                  id={t.id}
                  rootNodeId={rootNodeId}
                  openedPaths={openedPaths}
                  resourceSectionRef={resourceSectionRef}
                  onNodeSelected={onNodeSelected}
                  item={t}
                  nodes={t.childNodes}
                  toggleOpen={toggleOpen}
                  level={level + 1}
                  onDragEnd={onDragEnd}
                  setShowAddTopicModal={setShowAddTopicModal}
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
