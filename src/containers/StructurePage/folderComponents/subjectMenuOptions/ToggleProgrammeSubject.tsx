/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { DeleteBinLine } from "@ndla/icons/action";
import { IconButton, SwitchControl, SwitchHiddenInput, SwitchLabel, SwitchRoot, SwitchThumb } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import RoundIcon from "../../../../components/RoundIcon";
import { TAXONOMY_CUSTOM_FIELD_PROGRAMME_SUBJECT } from "../../../../constants";
import { StyledMenuItemEditField } from "../styles";

const StyledSwitchRoot = styled(SwitchRoot, {
  base: {
    // TODO: Remove this once we redesign structure options
    marginInlineEnd: "3xsmall",
    flex: "1",
  },
});

const StyledSwitchLabel = styled(SwitchLabel, {
  base: {
    flex: "1",
  },
});

interface Props {
  customFields: Record<string, string>;
  updateFields: (newFields: Record<string, string>) => void;
}

const ToggleProgrammeSubject = ({ customFields, updateFields }: Props) => {
  const { t } = useTranslation();
  const isToggled = customFields[TAXONOMY_CUSTOM_FIELD_PROGRAMME_SUBJECT]?.toLowerCase() === "true";

  return (
    <StyledMenuItemEditField>
      <RoundIcon open small />
      <StyledSwitchRoot
        checked={isToggled}
        onCheckedChange={(details) =>
          updateFields({
            ...customFields,
            [TAXONOMY_CUSTOM_FIELD_PROGRAMME_SUBJECT]: details.checked.toString(),
          })
        }
      >
        <StyledSwitchLabel>{t("taxonomy.metadata.customFields.programmeSubject")}</StyledSwitchLabel>
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        <SwitchHiddenInput />
      </StyledSwitchRoot>
      <IconButton
        variant="secondary"
        size="small"
        onClick={() => {
          delete customFields[TAXONOMY_CUSTOM_FIELD_PROGRAMME_SUBJECT];
          updateFields({ ...customFields });
        }}
      >
        <DeleteBinLine />
      </IconButton>
    </StyledMenuItemEditField>
  );
};

export default ToggleProgrammeSubject;
