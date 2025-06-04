/**
 * Copyright (c) 2023-present, NDLA.
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
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupLabel,
  RadioGroupRoot,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { GridType } from "@ndla/ui";
import { FormField } from "../../../FormField";
import { FormActionsContainer, FormikForm } from "../../../FormikForm";
import validateFormik, { RulesType } from "../../../formikValidationSchema";

interface GridFormValues {
  columns: GridType["columns"];
  background: GridType["background"];
  border: boolean;
}

const rules: RulesType<GridFormValues> = {
  columns: {
    required: true,
  },
};

const toInitialValues = (initialData?: GridType): GridFormValues => {
  return {
    columns: (initialData?.columns?.toString() ?? "2") as GridType["columns"],
    border: initialData?.border === "lightBlue" ? true : false,
    background: initialData?.background ?? "transparent",
  };
};

interface Props {
  initialData?: GridType;
  onSave: (data: GridType) => void;
  onCancel: () => void;
}

const StyledCheckboxRoot = styled(CheckboxRoot, {
  base: {
    width: "fit-content",
  },
});

const columns: GridType["columns"][] = ["2", "4", "2x2"];

const GridForm = ({ initialData, onSave, onCancel }: Props) => {
  const { t } = useTranslation();
  const initialValues = useMemo(() => toInitialValues(initialData), [initialData]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);

  const onSubmit = useCallback(
    (values: GridFormValues) => {
      const newData: GridType = {
        columns: values.columns,
        border: values.border ? "lightBlue" : "none",
        background: values.background,
      };
      onSave(newData);
    },
    [onSave],
  );

  const columnOptions = useMemo(
    () =>
      columns.map((value) => ({
        title: value.toString(),
        value: value.toString(),
      })),
    [],
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
          <FormField name="columns">
            {({ field, helpers }) => (
              <FieldRoot>
                <RadioGroupRoot
                  value={field.value}
                  orientation="horizontal"
                  onValueChange={(details) => helpers.setValue(details.value, true)}
                >
                  <RadioGroupLabel>{t("form.name.columns")}</RadioGroupLabel>
                  {columnOptions.map((value) => (
                    <RadioGroupItem value={value.value} key={value.value}>
                      <RadioGroupItemControl />
                      <RadioGroupItemText>{value.title}</RadioGroupItemText>
                      <RadioGroupItemHiddenInput />
                    </RadioGroupItem>
                  ))}
                </RadioGroupRoot>
              </FieldRoot>
            )}
          </FormField>
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
              data-testid="grid-form-save-button"
            >
              {t("save")}
            </Button>
          </FormActionsContainer>
        </FormikForm>
      )}
    </Formik>
  );
};

export default GridForm;
