/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ErrorWarningLine } from "@ndla/icons";
import { Text, Button, Heading, MessageBox } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node, NodeChild } from "@ndla/types-taxonomy";
import { FormActionsContainer } from "../../../../components/FormikForm";
import { ARCHIVED } from "../../../../constants";
import { updateStatusDraft } from "../../../../modules/draft/draftApi";
import { fetchNodes } from "../../../../modules/nodes/nodeApi";
import { PROGRAMME, SUBJECT_NODE, TOPIC_NODE } from "../../../../modules/nodes/nodeApiTypes";
import { useDeleteNodeConnectionMutation, useDeleteNodeMutation } from "../../../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../../../modules/nodes/nodeQueries";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";
import { capitalizeFirstLetter } from "../../utils";

const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "small",
    width: "100%",
  },
});

type NodeType = typeof TOPIC_NODE | typeof SUBJECT_NODE | typeof PROGRAMME;

const childTranslation: Record<NodeType, string> = {
  SUBJECT: "taxonomy.delete.topic",
  TOPIC: "taxonomy.delete.subTopic",
  PROGRAMME: "taxonomy.delete.child",
};
interface Props {
  node: Node | NodeChild;
  nodeType: NodeType;
  nodeChildren: Node[];
  onCurrentNodeChanged: (node?: Node) => void;
  rootNodeId?: string;
}

const DeleteNode = ({ node, nodeType, nodeChildren, onCurrentNodeChanged, rootNodeId }: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const location = useLocation();

  const disabled = nodeChildren.length !== 0;

  const deleteNodeConnectionMutation = useDeleteNodeConnectionMutation();
  const deleteNodeMutation = useDeleteNodeMutation();
  const queryClient = useQueryClient();

  const onDelete = async (): Promise<void> => {
    setLoading(true);
    setError(undefined);
    try {
      if ("parentId" in node) {
        await deleteNodeConnectionMutation.mutateAsync({
          id: node.connectionId,
          taxonomyVersion,
        });
      }
      const articleId = Number(node.contentUri?.split(":")[2]);
      if ("parentId" in node && articleId) {
        const topicPlacements = await fetchNodes({
          contentURI: `urn:article:${articleId}`,
          nodeType: "TOPIC",
          language: i18n.language,
          taxonomyVersion,
        });
        if (topicPlacements.length === 1) {
          await updateStatusDraft(articleId, ARCHIVED);
        }
      }

      await deleteNodeMutation.mutateAsync(
        {
          id: node.id,
          taxonomyVersion,
          rootId: "parentId" in node ? rootNodeId : undefined,
        },
        {
          onSuccess: () => setLoading(false),
          onSettled: (_, __, { taxonomyVersion }) =>
            queryClient.invalidateQueries({
              queryKey: nodeQueryKeys.nodes({ taxonomyVersion }),
            }),
        },
      );
      navigate(location.pathname.split(node.id)[0], { replace: true });
      onCurrentNodeChanged(undefined);
    } catch (error) {
      const e = error as Error;
      setError(`${t("taxonomy.errorMessage")}${e.message ? `:${e.message}` : ""}`);
      setLoading(false);
    }
  };
  return (
    <Wrapper>
      <Heading consumeCss asChild textStyle="label.medium" fontWeight="bold">
        <h2>
          {t("taxonomy.delete.deleteNode", {
            nodeType: t(`taxonomy.nodeType.${nodeType}`),
          })}
        </h2>
      </Heading>
      <MessageBox variant={disabled ? "info" : "warning"}>
        <ErrorWarningLine />
        <Text>
          {disabled
            ? capitalizeFirstLetter(
                t("taxonomy.delete.deleteDisabled", {
                  nodeType: t(`taxonomy.nodeType.${nodeType}`),
                  childNode: t(childTranslation[nodeType]),
                }),
              )
            : t("taxonomy.delete.confirmDelete", { nodeType: t(`taxonomy.${node.nodeType}`) })}
        </Text>
      </MessageBox>
      <FormActionsContainer>
        <Button variant="danger" onClick={onDelete} loading={loading} disabled={disabled}>
          {t("alertDialog.delete")}
        </Button>
      </FormActionsContainer>
      {!!error && <Text color="text.error">{error}</Text>}
    </Wrapper>
  );
};

export default DeleteNode;
