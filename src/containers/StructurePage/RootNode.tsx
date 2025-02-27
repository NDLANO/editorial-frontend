/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { partition, isEqual, sortBy } from "lodash-es";
import { memo, MutableRefObject } from "react";
import { useTranslation } from "react-i18next";
import { DragEndEvent } from "@dnd-kit/core";
import { useQueryClient } from "@tanstack/react-query";
import { IUserDataDTO } from "@ndla/types-backend/draft-api";
import { NodeChild, Node, NodeType } from "@ndla/types-taxonomy";
import NodeItem from "./NodeItem";
import { draftQueryKeys, useUpdateUserDataMutation } from "../../modules/draft/draftQueries";
import { useUpdateNodeConnectionMutation } from "../../modules/nodes/nodeMutations";
import { nodeQueryKeys, useChildNodesWithArticleType } from "../../modules/nodes/nodeQueries";
import { groupChildNodes } from "../../util/taxonomyHelpers";
import { useTaxonomyVersion } from "../StructureVersion/TaxonomyVersionProvider";

interface Props {
  node: Node;
  openedPaths: string[];
  isFavorite: boolean;
  onNodeSelected: (node?: Node) => void;
  resourceSectionRef: MutableRefObject<HTMLDivElement | null>;
  childNodeTypes: NodeType[];
  showQuality: boolean;
  rootPath: string;
}

const RootNode = ({
  isFavorite,
  node,
  openedPaths,
  onNodeSelected,
  resourceSectionRef,
  childNodeTypes,
  showQuality,
  rootPath,
}: Props) => {
  const { i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const locale = i18n.language;
  const childNodesQuery = useChildNodesWithArticleType(
    {
      id: node.id,
      language: locale,
      nodeType: childNodeTypes,
      taxonomyVersion,
    },
    {
      enabled: openedPaths[0] === node.id,
      select: (childNodes) => groupChildNodes(childNodes),
    },
  );
  const compKey = nodeQueryKeys.childNodes({
    taxonomyVersion,
    id: node.id,
    language: locale,
  });
  const updateUserDataMutation = useUpdateUserDataMutation();

  const qc = useQueryClient();

  const onUpdateRank = async (id: string, newRank: number) => {
    await qc.cancelQueries({ queryKey: compKey });
    const prevData = qc.getQueryData<NodeChild[]>(compKey);
    const [toUpdate, other] = partition(prevData, (t) => t.connectionId === id);
    const updatedNode: NodeChild = { ...toUpdate[0], rank: newRank };
    const updated = other.map((t) => (t.rank >= updatedNode.rank ? { ...t, rank: t.rank + 1 } : t));
    const newArr = sortBy([...updated, updatedNode], "rank");
    qc.setQueryData<NodeChild[]>(compKey, newArr);
    return prevData;
  };

  const { mutateAsync: updateNodeConnection } = useUpdateNodeConnectionMutation({
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
    const favorites = qc.getQueryData<IUserDataDTO>(draftQueryKeys.userData)?.favoriteSubjects ?? [];
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
      nodes={childNodesQuery.data}
      openedPaths={openedPaths}
      onNodeSelected={onNodeSelected}
      toggleFavorite={toggleFavorite}
      rootNodeId={node.id}
      resourceSectionRef={resourceSectionRef}
      onDragEnd={onDragEnd}
      connectionId={""}
      isRoot={true}
      isFavorite={isFavorite}
      isLoading={childNodesQuery.isLoading}
      showQuality={showQuality}
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

  if (prevProps.showQuality !== props.showQuality) {
    return false;
  }
  if (prevProps.isFavorite !== props.isFavorite) {
    return false;
  }
  return isEqual(prevProps.node, props.node);
};

export default memo(RootNode, propsAreEqual);
