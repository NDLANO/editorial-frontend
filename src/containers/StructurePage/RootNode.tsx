/*
 * Copyright (c) 2021-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { memo, MutableRefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { DropResult } from 'react-beautiful-dnd';
import { useQueryClient } from '@tanstack/react-query';
import isEqual from 'lodash/isEqual';
import partition from 'lodash/partition';
import sortBy from 'lodash/sortBy';
import { IUserData } from '@ndla/types-backend/draft-api';
import { ChildNodeType, NodeType } from '../../modules/nodes/nodeApiTypes';
import {
  childNodesWithArticleTypeQueryKey,
  useChildNodesWithArticleType,
} from '../../modules/nodes/nodeQueries';
import { groupChildNodes } from '../../util/taxonomyHelpers';
import NodeItem, { RenderBeforeFunction } from './NodeItem';
import { useUpdateNodeConnectionMutation } from '../../modules/nodes/nodeMutations';
import { useTaxonomyVersion } from '../StructureVersion/TaxonomyVersionProvider';
import { userDataQueryKey, useUpdateUserDataMutation } from '../../modules/draft/draftQueries';

interface Props {
  node: NodeType;
  toggleOpen: (path: string) => void;
  openedPaths: string[];
  isFavorite: boolean;
  onNodeSelected: (node?: NodeType) => void;
  resourceSectionRef: MutableRefObject<HTMLDivElement | null>;
  renderBeforeTitle?: RenderBeforeFunction;
  setShowAddTopicModal: (value: boolean) => void;
}

const RootNode = ({
  isFavorite,
  node,
  openedPaths,
  toggleOpen,
  onNodeSelected,
  resourceSectionRef,
  renderBeforeTitle,
  setShowAddTopicModal,
}: Props) => {
  const { i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const locale = i18n.language;
  const childNodesQuery = useChildNodesWithArticleType(
    { id: node.id, language: locale, taxonomyVersion },
    {
      enabled: openedPaths[0] === node.id,
      select: (childNodes) => groupChildNodes(childNodes),
    },
  );
  const compKey = childNodesWithArticleTypeQueryKey({
    taxonomyVersion,
    id: node.id,
    language: locale,
  });
  const updateUserDataMutation = useUpdateUserDataMutation();

  const qc = useQueryClient();

  const onUpdateRank = async (id: string, newRank: number) => {
    await qc.cancelQueries(compKey);
    const prevData = qc.getQueryData<ChildNodeType[]>(compKey);
    const [toUpdate, other] = partition(prevData, (t) => t.connectionId === id);
    const updatedNode: ChildNodeType = { ...toUpdate[0], rank: newRank };
    const updated = other.map((t) => (t.rank >= updatedNode.rank ? { ...t, rank: t.rank + 1 } : t));
    const newArr = sortBy([...updated, updatedNode], 'rank');
    qc.setQueryData<ChildNodeType[]>(compKey, newArr);
    return prevData;
  };

  const { mutateAsync: updateNodeConnection } = useUpdateNodeConnectionMutation({
    onMutate: ({ id, body }) => onUpdateRank(id, body.rank!),
    onSettled: () => qc.invalidateQueries(compKey),
  });

  const onDragEnd = async (dropResult: DropResult, nodes: ChildNodeType[]) => {
    const { draggableId, source, destination } = dropResult;
    if (!destination) return;
    const currentRank = nodes[source.index].rank;
    const destinationRank = nodes[destination.index].rank;
    if (currentRank === destinationRank) return;
    const newRank = currentRank > destinationRank ? destinationRank : destinationRank + 1;
    await updateNodeConnection({
      id: draggableId,
      body: {
        rank: newRank,
        relevanceId: nodes[source.index].relevanceId,
        primary: nodes[source.index].isPrimary,
      },
      taxonomyVersion,
    });
  };

  const toggleFavorite = () => {
    const favorites = qc.getQueryData<IUserData>(userDataQueryKey())?.favoriteSubjects ?? [];
    const updatedFavs = favorites.includes(node.id)
      ? favorites.filter((s) => s !== node.id)
      : favorites.concat(node.id);
    updateUserDataMutation.mutate({ favoriteSubjects: updatedFavs });
  };

  return (
    <NodeItem
      renderBeforeTitle={renderBeforeTitle}
      id={node.id}
      item={node}
      nodes={childNodesQuery.data}
      openedPaths={openedPaths}
      level={1}
      onNodeSelected={onNodeSelected}
      toggleOpen={toggleOpen}
      toggleFavorite={toggleFavorite}
      rootNodeId={node.id}
      resourceSectionRef={resourceSectionRef}
      onDragEnd={onDragEnd}
      connectionId={''}
      parentActive={true}
      isRoot={true}
      isFavorite={isFavorite}
      isLoading={childNodesQuery.isInitialLoading}
      setShowAddTopicModal={setShowAddTopicModal}
    />
  );
};

const propsAreEqual = (prevProps: Props, props: Props) => {
  const isInPath = props.openedPaths[0] === props.node.id;
  const noLongerInPath = prevProps.openedPaths[0] === prevProps.node.id && !isInPath;
  if (isInPath) {
    return false;
  } else if (noLongerInPath) {
    return false;
  }

  if (prevProps.isFavorite !== props.isFavorite) {
    return false;
  }
  return isEqual(prevProps.node, props.node);
};

export default memo(RootNode, propsAreEqual);
