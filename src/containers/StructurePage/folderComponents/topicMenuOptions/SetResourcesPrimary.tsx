/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pencil } from "@ndla/icons/action";
import { Node } from "@ndla/types-taxonomy";
import { AlertDialog } from "../../../../components/AlertDialog/AlertDialog";
import Overlay from "../../../../components/Overlay";
import RoundIcon from "../../../../components/RoundIcon";
import Spinner from "../../../../components/Spinner";
import { usePutResourcesPrimaryMutation } from "../../../../modules/nodes/nodeMutations";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";
import { EditModeHandler } from "../SettingsMenuDropdownType";
import MenuItemButton from "../sharedMenuOptions/components/MenuItemButton";
import { StyledErrorMessage } from "../styles";

interface Props {
  node: Node;
  recursive?: boolean;
  editModeHandler: EditModeHandler;
}

const SetResourcesPrimary = ({ node, recursive = false, editModeHandler: { editMode, toggleEditMode } }: Props) => {
  const { t } = useTranslation();
  const [error, setError] = useState<string>();
  const { mutateAsync, isPending } = usePutResourcesPrimaryMutation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const toggleConnectedResourcesPrimary = () => toggleEditMode("setResourcesPrimary");

  const setConnectedResourcesPrimary = async () => {
    setError(undefined);
    toggleConnectedResourcesPrimary();

    await mutateAsync(
      { taxonomyVersion, id: node.id, recursive },
      { onError: () => setError(t("taxonomy.resourcesPrimary.error")) },
    );
  };

  return (
    <>
      <MenuItemButton onClick={toggleConnectedResourcesPrimary}>
        <RoundIcon small icon={<Pencil />} />
        {recursive ? t("taxonomy.resourcesPrimary.recursiveButtonText") : t("taxonomy.resourcesPrimary.buttonText")}
      </MenuItemButton>
      <AlertDialog
        title={t("taxonomy.resourcesPrimary.buttonText")}
        label={t("taxonomy.resourcesPrimary.buttonText")}
        show={editMode === "setResourcesPrimary"}
        actions={[
          {
            text: t("form.abort"),
            onClick: toggleConnectedResourcesPrimary,
          },
          {
            text: t("alertModal.continue"),
            onClick: setConnectedResourcesPrimary,
          },
        ]}
        onCancel={toggleConnectedResourcesPrimary}
        text={recursive ? t("taxonomy.resourcesPrimary.recursiveText") : t("taxonomy.resourcesPrimary.text")}
      />
      {isPending && <Spinner appearance="absolute" />}
      {isPending && <Overlay modifiers={["absolute", "white-opacity", "zIndex"]} />}
      {error && <StyledErrorMessage data-testid="inlineEditErrorMessage">{error}</StyledErrorMessage>}
    </>
  );
};

export default SetResourcesPrimary;
