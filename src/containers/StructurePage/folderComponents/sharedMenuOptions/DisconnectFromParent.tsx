/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { DeleteBinLine } from "@ndla/icons/action";
import { Button } from "@ndla/primitives";
import { HStack } from "@ndla/styled-system/jsx";
import { Node, NodeChild } from "@ndla/types-taxonomy";
import MenuItemButton from "./components/MenuItemButton";
import { AlertDialog } from "../../../../components/AlertDialog/AlertDialog";
import Overlay from "../../../../components/Overlay";
import RoundIcon from "../../../../components/RoundIcon";
import Spinner from "../../../../components/Spinner";
import { useDeleteNodeConnectionMutation } from "../../../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../../../modules/nodes/nodeQueries";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";
import { EditModeHandler } from "../SettingsMenuDropdownType";
import { StyledErrorMessage } from "../styles";

interface Props {
  node: Node | NodeChild;
  editModeHandler: EditModeHandler;
  onCurrentNodeChanged: (node?: Node) => void;
}

const DisconnectFromParent = ({ node, editModeHandler: { editMode, toggleEditMode }, onCurrentNodeChanged }: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const { mutateAsync: disconnectNode } = useDeleteNodeConnectionMutation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const location = useLocation();
  const qc = useQueryClient();

  const toggleDisconnect = () => toggleEditMode("disconnectFromParent");

  const onDisconnect = async (): Promise<void> => {
    setLoading(true);
    setError(undefined);
    toggleDisconnect();
    if ("connectionId" in node) {
      await disconnectNode(
        {
          id: node.connectionId,
          taxonomyVersion,
        },
        {
          onSuccess: () => {
            qc.invalidateQueries({
              queryKey: nodeQueryKeys.childNodes({
                taxonomyVersion,
                language: i18n.language,
              }),
            });
            navigate(location.pathname.split(node.id)[0], { replace: true });
            onCurrentNodeChanged(undefined);
          },
          onError: () => setError(t("taxonomy.errorMessage")),
        },
      );
    }
  };

  return (
    <>
      <MenuItemButton data-testid="disconnectNode" onClick={toggleDisconnect}>
        <RoundIcon small icon={<DeleteBinLine />} />
        {t("taxonomy.disconnectNode")}
      </MenuItemButton>
      <AlertDialog
        label={t("taxonomy.disconnectNode")}
        title={t("taxonomy.disconnectNode")}
        show={editMode === "disconnectFromParent"}
        onCancel={toggleDisconnect}
        text={t("taxonomy.confirmDisconnect")}
      >
        <HStack>
          <Button variant="secondary" onClick={toggleDisconnect}>
            {t("form.abort")}
          </Button>
          <Button variant="danger" onClick={onDisconnect}>
            {t("alertModal.disconnect")}
          </Button>
        </HStack>
      </AlertDialog>
      {loading && <Spinner appearance="absolute" />}
      {loading && <Overlay modifiers={["absolute", "white-opacity", "zIndex"]} />}
      {error && <StyledErrorMessage data-testid="inlineEditErrorMessage">{error}</StyledErrorMessage>}
    </>
  );
};

export default DisconnectFromParent;
