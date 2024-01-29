/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldProps, FormikValues } from "formik";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import GrepCodesFieldContent from "./GrepCodesFieldContent";
import FormikField from "../../components/FormikField";

const GrepCodesField = () => {
  const { t } = useTranslation();
  return (
    <>
      <FormikField name="grepCodes" label={t("form.grepCodes.label")}>
        {({ field, form }: FieldProps<string[], FormikValues>) => <GrepCodesFieldContent field={field} form={form} />}
      </FormikField>
    </>
  );
};

export default memo(GrepCodesField);
