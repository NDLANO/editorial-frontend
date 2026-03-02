/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DragEndEvent } from "@dnd-kit/core";
import { AddLine, Draggable } from "@ndla/icons";
import { Button, DialogContent, DialogRoot, DialogTrigger, Heading, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { MultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import { Node, NodeChild, ResourceType } from "@ndla/types-taxonomy";
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
import { useCurrentNode } from "../CurrentNodeProvider";
import GroupTopicResources from "../folderComponents/topicMenuOptions/GroupTopicResources";
import { MultidisciplinaryDialogContent } from "../multidisciplinary/MultidisciplinaryDialog";
import { PlannedResourceDialogContent } from "../plannedResource/PlannedResourceDialog";
import { ResourceGroup } from "../utils";
import Resource from "./Resource";

const StyledResourceItems = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xxsmall",
    listStyle: "none",
  },
});

const ListContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const HeadingWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
    justifyContent: "space-between",
    paddingInlineEnd: "xsmall",
  },
});

const ActionsWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "medium",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
});

interface Props {
  type: ResourceGroup;
  title: string;
  description?: string;
  resources: NodeChild[];
  currentNode: Node;
  resourceTypes?: ResourceType[];
  contentMetas: Dictionary<MultiSearchSummaryDTO>;
  nodeResourcesIsPending: boolean;
  users?: Dictionary<Auth0UserData>;
  existingResourceIds: string[];
  isUngrouped?: boolean;
}

const isError = (error: unknown): error is Error => (error as Error).message !== undefined;

const ResourceItems = ({
  resources,
  currentNode,
  contentMetas,
  nodeResourcesIsPending,
  users,
  type,
  title,
  description,
  resourceTypes,
  existingResourceIds,
  isUngrouped,
}: Props) => {
  const { setCurrentNode } = useCurrentNode();
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const qc = useQueryClient();
  const compKey = nodeQueryKeys.childNodes({
    id: currentNode.id,
    language: i18n.language,
    nodeType: type !== "link" ? ["RESOURCE"] : undefined,
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

  // TODO: Adapt this to list spread. Need to account for sorting within lists etc.
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
    <ListContainer>
      <HeadingWrapper>
        <Heading asChild consumeCss textStyle="label.medium" fontWeight="bold">
          <h2>{title}</h2>
        </Heading>
        <ActionsWrapper>
          {type === "core" && (
            <GroupTopicResources
              node={currentNode}
              onChanged={(partialMeta) => {
                setCurrentNode({
                  ...currentNode,
                  metadata: { ...currentNode.metadata, ...partialMeta },
                });
              }}
            />
          )}
          <DialogRoot>
            <DialogTrigger asChild>
              <Button size="small">
                <AddLine />
                {t(`taxonomy.${type}.addNew`)}
              </Button>
            </DialogTrigger>
            <DialogContent>
              {type === "link" ? (
                <MultidisciplinaryDialogContent currentNode={currentNode} />
              ) : (
                <PlannedResourceDialogContent
                  currentNode={currentNode}
                  resourceTypes={resourceTypes ?? []}
                  existingResourceIds={existingResourceIds}
                  type={type}
                />
              )}
            </DialogContent>
          </DialogRoot>
        </ActionsWrapper>
      </HeadingWrapper>
      {!!description?.length && <Text>{description}</Text>}
      {resources.length ? (
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
            renderItem={(resource, idx) => (
              <Resource
                type={type}
                currentNodeId={currentNode.id}
                responsible={users?.[contentMetas[resource.contentUri ?? ""]?.responsible?.responsibleId ?? ""]?.name}
                contentMeta={resource.contentUri ? contentMetas[resource.contentUri] : undefined}
                resource={resource}
                key={resource.id}
                nodeResourcesIsPending={nodeResourcesIsPending}
                invalidate={onDeleted}
                index={idx}
                isUngrouped={isUngrouped}
              />
            )}
          />
          {deleteNodeConnection.error && isError(deleteNodeConnection.error) ? (
            <Text color="text.error">{`${t("taxonomy.errorMessage")}: ${deleteNodeConnection.error.message}`}</Text>
          ) : null}
        </StyledResourceItems>
      ) : (
        <Text>{t("taxonomy.noResources")}</Text>
      )}
    </ListContainer>
  );
};

export default ResourceItems;
