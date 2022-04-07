/*
 * Copyright (c) 2021-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { memo, MutableRefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { DropResult } from 'react-beautiful-dnd';
import { useQueryClient } from 'react-query';
import { isEqual, partition, sortBy } from 'lodash';
import { ChildNodeType, NodeType } from '../../modules/nodes/nodeApiTypes';
import { useChildNodesWithArticleType } from '../../modules/nodes/nodeQueries';
import { groupChildNodes } from '../../util/taxonomyHelpers';
import { CHILD_NODES_WITH_ARTICLE_TYPE } from '../../queryKeys';
import NodeItem, { RenderBeforeFunction } from './NodeItem';
import { useUpdateNodeConnectionMutation } from '../../modules/nodes/nodeMutations';
import { useTaxonomyVersion } from '../StructureVersion/TaxonomyVersionProvider';

interface Props {
  node: NodeType;
  toggleOpen: (path: string) => void;
  openedPaths: string[];
  isFavorite: boolean;
  toggleFavorite: () => void;
  onChildNodeSelected: (node?: ChildNodeType) => void;
  resourceSectionRef: MutableRefObject<HTMLDivElement | null>;
  allRootNodes: NodeType[];
  renderBeforeTitle?: RenderBeforeFunction;
}

const RootNode = ({
  isFavorite,
  node,
  openedPaths,
  toggleOpen,
  toggleFavorite,
  onChildNodeSelected,
  resourceSectionRef,
  allRootNodes,
  renderBeforeTitle,
}: Props) => {
  const { i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const locale = i18n.language;
  const childNodesQuery = useChildNodesWithArticleType(
    { id: node.id, language: locale, taxonomyVersion },
    {
      enabled: openedPaths[0] === node.id,
      select: childNodes => groupChildNodes(childNodes),
    },
  );

  const qc = useQueryClient();

  const onUpdateRank = async (id: string, newRank: number) => {
    await qc.cancelQueries([CHILD_NODES_WITH_ARTICLE_TYPE, node.id, locale]);
    const compositeKey = [CHILD_NODES_WITH_ARTICLE_TYPE, node.id, locale];
    const prevData = qc.getQueryData<ChildNodeType[]>(compositeKey);
    const [toUpdate, other] = partition(prevData, t => t.connectionId === id);
    const updatedNode: ChildNodeType = { ...toUpdate[0], rank: newRank };
    const updated = other.map(t => (t.rank >= updatedNode.rank ? { ...t, rank: t.rank + 1 } : t));
    const newArr = sortBy([...updated, updatedNode], 'rank');
    qc.setQueryData<ChildNodeType[]>([CHILD_NODES_WITH_ARTICLE_TYPE, node.id, locale], newArr);
    return prevData;
  };

  const { mutateAsync: updateNodeConnection } = useUpdateNodeConnectionMutation({
    onMutate: ({ params }) => onUpdateRank(params.id, params.body.rank!),
    onSettled: () => qc.invalidateQueries([CHILD_NODES_WITH_ARTICLE_TYPE, node.id, locale]),
  });

  const onDragEnd = async (dropResult: DropResult, nodes: ChildNodeType[]) => {
    const { draggableId, source, destination } = dropResult;
    if (!destination) return;
    const currentRank = nodes[source.index].rank;
    const destinationRank = nodes[destination.index].rank;
    if (currentRank === destinationRank) return;
    const newRank = currentRank > destinationRank ? destinationRank : destinationRank + 1;
    await updateNodeConnection({
      params: { id: draggableId, body: { rank: newRank } },
      taxonomyVersion,
    });
  };

  return (
    <NodeItem
      renderBeforeTitle={renderBeforeTitle}
      id={node.id}
      item={node}
      nodes={childNodesQuery.data}
      openedPaths={openedPaths}
      level={1}
      onChildNodeSelected={onChildNodeSelected}
      toggleOpen={toggleOpen}
      toggleFavorite={toggleFavorite}
      rootNodeId={node.id}
      resourceSectionRef={resourceSectionRef}
      onDragEnd={onDragEnd}
      connectionId={''}
      parentActive={true}
      allRootNodes={allRootNodes}
      isRoot={true}
      isFavorite={isFavorite}
      isLoading={childNodesQuery.isLoading}
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
