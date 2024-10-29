/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, FormikHelpers } from "formik";
import { useTranslation } from "react-i18next";
import { Button } from "@ndla/primitives";
import { FormActionsContainer, FormContent } from "../../../components/FormikForm";
import FormWrapper from "../../../components/FormWrapper";
import GrepCodesField from "../../FormikForm/GrepCodesField";

interface Props {
  codes: string[];
  onUpdate: (grepCodes: string[]) => Promise<void>;
}

interface Values {
  grepCodes: string[];
}

const GrepCodesForm = ({ codes, onUpdate }: Props) => {
  const { t } = useTranslation();
  const initialValues = { grepCodes: codes };

  const handleSubmit = async (values: Values, helpers: FormikHelpers<Values>) => {
    await onUpdate(values.grepCodes);
    helpers.resetForm({ values: values });
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
      {({ dirty, isValid }) => {
        return (
          <FormWrapper inModal>
            <FormContent>
              <GrepCodesField />
              <FormActionsContainer>
                <Button disabled={!dirty || !isValid} type="submit">
                  {t("save")}
                </Button>
              </FormActionsContainer>
            </FormContent>
          </FormWrapper>
        );
      }}
    </Formik>
  );
};
export default GrepCodesForm;
