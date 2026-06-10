/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DragEndEvent } from "@dnd-kit/core";
import { UserDataDTO } from "@ndla/types-backend/draft-api";
import { NodeChild, Node, NodeType } from "@ndla/types-backend/taxonomy-api";
import { keyBy, partition, sortBy } from "@ndla/util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isEqual } from "lodash-es";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { draftQueryKeys, updateUserDataMutationOptions } from "../../modules/draft/draftQueries";
import { updateNodeConnectionMutationOptions } from "../../modules/nodes/nodeMutations";
import { childNodesQueryOptions, nodeQueryKeys } from "../../modules/nodes/nodeQueries";
import { searchQueryOptions } from "../../modules/search/searchQueries";
import { getContentUriFromSearchSummary } from "../../util/searchHelpers";
import { getContentUrisFromNodes, groupChildNodes } from "../../util/taxonomyHelpers";
import { useTaxonomyVersion } from "../StructureVersion/TaxonomyVersionProvider";
import NodeItem from "./NodeItem";
import { extrapolateNodeResourcesFromSearch, getSearchParamsFromContentUris } from "./utils";

interface Props {
  node: Node;
  openedPaths: string[];
  isFavorite: boolean;
  childNodeTypes: NodeType[];
  rootPath: string;
}

const RootNode = ({ isFavorite, node, openedPaths, childNodeTypes, rootPath }: Props) => {
  const { i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const locale = i18n.language;
  const childNodesQuery = useQuery({
    ...childNodesQueryOptions({
      id: node.id,
      language: locale,
      nodeType: childNodeTypes,
      recursive: true,
      taxonomyVersion,
    }),
    enabled: openedPaths[0] === node.id,
  });

  const contentUris = useMemo(
    () => getContentUrisFromNodes([...(childNodesQuery.data ?? []), node]),
    [childNodesQuery.data, node],
  );

  const resourceMetasQuery = useQuery({
    ...searchQueryOptions({ language: i18n.language, ...getSearchParamsFromContentUris(contentUris) }),
    select: (data) => extrapolateNodeResourcesFromSearch(contentUris, data.results),
    enabled: !!childNodesQuery.data?.length && !!contentUris.length && node.nodeType !== "PROGRAMME",
  });

  const keyedMetas = useMemo(
    () => keyBy(resourceMetasQuery.data, (m) => getContentUriFromSearchSummary(m)),
    [resourceMetasQuery.data],
  );

  const groupedChildNodes = useMemo(() => groupChildNodes(childNodesQuery.data ?? []), [childNodesQuery.data]);

  const compKey = nodeQueryKeys.childNodes({
    taxonomyVersion,
    id: node.id,
    language: locale,
  });
  const updateUserDataMutation = useMutation(updateUserDataMutationOptions());

  const qc = useQueryClient();

  const onUpdateRank = async (id: string, newRank: number) => {
    await qc.cancelQueries({ queryKey: compKey });
    const prevData = qc.getQueryData<NodeChild[]>(compKey);
    const [toUpdate, other] = partition(prevData, (t) => t.connectionId === id);
    const updatedNode: NodeChild = { ...toUpdate[0], rank: newRank };
    const updated = other.map((t) => (t.rank >= updatedNode.rank ? { ...t, rank: t.rank + 1 } : t));
    const newArr = sortBy([...updated, updatedNode], (node) => node.rank);
    qc.setQueryData<NodeChild[]>(compKey, newArr);
    return prevData;
  };

  const { mutateAsync: updateNodeConnection } = useMutation({
    ...updateNodeConnectionMutationOptions(),
    onMutate: ({ id, body }) => onUpdateRank(id, body.rank!),
    onSettled: () => qc.invalidateQueries({ queryKey: compKey }),
  });

  const onDragEnd = async ({ active, over }: DragEndEvent, nodes: NodeChild[]) => {
    const [source, dest] = [nodes[active.data.current?.index], nodes[over?.data.current?.index]];
    if (!source || !dest || source.rank === dest.rank) return;
    const newRank = source.rank > dest.rank ? dest.rank : dest.rank + 1;
    await updateNodeConnection({
      id: source.connectionId,
      body: {
        rank: newRank,
        relevanceId: source.relevanceId,
        primary: source.isPrimary,
      },
      taxonomyVersion,
    });
  };

  const toggleFavorite = () => {
    const favorites = qc.getQueryData<UserDataDTO>(draftQueryKeys.userData)?.favoriteSubjects ?? [];
    const updatedFavs = favorites.includes(node.id)
      ? favorites.filter((s) => s !== node.id)
      : favorites.concat(node.id);
    updateUserDataMutation.mutate({ favoriteSubjects: updatedFavs });
  };

  return (
    <NodeItem
      id={node.id}
      key={node.id}
      item={node}
      nodes={groupedChildNodes}
      keyedMetas={keyedMetas}
      openedPaths={openedPaths}
      toggleFavorite={toggleFavorite}
      rootNodeId={node.id}
      onDragEnd={onDragEnd}
      connectionId={""}
      isRoot={true}
      isFavorite={isFavorite}
      isLoading={childNodesQuery.isLoading}
      rootPath={rootPath}
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
