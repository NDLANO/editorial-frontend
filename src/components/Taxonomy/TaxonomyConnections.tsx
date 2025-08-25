/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { IArticleDTO } from "@ndla/types-backend/draft-api";
import { Node, NodeChild } from "@ndla/types-taxonomy";
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT } from "../../constants";
import { useUserData } from "../../modules/draft/draftQueries";
import { fetchChildNodes } from "../../modules/nodes/nodeApi";
import { NodeWithChildren } from "../../modules/nodes/nodeApiTypes";
import {
  useAddNodeMutation,
  useDeleteNodeConnectionMutation,
  usePostNodeConnectionMutation,
  useUpdateNodeConnectionMutation,
} from "../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../modules/nodes/nodeQueries";
import handleError from "../../util/handleError";
import { groupChildNodes } from "../../util/taxonomyHelpers";
import TopicConnections from "../Taxonomy/TopicConnections";
import { MinimalNodeChild } from "../Taxonomy/types";

interface Props {
  subjects: NodeWithChildren[];
  taxonomyVersion: string;
  type: "topic" | "resource";
  language: string;
  article: IArticleDTO;
  placements: Node[] | MinimalNodeChild[];
  node: Node;
}

export const TaxonomyConnections = ({
  subjects,
  taxonomyVersion,
  type,
  article,
  language,
  placements,
  node,
}: Props) => {
  const { i18n } = useTranslation();
  const [structure, setStructure] = useState<NodeWithChildren[]>(subjects);
  const [showFavorites, setShowFavorites] = useState(true);
  const userDataQuery = useUserData();
  const qc = useQueryClient();
  const deleteNodeConnectionMutation = useDeleteNodeConnectionMutation();
  const postNodeConnectionMutation = usePostNodeConnectionMutation();
  const postNodeMutation = useAddNodeMutation();
  const updateNodeConnectionMutation = useUpdateNodeConnectionMutation();

  const filtered = structure.filter(
    (node) => node.metadata.customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT] !== "true",
  );

  const nodes = useMemo(
    () =>
      showFavorites ? filtered.filter((node) => userDataQuery.data?.favoriteSubjects?.includes(node.id)) : filtered,
    [showFavorites, filtered, userDataQuery.data?.favoriteSubjects],
  );

  useEffect(() => {
    if (userDataQuery.data) {
      setShowFavorites(!!userDataQuery.data.favoriteSubjects?.length);
    }
  }, [userDataQuery.data]);

  const addConnection = useCallback(
    async (parent: NodeChild | Node) => {
      let nodeId = node.id;
      if (type === "topic") {
        const location = await postNodeMutation.mutateAsync({
          body: {
            contentUri: `urn:article:${article.id}`,
            name: article.title?.title ?? "",
            nodeType: "TOPIC",
          },
          taxonomyVersion,
        });
        nodeId = location.replace("/v1/nodes/", "");
      }
      await postNodeConnectionMutation.mutateAsync({
        taxonomyVersion,
        body: {
          childId: nodeId,
          parentId: parent.id,
          primary: type === "topic" ? undefined : placements.length === 0,
          relevanceId: type === "topic" ? undefined : parent.relevanceId,
        },
      });
      if (!postNodeConnectionMutation.isError && !postNodeMutation.isError) {
        qc.invalidateQueries({
          queryKey: nodeQueryKeys.nodes({
            contentURI: `urn:article:${article.id}`,
            taxonomyVersion,
            language,
            includeContexts: true,
          }),
        });
        postNodeConnectionMutation.reset();
        postNodeMutation.reset();
      }
    },
    [
      article.id,
      article.title?.title,
      language,
      node.id,
      placements.length,
      postNodeConnectionMutation,
      postNodeMutation,
      qc,
      taxonomyVersion,
      type,
    ],
  );

  const removeConnection = useCallback(
    async (id: string) => {
      await deleteNodeConnectionMutation.mutateAsync({ id, taxonomyVersion });
      if (deleteNodeConnectionMutation.isSuccess) {
        qc.invalidateQueries({
          queryKey: nodeQueryKeys.nodes({
            contentURI: `urn:article:${article.id}`,
            taxonomyVersion,
            language,
            includeContexts: true,
          }),
        });
      }
      deleteNodeConnectionMutation.reset();
    },
    [article.id, deleteNodeConnectionMutation, language, qc, taxonomyVersion],
  );

  const setPrimaryConnection = useCallback(
    async (id: string) => {
      await updateNodeConnectionMutation.mutateAsync({
        id,
        taxonomyVersion,
        body: { primary: true },
      });
      if (updateNodeConnectionMutation.isSuccess) {
        qc.invalidateQueries({
          queryKey: nodeQueryKeys.nodes({
            contentURI: `urn:article:${article.id}`,
            taxonomyVersion,
            language,
            includeContexts: true,
          }),
        });
      }
      updateNodeConnectionMutation.reset();
    },
    [article.id, language, qc, taxonomyVersion, updateNodeConnectionMutation],
  );

  const setRelevance = useCallback(
    async (id: string, relevanceId: string) => {
      await updateNodeConnectionMutation.mutateAsync({
        id,
        taxonomyVersion,
        body: { relevanceId },
      });
      if (updateNodeConnectionMutation.isSuccess) {
        qc.invalidateQueries({
          queryKey: nodeQueryKeys.nodes({
            contentURI: `urn:article:${article.id}`,
            taxonomyVersion,
            language,
            includeContexts: true,
          }),
        });
      }
      updateNodeConnectionMutation.reset();
    },
    [article.id, language, qc, taxonomyVersion, updateNodeConnectionMutation],
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
    <TopicConnections
      addConnection={addConnection}
      structure={nodes}
      selectedNodes={placements}
      removeConnection={removeConnection}
      setPrimaryConnection={setPrimaryConnection}
      setRelevance={setRelevance}
      getSubjectTopics={getSubjectTopics}
      type={type}
    />
  );
};
