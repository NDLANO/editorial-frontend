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
import SaveButton from "../../../components/SaveButton";
import GrepCodesField from "../../FormikForm/GrepCodesField";

interface Props {
  codes: string[];
  onUpdate: (grepCodes: string[]) => Promise<void>;
  close: () => void;
}

interface Values {
  grepCodes: string[];
}

const GrepCodesForm = ({ codes, onUpdate, close }: Props) => {
  const { t } = useTranslation();
  const initialValues = { grepCodes: codes };

  const handleSubmit = async (values: Values, helpers: FormikHelpers<Values>) => {
    await onUpdate(values.grepCodes);
    helpers.resetForm({ values: values });
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
      {({ dirty, isValid, submitForm }) => {
        return (
          <FormWrapper inModal>
            <FormContent>
              <GrepCodesField />
              <FormActionsContainer>
                <Button variant="secondary" onClick={close}>
                  {t("cancel")}
                </Button>
                <Button disabled={!dirty || !isValid} onClick={submitForm}>
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
