/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldLabel, FieldErrorMessage, FieldRoot, TextArea } from "@ndla/primitives";
import { useTranslation } from "react-i18next";
import { FormField } from "../../components/FormField";

interface Props {
  maxLength?: number;
  name?: string;
  type?: string;
}

const SlugField = ({ name = "slug" }: Props) => {
  const { t } = useTranslation();
  return (
    <FormField name={name}>
      {({ field, meta }) => (
        <FieldRoot required invalid={!!meta.error}>
          <FieldLabel>{t("form.slug.label")}</FieldLabel>
          <TextArea {...field} placeholder={t("form.slug.label")} />
          <FieldErrorMessage>{meta.error}</FieldErrorMessage>
        </FieldRoot>
      )}
    </FormField>
  );
};

export default SlugField;
