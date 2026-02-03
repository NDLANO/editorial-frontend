/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DragEndEvent } from "@dnd-kit/core";
import { Draggable } from "@ndla/icons";
import { Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { MultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import { NodeChild } from "@ndla/types-taxonomy";
import { sortBy } from "@ndla/util";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import DndList from "../../../components/DndList";
import { DragHandle } from "../../../components/DraggableItem";
import { Auth0UserData, Dictionary } from "../../../interfaces";
import { useDeleteNodeConnectionMutation, useUpdateNodeConnectionMutation } from "../../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../../modules/nodes/nodeQueries";
import handleError from "../../../util/handleError";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";
import Resource from "./Resource";

const StyledResourceItems = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xxsmall",
    listStyle: "none",
  },
});

interface Props {
  type: "resource" | "link";
  resources: NodeChild[];
  currentNodeId: string;
  contentMetas: Dictionary<MultiSearchSummaryDTO>;
  nodeResourcesIsPending: boolean;
  users?: Dictionary<Auth0UserData>;
}

const isError = (error: unknown): error is Error => (error as Error).message !== undefined;

const ResourceItems = ({ resources, currentNodeId, contentMetas, nodeResourcesIsPending, users, type }: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const qc = useQueryClient();
  const compKey = nodeQueryKeys.childNodes({
    id: currentNodeId,
    language: i18n.language,
    nodeType: type === "resource" ? ["RESOURCE"] : undefined,
    connectionTypes: type === "link" ? ["LINK"] : undefined,
    recursive: type === "link" ? false : undefined,
    taxonomyVersion,
  });

  const deleteNodeConnection = useDeleteNodeConnectionMutation({
    onMutate: async ({ id }) => {
      await qc.cancelQueries({ queryKey: compKey });
      const prevData = qc.getQueryData<NodeChild[]>(compKey) ?? [];
      const withoutDeleted = prevData.filter((res) => res.connectionId !== id);
      qc.setQueryData<NodeChild[]>(compKey, withoutDeleted);
      return prevData;
    },
  });

  const onUpdateRank = async (id: string, newRank: number) => {
    await qc.cancelQueries({ queryKey: compKey });
    const prevData = qc.getQueryData<NodeChild[]>(compKey) ?? [];

    const updated = prevData.map((r) => {
      if (r.connectionId === id) {
        return { ...r, rank: newRank };
      } else if (r.rank < newRank) {
        return r;
      } else return { ...r, rank: r.rank + 1 };
    });

    qc.setQueryData<NodeChild[]>(
      compKey,
      sortBy(updated, (r) => r.rank),
    );
    return resources;
  };

  const { mutateAsync: updateNodeConnection } = useUpdateNodeConnectionMutation({
    onMutate: ({ id, body }) => onUpdateRank(id, body.rank as number),
    onError: (e) => handleError(e),
    onSettled: () => qc.invalidateQueries({ queryKey: compKey }),
  });

  const onDeleted = async () => {
    qc.invalidateQueries({ queryKey: compKey });
  };

  const onDragEnd = async ({ active, over }: DragEndEvent) => {
    const [source, dest] = [resources[active.data.current?.index], resources[over?.data.current?.index]];
    if (!dest || !source || source.rank === dest.rank) return;

    await updateNodeConnection({
      id: source.connectionId,
      body: {
        primary: source.isPrimary,
        rank: source.rank > dest.rank ? dest.rank : dest.rank + 1,
        relevanceId: source.relevanceId,
      },
      taxonomyVersion,
    });
  };

  return (
    <StyledResourceItems>
      <DndList
        items={resources}
        disabled={resources.length < 2}
        onDragEnd={onDragEnd}
        dragHandle={
          <DragHandle aria-label={t("dragAndDrop.handle")}>
            <Draggable />
          </DragHandle>
        }
        renderItem={(resource) => (
          <Resource
            type={type}
            currentNodeId={currentNodeId}
            responsible={users?.[contentMetas[resource.contentUri ?? ""]?.responsible?.responsibleId ?? ""]?.name}
            contentMeta={resource.contentUri ? contentMetas[resource.contentUri] : undefined}
            resource={resource}
            key={resource.id}
            nodeResourcesIsPending={nodeResourcesIsPending}
            invalidate={onDeleted}
          />
        )}
      />
      {deleteNodeConnection.error && isError(deleteNodeConnection.error) ? (
        <Text color="text.error">{`${t("taxonomy.errorMessage")}: ${deleteNodeConnection.error.message}`}</Text>
      ) : null}
    </StyledResourceItems>
  );
};

export default ResourceItems;
