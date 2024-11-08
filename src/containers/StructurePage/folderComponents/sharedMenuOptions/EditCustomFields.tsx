/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { PencilFill } from "@ndla/icons/action";
import { Node } from "@ndla/types-taxonomy";
import MenuItemButton from "./components/MenuItemButton";
import MenuItemCustomField from "./components/MenuItemCustomField";
import RoundIcon from "../../../../components/RoundIcon";
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
    <div>
      <MenuItemButton data-testid="editCustomFieldsButton" onClick={() => toggleEditMode("openCustomFields")}>
        <RoundIcon small open={editMode === "openCustomFields"} icon={<PencilFill />} />
        {t("taxonomy.metadata.customFields.alterFields")}
      </MenuItemButton>

      {editMode === "openCustomFields" && (
        <MenuItemCustomField node={node} onCurrentNodeChanged={onCurrentNodeChanged} />
      )}
    </div>
  );
};

export default EditCustomFields;
