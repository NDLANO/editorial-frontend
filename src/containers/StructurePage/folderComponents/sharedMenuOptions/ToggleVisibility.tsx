/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Eye } from "@ndla/icons/editor";
import { SwitchControl, SwitchHiddenInput, SwitchLabel, SwitchRoot, SwitchThumb } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { Node, NodeType } from "@ndla/types-taxonomy";
import MenuItemButton from "./components/MenuItemButton";
import RoundIcon from "../../../../components/RoundIcon";
import { useUpdateNodeMetadataMutation } from "../../../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../../../modules/nodes/nodeQueries";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";
import { EditModeHandler } from "../SettingsMenuDropdownType";

interface Props {
  node: Node;
  editModeHandler: EditModeHandler;
  rootNodeId: string;
  rootNodeType?: NodeType;
}

const Wrapper = styled("div", {
  base: {
    background: "background.default",
    padding: "xxsmall",
  },
});

const ToggleVisibility = ({
  node,
  editModeHandler: { toggleEditMode, editMode },
  rootNodeId,
  rootNodeType = "SUBJECT",
}: Props) => {
  const { t, i18n } = useTranslation();
  const { id, metadata } = node;
  const [visible, setVisible] = useState(metadata?.visible);

  const { taxonomyVersion } = useTaxonomyVersion();
  const { mutateAsync: updateMetadata } = useUpdateNodeMetadataMutation();

  const qc = useQueryClient();
  const compKey = nodeQueryKeys.nodes({
    language: i18n.language,
    nodeType: rootNodeType,
    taxonomyVersion,
  });

  const toggleVisibility = async () => {
    await updateMetadata(
      {
        id,
        metadata: { grepCodes: metadata.grepCodes, visible: !visible },
        rootId: rootNodeId !== node.id ? rootNodeId : undefined,
        taxonomyVersion,
      },
      { onSuccess: () => qc.invalidateQueries({ queryKey: compKey }) },
    );
    setVisible(!visible);
  };

  const toggleEditModes = () => toggleEditMode("toggleMetadataVisibility");

  return (
    <>
      <MenuItemButton data-testid="toggleVisibilityButton" onClick={toggleEditModes}>
        <RoundIcon small icon={<Eye />} />
        {t("metadata.changeVisibility")}
      </MenuItemButton>
      {editMode === "toggleMetadataVisibility" && (
        <Wrapper>
          <SwitchRoot checked={visible} onCheckedChange={toggleVisibility}>
            <SwitchLabel>{t("metadata.visible")}</SwitchLabel>
            <SwitchControl>
              <SwitchThumb />
            </SwitchControl>
            <SwitchHiddenInput />
          </SwitchRoot>
        </Wrapper>
      )}
    </>
  );
};

export default ToggleVisibility;
