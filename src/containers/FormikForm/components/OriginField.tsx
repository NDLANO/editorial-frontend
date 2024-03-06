/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { FieldErrorMessage, InputV3, Label } from "@ndla/forms";
import { FormControl, FormField } from "../../../components/FormField";

const OriginField = () => {
  const { t } = useTranslation();
  return (
    <FormField name="origin">
      {({ field, meta }) => (
        <FormControl isDisabled={!!meta.error}>
          <Label textStyle="label-small" margin="small">
            {t("form.origin.label")}
          </Label>
          <InputV3 {...field}></InputV3>
          <FieldErrorMessage>{meta.error}</FieldErrorMessage>
        </FormControl>
      )}
    </FormField>
  );
};

export default OriginField;
