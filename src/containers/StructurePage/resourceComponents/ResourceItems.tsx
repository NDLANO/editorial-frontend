/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import sortBy from "lodash/sortBy";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { DragEndEvent } from "@dnd-kit/core";
import styled from "@emotion/styled";
import { useQueryClient } from "@tanstack/react-query";
import { spacing } from "@ndla/core";
import { DragVertical } from "@ndla/icons/editor";
import { NodeChild } from "@ndla/types-taxonomy";
import Resource from "./Resource";
import { ResourceWithNodeConnectionAndMeta } from "./StructureResources";
import AlertModal from "../../../components/AlertModal";
import DndList from "../../../components/DndList";
import { DragHandle } from "../../../components/DraggableItem";
import { Auth0UserData, Dictionary } from "../../../interfaces";
import { useDeleteResourceForNodeMutation, usePutResourceForNodeMutation } from "../../../modules/nodes/nodeMutations";
import { NodeResourceMeta, nodeQueryKeys } from "../../../modules/nodes/nodeQueries";
import handleError from "../../../util/handleError";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

const StyledResourceItems = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const StyledDragHandle = styled(DragHandle)`
  margin-right: ${spacing.xsmall};
`;

const StyledErrorMessage = styled.div`
  text-align: center;
  color: #fe5f55;
`;

interface Props {
  resources: ResourceWithNodeConnectionAndMeta[];
  currentNodeId: string;
  contentMeta: Dictionary<NodeResourceMeta>;
  contentMetaLoading: boolean;
  users?: Dictionary<Auth0UserData>;
  showQuality: boolean;
}

const isError = (error: unknown): error is Error => (error as Error).message !== undefined;

const ResourceItems = ({ resources, currentNodeId, contentMeta, contentMetaLoading, users, showQuality }: Props) => {
  const { t, i18n } = useTranslation();
  const [deleteId, setDeleteId] = useState<string>("");
  const { taxonomyVersion } = useTaxonomyVersion();

  const qc = useQueryClient();
  const compKey = nodeQueryKeys.resources({
    id: currentNodeId,
    language: i18n.language,
    taxonomyVersion,
  });
  const deleteNodeResource = useDeleteResourceForNodeMutation({
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
    qc.setQueryData<NodeChild[]>(compKey, sortBy(updated, ["rank"]));
    return resources;
  };

  const { mutateAsync: updateNodeResource } = usePutResourceForNodeMutation({
    onMutate: ({ id, body }) => onUpdateRank(id, body.rank as number),
    onError: (e) => handleError(e),
    onSuccess: () => qc.invalidateQueries({ queryKey: compKey }),
  });

  const onDelete = async (deleteId: string) => {
    setDeleteId("");
    await deleteNodeResource.mutateAsync(
      { id: deleteId, taxonomyVersion },
      { onSuccess: () => qc.invalidateQueries({ queryKey: compKey }) },
    );
  };

  const onDragEnd = async ({ active, over }: DragEndEvent) => {
    const [source, dest] = [resources[active.data.current?.index], resources[over?.data.current?.index]];
    if (!dest || !source || source.rank === dest.rank) return;

    await updateNodeResource({
      id: source.connectionId,
      body: {
        primary: source.isPrimary,
        rank: source.rank > dest.rank ? dest.rank : dest.rank + 1,
        relevanceId: source.relevanceId,
      },
      taxonomyVersion,
    });
  };

  const toggleDelete = (newDeleteId: string) => {
    setDeleteId(newDeleteId);
  };

  return (
    <StyledResourceItems>
      <DndList
        items={resources}
        disabled={resources.length < 2}
        onDragEnd={onDragEnd}
        dragHandle={
          <StyledDragHandle aria-label={t("dragAndDrop.handle")}>
            <DragVertical />
          </StyledDragHandle>
        }
        renderItem={(resource) => (
          <Resource
            currentNodeId={currentNodeId}
            responsible={users?.[contentMeta[resource.contentUri ?? ""]?.responsible?.responsibleId ?? ""]?.name}
            resource={{
              ...resource,
              contentMeta: resource.contentUri ? contentMeta[resource.contentUri] : undefined,
            }}
            key={resource.id}
            contentMetaLoading={contentMetaLoading}
            showQuality={showQuality}
          />
        )}
      />
      {deleteNodeResource.error && isError(deleteNodeResource.error) ? (
        <StyledErrorMessage data-testid="inlineEditErrorMessage">
          {`${t("taxonomy.errorMessage")}: ${deleteNodeResource.error.message}`}
        </StyledErrorMessage>
      ) : null}
      <AlertModal
        title={t("taxonomy.deleteResource")}
        label={t("taxonomy.deleteResource")}
        show={!!deleteId}
        text={t("taxonomy.resource.confirmDelete")}
        actions={[
          {
            text: t("form.abort"),
            onClick: () => toggleDelete(""),
          },
          {
            text: t("alertModal.delete"),
            onClick: () => onDelete(deleteId!),
          },
        ]}
        onCancel={() => toggleDelete("")}
      />
    </StyledResourceItems>
  );
};

export default ResourceItems;
