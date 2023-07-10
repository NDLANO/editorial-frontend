/*
 * Copyright (c) 2021-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { HTMLProps, MutableRefObject, ReactNode, useEffect } from 'react';
import { colors } from '@ndla/core';
import { Spinner } from '@ndla/icons';
import { DragVertical, Star } from '@ndla/icons/editor';
import { NodeChild, Node } from '@ndla/types-taxonomy';
import { DragEndEvent } from '@dnd-kit/core';
import { useTranslation } from 'react-i18next';
import Fade from '../../components/Taxonomy/Fade';
import { createGuard } from '../../util/guards';
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
import { NodeChildWithChildren } from '../../modules/nodes/nodeQueries';
import DndList from '../../components/DndList';
import { DragHandle } from '../../components/DraggableItem';

export type RenderBeforeFunction = (
  node: NodeChild | Node,
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

const isChildNode = createGuard<NodeChild & { articleType?: string; isPublished?: boolean }>(
  'connectionId',
);

interface Props {
  id: string;
  item: (NodeChild & { articleType?: string; isPublished?: boolean }) | Node;
  openedPaths: string[];
  toggleOpen: (nodeId: string) => void;
  onNodeSelected: (node?: Node) => void;
  resourceSectionRef: MutableRefObject<HTMLDivElement | null>;
  rootNodeId: string;
  onDragEnd: (result: DragEndEvent, childNodes: NodeChild[]) => Promise<void>;
  connectionId: string;
  parentActive: boolean;
  isRoot?: boolean;
  isFavorite: boolean;
  toggleFavorite?: () => void;
  nodes?: NodeChildWithChildren[];
  isLoading?: boolean;
  renderBeforeTitle?: RenderBeforeFunction;
  setShowAddChildModal: (value: boolean) => void;
  addChildTooltip: string;
}

const NodeItem = ({
  item,
  openedPaths,
  toggleOpen,
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
  setShowAddChildModal,
  addChildTooltip,
}: Props) => {
  const { t } = useTranslation();
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
      <StyledItemBar highlight={isActive}>
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
            setShowAddChildModal={setShowAddChildModal}
            addChildTooltip={addChildTooltip}
          />
        )}
        {isLoading && (
          <span>
            <Spinner size="normal" margin="4px 26px" />
          </span>
        )}
      </StyledItemBar>
      {hasChildNodes && isOpen && nodes && (
        <Fade show={true} fadeType="fadeInTop">
          <StructureWrapper>
            <DndList
              items={nodes}
              disabled={!isActive || nodes.length < 2}
              onDragEnd={(e) => onDragEnd(e, nodes)}
              renderItem={(t) => (
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
                  onDragEnd={onDragEnd}
                  setShowAddChildModal={setShowAddChildModal}
                  addChildTooltip={addChildTooltip}
                />
              )}
              dragHandle={
                <DragHandle aria-label={t('dragAndDrop.handle')}>
                  <DragVertical />
                </DragHandle>
              }
            />
          </StructureWrapper>
        </Fade>
      )}
    </StyledStructureItem>
  );
};

export default NodeItem;
