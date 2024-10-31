/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { useQueryClient } from "@tanstack/react-query";
import { spacing, colors } from "@ndla/core";
import { Plus } from "@ndla/icons/action";
import { Done } from "@ndla/icons/editor";
import { Node, NodeType } from "@ndla/types-taxonomy";
import MenuItemButton from "./components/MenuItemButton";
import NodeSearchDropdown from "./components/NodeSearchDropdown";
import { OldSpinner } from "../../../../components/OldSpinner";
import RoundIcon from "../../../../components/RoundIcon";
import { fetchConnectionsForNode } from "../../../../modules/nodes/nodeApi";
import {
  useDeleteNodeConnectionMutation,
  usePostNodeConnectionMutation,
} from "../../../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../../../modules/nodes/nodeQueries";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";
import { EditModeHandler } from "../SettingsMenuDropdownType";

interface Props {
  editModeHandler: EditModeHandler;
  currentNode: Node;
  nodeType?: NodeType;
}

const StyledSpinner = styled(OldSpinner)`
  margin: 0px 4px;
`;

const StyledSuccessIcon = styled(Done)`
  border-radius: 90px;
  margin: 5px;
  background-color: green;
  color: white;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin: ${spacing.xsmall};
`;

const MenuContent = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
`;

const StyledErrorMessage = styled.div`
  color: ${colors.support.red};
`;

const StyledActionContent = styled.div`
  padding-left: ${spacing.normal};
`;

const MoveExistingNode = ({
  editModeHandler: { editMode, toggleEditMode },
  currentNode,
  nodeType = "TOPIC",
}: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const deleteNodeConnectionMutation = useDeleteNodeConnectionMutation();
  const addNodeConnectionMutation = usePostNodeConnectionMutation();
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const qc = useQueryClient();

  useEffect(() => {
    if (success && editMode === "moveExistingNode") {
      setSuccess(false);
    }
  }, [editMode, success]);

  const toggleEditModeFunc = () => toggleEditMode("moveExistingNode");

  const handleSubmit = async (node: Node) => {
    setLoading(true);
    setError(undefined);
    toggleEditModeFunc();
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

  if (editMode === "moveExistingNode") {
    return (
      <Wrapper>
        <RoundIcon open small smallIcon icon={<Plus />} />
        <NodeSearchDropdown
          placeholder={t("taxonomy.existingNode")}
          onChange={handleSubmit}
          searchNodeType={nodeType}
          filter={(node) => {
            return !node.paths?.some((p) => {
              const split = p.replace("/", "").split("/");
              return split[split.length - 2] === currentNode.id.replace("urn:", "");
            });
          }}
        />
      </Wrapper>
    );
  }

  return (
    <StyledMenuWrapper>
      <MenuItemButton onClick={toggleEditModeFunc}>
        <RoundIcon small icon={<Plus />} />
        {t("taxonomy.addExistingNode", {
          nodeType: t(`taxonomy.nodeType.${nodeType}`),
        })}
      </MenuItemButton>
      <StyledActionContent>
        {loading && (
          <MenuContent>
            <StyledSpinner size="normal" />
            {t("taxonomy.addExistingLoading")}
          </MenuContent>
        )}
        {success && (
          <MenuContent>
            <StyledSuccessIcon />
            {t("taxonomy.addExistingSuccess")}
          </MenuContent>
        )}
        {error && <StyledErrorMessage data-testid="inlineEditErrorMessage">{t(error)}</StyledErrorMessage>}
      </StyledActionContent>
    </StyledMenuWrapper>
  );
};

export default MoveExistingNode;
