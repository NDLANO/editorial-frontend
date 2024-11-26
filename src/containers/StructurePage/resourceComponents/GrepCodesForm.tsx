/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, FormikHelpers } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { FormActionsContainer, FormContent } from "../../../components/FormikForm";
import FormWrapper from "../../../components/FormWrapper";
import handleError from "../../../util/handleError";
import GrepCodesField from "../../FormikForm/GrepCodesField";

const StyledText = styled(Text, {
  base: {
    justifySelf: "flex-end",
  },
});

interface Props {
  codes: string[];
  onUpdate: (grepCodes: string[]) => Promise<void>;
  close?: () => void;
}

interface Values {
  grepCodes: string[];
}

const GrepCodesForm = ({ codes, onUpdate, close }: Props) => {
  const { t } = useTranslation();
  const initialValues = { grepCodes: codes };
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: Values, helpers: FormikHelpers<Values>) => {
    try {
      setLoading(true);
      setError(false);
      await onUpdate(values.grepCodes);
      helpers.resetForm({ values: values });
      setLoading(false);
      close?.();
    } catch (err) {
      setError(true);
      setLoading(false);
      handleError(err);
    }
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
      {({ dirty, submitForm }) => {
        return (
          <FormWrapper inModal>
            <FormContent>
              <GrepCodesField />
              <FormActionsContainer>
                {close && (
                  <Button variant="secondary" onClick={close}>
                    {t("cancel")}
                  </Button>
                )}
                <Button disabled={!dirty} loading={loading} onClick={submitForm}>
                  {t("save")}
                </Button>
              </FormActionsContainer>
            </FormContent>
            {error && (
              <StyledText color="text.error" aria-live="polite">
                {t("errorMessage.genericError")}
              </StyledText>
            )}
          </FormWrapper>
        );
      }}
    </Formik>
  );
};
export default GrepCodesForm;
