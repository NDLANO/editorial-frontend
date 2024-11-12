/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PencilFill } from "@ndla/icons/action";
import { Button } from "@ndla/primitives";
import { Node } from "@ndla/types-taxonomy";
import { AlertDialog } from "../../../../components/AlertDialog/AlertDialog";
import { FormActionsContainer } from "../../../../components/FormikForm";
import Overlay from "../../../../components/Overlay";
import Spinner from "../../../../components/Spinner";
import { usePutResourcesPrimaryMutation } from "../../../../modules/nodes/nodeMutations";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";
import { EditModeHandler } from "../SettingsMenuDropdownType";
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
      <Button size="small" variant="tertiary" onClick={toggleConnectedResourcesPrimary}>
        <PencilFill />
        {recursive ? t("taxonomy.resourcesPrimary.recursiveButtonText") : t("taxonomy.resourcesPrimary.buttonText")}
      </Button>
      <AlertDialog
        title={t("taxonomy.resourcesPrimary.buttonText")}
        label={t("taxonomy.resourcesPrimary.buttonText")}
        show={editMode === "setResourcesPrimary"}
        text={recursive ? t("taxonomy.resourcesPrimary.recursiveText") : t("taxonomy.resourcesPrimary.text")}
        onCancel={toggleConnectedResourcesPrimary}
      >
        <FormActionsContainer>
          <Button onClick={toggleConnectedResourcesPrimary} variant="danger">
            {t("form.abort")}
          </Button>
          <Button onClick={setConnectedResourcesPrimary} variant="secondary">
            {t("alertModal.continue")}
          </Button>
        </FormActionsContainer>
      </AlertDialog>
      {isPending && <Spinner appearance="absolute" />}
      {isPending && <Overlay modifiers={["absolute", "white-opacity", "zIndex"]} />}
      {error && <StyledErrorMessage data-testid="inlineEditErrorMessage">{error}</StyledErrorMessage>}
    </>
  );
};

export default SetResourcesPrimary;
