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
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT } from "../../../../constants";

interface Props {
  customFields: Record<string, string>;
  updateFields: (newFields: Record<string, string>) => void;
}

const SwitchWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    alignSelf: "flex-end",
  },
});

const ToggleExplanationSubject = ({ customFields, updateFields }: Props) => {
  const { t } = useTranslation();
  const isToggled = customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT]?.toLowerCase() === "true";

  return (
    <SwitchWrapper>
      <SwitchRoot
        checked={isToggled}
        onCheckedChange={(details) =>
          updateFields({ ...customFields, [TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT]: details.checked.toString() })
        }
      >
        <SwitchLabel>{t("taxonomy.metadata.customFields.explanationSubject")}</SwitchLabel>
        <SwitchControl>
          <SwitchThumb />
        </SwitchControl>
        <SwitchHiddenInput />
      </SwitchRoot>
      <IconButton
        variant="danger"
        size="small"
        onClick={() => {
          delete customFields[TAXONOMY_CUSTOM_FIELD_SUBJECT_FOR_CONCEPT];
          updateFields({ ...customFields });
        }}
      >
        <DeleteBinLine />
      </IconButton>
    </SwitchWrapper>
  );
};

export default ToggleExplanationSubject;
