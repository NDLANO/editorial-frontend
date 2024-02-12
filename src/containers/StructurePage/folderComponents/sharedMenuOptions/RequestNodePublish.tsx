/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CloudUploadOutline } from "@ndla/icons/editor";
import { Node } from "@ndla/types-taxonomy";
import MenuItemButton from "./components/MenuItemButton";
import RoundIcon from "../../../../components/RoundIcon";
import { TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH } from "../../../../constants";
import { useUpdateNodeMetadataMutation } from "../../../../modules/nodes/nodeMutations";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";
import { EditModeHandler } from "../SettingsMenuDropdownType";

interface Props {
  node: Node;
  editModeHandler: EditModeHandler;
  rootNodeId: string;
}
const RequestNodePublish = ({ node, rootNodeId }: Props) => {
  const [hasRequested, setHasRequested] = useState(
    node.metadata.customFields[TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH] === "true",
  );
  const { id, metadata } = node;
  const { taxonomyVersion } = useTaxonomyVersion();

  const { mutateAsync: updateMetadata } = useUpdateNodeMetadataMutation();

  const togglePublish = async () => {
    const oldValue = metadata.customFields[TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH];
    const newValue = oldValue === "true" ? "false" : "true";
    await updateMetadata({
      id,
      metadata: {
        ...metadata,
        customFields: {
          ...metadata.customFields,
          [TAXONOMY_CUSTOM_FIELD_REQUEST_PUBLISH]: newValue,
        },
      },
      rootId: rootNodeId !== node.id ? rootNodeId : undefined,
      taxonomyVersion: "default",
    });
    setHasRequested(newValue === "true");
  };

  const { t } = useTranslation();
  const buttonText = t(
    hasRequested
      ? "taxonomy.metadata.customFields.cancelPublishRequest"
      : "taxonomy.metadata.customFields.requestPublish",
  );
  return (
    <MenuItemButton
      aria-label={taxonomyVersion !== "default" ? t("taxonomy.metadata.customFields.requestVersionError") : buttonText}
      data-testid="requestPublish"
      onClick={togglePublish}
      disabled={taxonomyVersion !== "default" || metadata.customFields.isPublishing === "true"}
      title={taxonomyVersion !== "default" ? t("taxonomy.metadata.customFields.requestVersionError") : undefined}
    >
      <RoundIcon small icon={<CloudUploadOutline />} />
      {buttonText}
    </MenuItemButton>
  );
};

export default RequestNodePublish;
