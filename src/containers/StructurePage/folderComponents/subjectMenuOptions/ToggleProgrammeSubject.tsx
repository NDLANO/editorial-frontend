/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { DeleteForever } from "@ndla/icons/editor";
import { Switch } from "@ndla/switch";
import RoundIcon from "../../../../components/RoundIcon";
import { TAXONOMY_CUSTOM_FIELD_PROGRAMME_SUBJECT } from "../../../../constants";
import CustomFieldButton from "../sharedMenuOptions/components/CustomFieldButton";
import { StyledMenuItemEditField, StyledMenuItemInputField } from "../styles";

interface Props {
  customFields: Record<string, string>;
  updateFields: (newFields: Record<string, string>) => void;
}

const StyledCustomFieldButton = styled(CustomFieldButton)`
  margin-left: ${spacing.xxsmall};
`;

const ToggleProgrammeSubject = ({ customFields, updateFields }: Props) => {
  const { t } = useTranslation();
  const isToggled = customFields[TAXONOMY_CUSTOM_FIELD_PROGRAMME_SUBJECT]?.toLowerCase() === "true";

  return (
    <>
      <StyledMenuItemEditField>
        <RoundIcon open small />
        <StyledMenuItemInputField placeholder={t("taxonomy.metadata.customFields.programmeSubject")} disabled />
        <Switch
          onChange={() =>
            updateFields({
              ...customFields,
              [TAXONOMY_CUSTOM_FIELD_PROGRAMME_SUBJECT]: (!isToggled).toString(),
            })
          }
          checked={isToggled}
          label=""
          id={"programmeSubject"}
        />
        <StyledCustomFieldButton
          onClick={() => {
            delete customFields[TAXONOMY_CUSTOM_FIELD_PROGRAMME_SUBJECT];
            updateFields({ ...customFields });
          }}
        >
          <DeleteForever />
        </StyledCustomFieldButton>
      </StyledMenuItemEditField>
    </>
  );
};

export default ToggleProgrammeSubject;
