/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { FieldErrorMessage, Label, TextAreaV3 } from "@ndla/forms";
import { FormControl, FormField } from "../../components/FormField";

interface Props {
  maxLength?: number;
  name?: string;
  type?: string;
}

const StyledFormControl = styled(FormControl)`
  margin-top: ${spacing.mediumlarge};
`;

const SlugField = ({ name = "slug" }: Props) => {
  const { t } = useTranslation();
  return (
    <FormField name={name}>
      {({ field, meta }) => (
        <StyledFormControl isRequired isInvalid={!!meta.error}>
          <Label visuallyHidden>{t("form.slug.label")}</Label>
          <TextAreaV3 {...field} placeholder={t("form.slug.label")} />
          <FieldErrorMessage>{meta.error}</FieldErrorMessage>
        </StyledFormControl>
      )}
    </FormField>
  );
};

export default SlugField;
