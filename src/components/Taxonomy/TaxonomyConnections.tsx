/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node, NodeChild, NodeConnection } from "@ndla/types-taxonomy";
import { sortBy } from "@ndla/util";
import ActiveTopicConnection from "./ActiveTopicConnection";
import { AddConnectionDialog } from "./AddConnectionDialog";
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT } from "../../constants";
import { useUserData } from "../../modules/draft/draftQueries";
import { fetchChildNodes } from "../../modules/nodes/nodeApi";
import { NodeWithChildren } from "../../modules/nodes/nodeApiTypes";
import {
  useDeleteNodeConnectionMutation,
  usePostNodeConnectionMutation,
  usePostNodeMutation,
  useUpdateNodeConnectionMutation,
} from "../../modules/nodes/nodeMutations";
import { nodeQueryKeys, useNodes } from "../../modules/nodes/nodeQueries";
import handleError from "../../util/handleError";
import { groupChildNodes } from "../../util/taxonomyHelpers";
import { MinimalNodeChild } from "../Taxonomy/types";

interface Props {
  taxonomyVersion: string;
  type: "topic" | "resource";
  resourceType: "article" | "learningpath";
  language: string;
  resourceId: number;
  resourceTitle: string;
  placements: Node[] | MinimalNodeChild[];
  node: Node | undefined;
}

const Wrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    flexDirection: "column",
  },
});

const StyledConnectionsList = styled("ul", {
  base: {
    listStyle: "none",
    marginBottom: "small",
  },
});

export const TaxonomyConnections = ({
  taxonomyVersion,
  type,
  resourceType,
  resourceId,
  resourceTitle,
  language,
  placements,
  node,
}: Props) => {
  const { t, i18n } = useTranslation();
  const [structure, setStructure] = useState<NodeWithChildren[]>([]);
  const userDataQuery = useUserData();
  const qc = useQueryClient();
  const queryKey = nodeQueryKeys.nodes({
    taxonomyVersion,
    contentURI: `urn:${resourceType}:${resourceId}`,
    language,
    includeContexts: true,
  });
  const deleteNodeConnectionMutation = useDeleteNodeConnectionMutation({
    onSettled: () => qc.invalidateQueries({ queryKey }),
  });
  const postNodeConnectionMutation = usePostNodeConnectionMutation({
    onSettled: () => qc.invalidateQueries({ queryKey }),
  });
  const postNodeMutation = usePostNodeMutation();
  const updateNodeConnectionMutation = useUpdateNodeConnectionMutation({
    onSettled: () => qc.invalidateQueries({ queryKey }),
  });

  const subjectsQuery = useNodes(
    { language: i18n.language, taxonomyVersion, nodeType: "SUBJECT" },
    {
      select: (subject) =>
        sortBy(
          subject.filter((s) => !!s.name),
          (s) => s.name,
        ),
    },
  );

  useEffect(() => {
    if (subjectsQuery.data) {
      setStructure(subjectsQuery.data);
    }
  }, [subjectsQuery.data]);

  useEffect(() => {
    if (postNodeMutation.isSuccess && type === "topic" && subjectsQuery.data) {
      setStructure(subjectsQuery.data);
      postNodeMutation.reset();
    }
  }, [postNodeMutation, subjectsQuery.data, type]);

  const filtered = structure.filter(
    (node) => node.metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT] !== "true",
  );

  const addConnection = useCallback(
    async (parent: NodeChild | Node) => {
      let nodeId = node?.id;
      if (type === "topic") {
        const location = await postNodeMutation.mutateAsync({
          body: {
            language: i18n.language,
            contentUri: `urn:${resourceType}:${resourceId}`,
            name: resourceTitle,
            nodeType: "TOPIC",
          },
          taxonomyVersion,
        });
        nodeId = location.replace("/v1/nodes/", "");
      }
      if (!nodeId) return;
      await postNodeConnectionMutation.mutateAsync({
        taxonomyVersion,
        body: {
          childId: nodeId,
          parentId: parent.id,
          primary: type === "topic" ? undefined : placements.length === 0,
          relevanceId: type === "topic" ? undefined : parent.relevanceId,
        },
      });
    },
    [
      i18n.language,
      node?.id,
      placements.length,
      postNodeConnectionMutation,
      postNodeMutation,
      resourceId,
      resourceTitle,
      resourceType,
      taxonomyVersion,
      type,
    ],
  );

  const removeConnection = useCallback(
    async (id: string) => {
      await deleteNodeConnectionMutation.mutateAsync({ id, taxonomyVersion });
    },
    [deleteNodeConnectionMutation, taxonomyVersion],
  );

  const updateNodeConnection = useCallback(
    async ({ primary, relevanceId, id }: Pick<NodeConnection, "id" | "primary" | "relevanceId">) => {
      await updateNodeConnectionMutation.mutateAsync({
        id,
        taxonomyVersion,
        body: { primary, relevanceId },
      });
    },
    [taxonomyVersion, updateNodeConnectionMutation],
  );

  const getSubjectTopics = useCallback(
    async (subjectId: string) => {
      if (structure.some((subject) => subject.id === subjectId && !!subject.childNodes)) {
        return;
      }
      try {
        const nodes = await fetchChildNodes({
          id: subjectId,
          language: i18n.language,
          taxonomyVersion,
          nodeType: ["TOPIC"],
          recursive: true,
        });
        const childNodes = groupChildNodes(nodes);
        setStructure((subjects) => subjects.map((s) => (s.id === subjectId ? { ...s, childNodes } : s)));
      } catch (err) {
        handleError(err);
      }
    },
    [i18n.language, structure, taxonomyVersion],
  );

  return (
    <Wrapper>
      <Text textStyle="label.medium" fontWeight="bold">
        {type === "topic" ? t("taxonomy.topics.topicPlacement") : t("taxonomy.topics.title")}
      </Text>
      <Text>
        {type === "topic" ? t("taxonomy.topics.description") : t("taxonomy.topics.taxonomySubjectConnections")}
      </Text>
      <StyledConnectionsList>
        {placements.map((node) => (
          <ActiveTopicConnection
            key={node.id}
            node={node}
            removeConnection={removeConnection}
            type={type}
            updateConnection={updateNodeConnection}
          />
        ))}
      </StyledConnectionsList>
      {!!deleteNodeConnectionMutation.isError && <Text>{t("taxonomy.errors.failedToDeleteConnection")}</Text>}
      {!!updateNodeConnectionMutation.isError && <Text>{t("taxonomy.errors.failedToUpdateConnection")}</Text>}
      {!!(postNodeMutation.isError || postNodeConnectionMutation.isError) && (
        <Text>{t("taxonomy.errors.failedToCreateConnection")}</Text>
      )}
      <AddConnectionDialog
        type={type}
        structure={filtered}
        selectedNodes={placements}
        favoriteSubjects={userDataQuery.data?.favoriteSubjects}
        addConnection={addConnection}
        getSubjectTopics={getSubjectTopics}
      />
    </Wrapper>
  );
};
