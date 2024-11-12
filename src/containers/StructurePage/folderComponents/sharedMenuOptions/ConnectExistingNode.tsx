/**
 * Copyright (c) 2022-present, NDLA.
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
import { AddLine } from "@ndla/icons/action";
import { Done } from "@ndla/icons/editor";
import { Spinner, Button } from "@ndla/primitives";
import { Node, NodeType } from "@ndla/types-taxonomy";
import NodeSearchDropdown from "./components/NodeSearchDropdown";
import RoundIcon from "../../../../components/RoundIcon";
import { usePostNodeConnectionMutation } from "../../../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../../../modules/nodes/nodeQueries";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";
import { EditModeHandler } from "../SettingsMenuDropdownType";

interface Props {
  editModeHandler: EditModeHandler;
  currentNode: Node;
  nodeType: NodeType;
}

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

const ConnectExistingNode = ({ editModeHandler: { editMode, toggleEditMode }, currentNode, nodeType }: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const { mutateAsync: connectNode } = usePostNodeConnectionMutation();
  const [error, setError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const qc = useQueryClient();

  useEffect(() => {
    if (success && editMode === "connectExistingNode") {
      setSuccess(false);
    }
  }, [editMode, success]);

  const toggleEditModeFunc = () => toggleEditMode("connectExistingNode");

  const handleSubmit = async (node: Node) => {
    setLoading(true);
    setError(undefined);
    toggleEditModeFunc();
    await connectNode(
      {
        taxonomyVersion,
        body: { parentId: currentNode.id, childId: node.id },
      },
      {
        onSuccess: () => {
          qc.invalidateQueries({
            queryKey: nodeQueryKeys.childNodes({
              taxonomyVersion,
              language: i18n.language,
            }),
          });
          setSuccess(true);
          setLoading(false);
        },
        onError: () => setError("taxonomy.errorMessage"),
      },
    );
  };

  if (editMode === "connectExistingNode") {
    return (
      <Wrapper>
        <RoundIcon open small smallIcon icon={<AddLine />} />
        <NodeSearchDropdown
          label={t("taxonomy.connectExistingNode", {
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
      </Wrapper>
    );
  }

  return (
    <StyledMenuWrapper>
      <Button size="small" variant="tertiary" onClick={toggleEditModeFunc}>
        <AddLine />
        {t("taxonomy.connectExistingNode", {
          nodeType: t(`taxonomy.nodeType.${nodeType}`),
        })}
      </Button>
      <StyledActionContent>
        {loading && (
          <MenuContent>
            <Spinner size="small" />
            {t("taxonomy.connectExistingLoading")}
          </MenuContent>
        )}
        {success && (
          <MenuContent>
            <StyledSuccessIcon />
            {t("taxonomy.connectExistingSuccess")}
          </MenuContent>
        )}
        {error && <StyledErrorMessage data-testid="inlineEditErrorMessage">{t(error)}</StyledErrorMessage>}
      </StyledActionContent>
    </StyledMenuWrapper>
  );
};

export default ConnectExistingNode;
