/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { FieldErrorMessage, InputV3, Label } from "@ndla/forms";
import { FormControl, FormField } from "../../../components/FormField";

interface Props {
  label: string;
  name: string;
  value?: string;
}

const FieldWrapper = styled.div`
  width: 50%;
`;

export const TranscriptionField = ({ name, label }: Props) => {
  const { t } = useTranslation();
  return (
    <FormField name={name}>
      {({ field, meta }) => (
        <FieldWrapper>
          <FormControl isInvalid={!!meta.error}>
            <Label textStyle="label-small" margin="none">
              {label}
            </Label>
            <InputV3 {...field} placeholder={t("form.gloss.transcription")} />
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
          </FormControl>
        </FieldWrapper>
      )}
    </FormField>
  );
};
