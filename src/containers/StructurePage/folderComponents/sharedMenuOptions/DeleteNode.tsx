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
import { DeleteBinLine } from "@ndla/icons/action";
import { Button } from "@ndla/primitives";
import { HStack } from "@ndla/styled-system/jsx";
import { Node, NodeChild } from "@ndla/types-taxonomy";
import MenuItemButton from "./components/MenuItemButton";
import { AlertDialog } from "../../../../components/AlertDialog/AlertDialog";
import Overlay from "../../../../components/Overlay";
import RoundIcon from "../../../../components/RoundIcon";
import Spinner from "../../../../components/Spinner";
import { ARCHIVED } from "../../../../constants";
import { updateStatusDraft } from "../../../../modules/draft/draftApi";
import { fetchNodes } from "../../../../modules/nodes/nodeApi";
import { useDeleteNodeConnectionMutation, useDeleteNodeMutation } from "../../../../modules/nodes/nodeMutations";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";
import { EditModeHandler } from "../SettingsMenuDropdownType";
import { StyledErrorMessage } from "../styles";

interface Props {
  node: Node | NodeChild;
  nodeChildren: Node[];
  editModeHandler: EditModeHandler;
  onCurrentNodeChanged: (node?: Node) => void;
  rootNodeId?: string;
}

const DeleteNode = ({
  node,
  nodeChildren,
  editModeHandler: { editMode, toggleEditMode },
  onCurrentNodeChanged,
  rootNodeId,
}: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const location = useLocation();

  const disabled = nodeChildren && nodeChildren.length !== 0;

  const deleteNodeConnectionMutation = useDeleteNodeConnectionMutation();
  const deleteNodeMutation = useDeleteNodeMutation();

  const toggleDelete = () => toggleEditMode("deleteNode");

  const onDelete = async (): Promise<void> => {
    setLoading(true);
    setError(undefined);
    toggleDelete();
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
    <>
      <MenuItemButton data-testid="deleteNode" disabled={disabled} onClick={toggleDelete}>
        <RoundIcon small icon={<DeleteBinLine />} />
        {t("taxonomy.deleteNode")}
      </MenuItemButton>
      <AlertDialog
        label={t("taxonomy.deleteNode")}
        title={t("taxonomy.deleteNode")}
        show={editMode === "deleteNode"}
        onCancel={toggleDelete}
        text={t("taxonomy.confirmDelete")}
      >
        <HStack justify="flex-end" gap="xsmall">
          <Button variant="secondary" onClick={toggleDelete}>
            {t("form.abort")}
          </Button>
          <Button variant="danger" onClick={onDelete}>
            {t("alertModal.delete")}
          </Button>
        </HStack>
      </AlertDialog>
      {loading && <Spinner appearance="absolute" />}
      {loading && <Overlay modifiers={["absolute", "white-opacity", "zIndex"]} />}
      {error && <StyledErrorMessage data-testid="inlineEditErrorMessage">{error}</StyledErrorMessage>}
    </>
  );
};

export default DeleteNode;
