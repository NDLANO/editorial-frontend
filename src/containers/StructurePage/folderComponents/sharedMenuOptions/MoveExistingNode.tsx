/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CheckLine } from "@ndla/icons";
import { Text, Spinner } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node, NodeType } from "@ndla/types-taxonomy";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchConnectionsForNode } from "../../../../modules/nodes/nodeApi";
import {
  useDeleteNodeConnectionMutation,
  usePostNodeConnectionMutation,
} from "../../../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../../../modules/nodes/nodeQueries";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";
import NodeSearchDropdown from "./components/NodeSearchDropdown";

const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
    width: "100%",
  },
});

const StyledCheckLine = styled(CheckLine, {
  base: {
    fill: "stroke.success",
  },
});

const MenuContent = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
  },
});

const StyledMenuWrapper = styled("div", {
  base: { display: "flex" },
});

interface Props {
  currentNode: Node;
  nodeType?: NodeType;
}

const MoveExistingNode = ({ currentNode, nodeType = "TOPIC" }: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const deleteNodeConnectionMutation = useDeleteNodeConnectionMutation();
  const addNodeConnectionMutation = usePostNodeConnectionMutation();
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const qc = useQueryClient();

  const handleSubmit = async (node: Node) => {
    setLoading(true);
    setError(undefined);
    try {
      // drop all parent connections and replace with this.
      const connections = await fetchConnectionsForNode({
        id: node.id,
        taxonomyVersion,
      });
      const parentConnections = connections.filter((conn) => conn.type.startsWith("parent"));
      for (const parentConnection of parentConnections) {
        await deleteNodeConnectionMutation.mutateAsync({
          taxonomyVersion,
          id: parentConnection.connectionId,
        });
      }
      await addNodeConnectionMutation.mutateAsync({
        taxonomyVersion,
        body: { parentId: currentNode.id, childId: node.id },
      });

      // Invalidate all childNode-queries, since we don't know where the added node is from
      qc.invalidateQueries({
        queryKey: nodeQueryKeys.childNodes({
          taxonomyVersion,
          language: i18n.language,
        }),
      });
      setSuccess(true);
    } catch (e) {
      setError("taxonomy.errorMessage");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <NodeSearchDropdown
        label={t("taxonomy.addExistingNode", {
          nodeType: t(`taxonomy.nodeType.${nodeType}`),
        })}
        placeholder={t("taxonomy.existingNode", { nodeType: t(`taxonomy.nodeType.${nodeType}`) })}
        onChange={handleSubmit}
        searchNodeType={nodeType}
        filter={(node) => {
          return !node.paths?.some((p) => {
            const split = p.replace("/", "").split("/");
            return split[split.length - 2] === currentNode.id.replace("urn:", "");
          });
        }}
      />
      <StyledMenuWrapper>
        {!!loading && (
          <MenuContent>
            <Spinner size="small" />
            <Text>{t("taxonomy.addExistingLoading")}</Text>
          </MenuContent>
        )}
        {!!success && (
          <Text>
            <StyledCheckLine />
            {t("taxonomy.addExistingSuccess")}
          </Text>
        )}
        {!!error && <Text color="text.error">{error}</Text>}
      </StyledMenuWrapper>
    </Wrapper>
  );
};

export default MoveExistingNode;
