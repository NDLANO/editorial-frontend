/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { ErrorWarningLine } from "@ndla/icons/common";
import { Text, Button, Heading, MessageBox } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node, NodeChild } from "@ndla/types-taxonomy";
import { FormActionsContainer } from "../../../../components/FormikForm";
import { ARCHIVED } from "../../../../constants";
import { updateStatusDraft } from "../../../../modules/draft/draftApi";
import { fetchNodes } from "../../../../modules/nodes/nodeApi";
import { useDeleteNodeConnectionMutation, useDeleteNodeMutation } from "../../../../modules/nodes/nodeMutations";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";

const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "small",
    width: "100%",
  },
});

interface Props {
  node: Node | NodeChild;
  nodeChildren: Node[];
  onCurrentNodeChanged: (node?: Node) => void;
  rootNodeId?: string;
}

const DeleteNode = ({ node, nodeChildren, onCurrentNodeChanged, rootNodeId }: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const location = useLocation();

  const disabled = nodeChildren.length !== 0;

  const deleteNodeConnectionMutation = useDeleteNodeConnectionMutation();
  const deleteNodeMutation = useDeleteNodeMutation();

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
        { onSuccess: () => setLoading(false) },
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
        <h2>{t("taxonomy.deleteNode")}</h2>
      </Heading>
      <MessageBox variant={disabled ? "info" : "warning"}>
        <ErrorWarningLine />
        <Text>{disabled ? t("taxonomy.deleteDisabled") : t("taxonomy.confirmDelete")}</Text>
      </MessageBox>
      <FormActionsContainer>
        <Button variant="danger" onClick={onDelete} loading={loading} disabled={disabled}>
          {t("alertModal.delete")}
        </Button>
      </FormActionsContainer>
      {error && <Text color="text.error">{error}</Text>}
    </Wrapper>
  );
};

export default DeleteNode;
