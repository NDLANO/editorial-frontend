/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { FieldErrorMessage, FieldInput, FieldLabel, FieldRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { FormField } from "../../../components/FormField";

interface Props {
  label: string;
  name: string;
  value?: string;
}

const StyledFieldRoot = styled(FieldRoot, {
  base: {
    width: "50%",
  },
});

export const TranscriptionField = ({ name, label }: Props) => {
  const { t } = useTranslation();
  return (
    <FormField name={name}>
      {({ field, meta }) => (
        <StyledFieldRoot invalid={!!meta.error}>
          <FieldLabel>{label}</FieldLabel>
          <FieldInput {...field} placeholder={t("form.gloss.transcription")} />
          <FieldErrorMessage>{meta.error}</FieldErrorMessage>
        </StyledFieldRoot>
      )}
    </FormField>
  );
};
