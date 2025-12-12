/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik } from "formik";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CheckLine } from "@ndla/icons";
import {
  Button,
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  FieldRoot,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { GridItemProps } from "@ndla/ui";
import { GridCellElement } from "./types";
import { FormField } from "../../../FormField";
import { FormActionsContainer, FormikForm } from "../../../FormikForm";
import validateFormik, { RulesType } from "../../../formikValidationSchema";

interface Props {
  initialData?: GridCellElement["data"];
  onSave: (data: GridCellElement["data"]) => void;
  onCancel: () => void;
}

interface GridCellFormValues {
  border: GridItemProps["border"];
}

const rules: RulesType<GridCellFormValues> = {};

const toInitialValues = (initialData?: GridCellElement["data"]): GridCellFormValues => {
  return {
    border: initialData?.border === "true",
  };
};

const StyledCheckboxRoot = styled(CheckboxRoot, {
  base: {
    width: "fit-content",
  },
});

export const GridCellForm = ({ initialData, onSave, onCancel }: Props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toInitialValues(initialData), [initialData]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);

  const onSubmit = useCallback(
    (values: GridCellFormValues) => {
      const newData: GridCellElement["data"] = {
        border: values.border ? values.border.toString() : undefined,
      };
      onSave(newData);
    },
    [onSave],
  );

  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      onSubmit={onSubmit}
      validateOnMount
      validate={(values) => validateFormik(values, rules, t)}
    >
      {({ dirty, isValid, handleSubmit }) => (
        <FormikForm>
          <FormField name="border">
            {({ field, helpers }) => (
              <FieldRoot>
                <StyledCheckboxRoot
                  checked={field.value}
                  onCheckedChange={(details) => helpers.setValue(details.checked, true)}
                >
                  <CheckboxControl>
                    <CheckboxIndicator asChild>
                      <CheckLine />
                    </CheckboxIndicator>
                  </CheckboxControl>
                  <CheckboxLabel>{t("form.name.border")}</CheckboxLabel>
                  <CheckboxHiddenInput />
                </StyledCheckboxRoot>
              </FieldRoot>
            )}
          </FormField>
          <FormActionsContainer>
            <Button variant="secondary" onClick={onCancel}>
              {t("cancel")}
            </Button>
            <Button
              disabled={!dirty || !isValid}
              type="submit"
              onClick={() => handleSubmit()}
              data-testid="grid-cell-form-save-button"
            >
              {t("save")}
            </Button>
          </FormActionsContainer>
        </FormikForm>
      )}
    </Formik>
  );
};
