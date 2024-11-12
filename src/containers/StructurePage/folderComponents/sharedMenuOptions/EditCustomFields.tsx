/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { PencilFill } from "@ndla/icons/action";
import { Button } from "@ndla/primitives";
import { Node } from "@ndla/types-taxonomy";
import MenuItemCustomField from "./components/MenuItemCustomField";
import { EditMode } from "../../../../interfaces";

interface Props {
  node: Node;
  toggleEditMode: (state: EditMode) => void;
  editMode: string;
  onCurrentNodeChanged: (node: Node) => void;
}

const EditCustomFields = ({ node, toggleEditMode, editMode, onCurrentNodeChanged }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <Button
        size="small"
        variant="tertiary"
        data-testid="editCustomFieldsButton"
        onClick={() => toggleEditMode("openCustomFields")}
      >
        <PencilFill />
        {t("taxonomy.metadata.customFields.alterFields")}
      </Button>

      {editMode === "openCustomFields" && (
        <MenuItemCustomField node={node} onCurrentNodeChanged={onCurrentNodeChanged} />
      )}
    </>
  );
};

export default EditCustomFields;
