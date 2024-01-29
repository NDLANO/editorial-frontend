/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, FieldProps } from "formik";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { spacing } from "@ndla/core";
import { CheckboxItem, RadioButtonGroup } from "@ndla/forms";
import { GridType } from "@ndla/ui";
import FormikField from "../../../FormikField";
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
  background: {
    required: true,
  },
};

const toInitialValues = (initialData?: GridType): GridFormValues => {
  return {
    columns: initialData?.columns ?? "2",
    border: initialData?.border === "lightBlue" ? true : false,
    background: initialData?.background ?? "transparent",
  };
};

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

interface Props {
  initialData?: GridType;
  onSave: (data: GridType) => void;
  onCancel: () => void;
}

const StyledFormikField = styled(FormikField)`
  margin: 0px;
`;

const columns: GridType["columns"][] = ["2", "4", "2x2"];
const backgrounds: GridType["background"][] = ["transparent", "white"];

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

  const columnsOptions = useMemo(
    () =>
      columns.map((value) => ({
        title: value.toString(),
        value: value.toString(),
      })),
    [],
  );

  const backgroundOptions = useMemo(
    () =>
      backgrounds.map((value) => ({
        title: t(`gridForm.background.${value}`),
        value: value!,
      })),
    [t],
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
        <>
          <StyledFormikField name="columns">
            {({ field }: FieldProps) => (
              <RadioButtonGroup
                label={t("form.name.columns")}
                selected={field.value.toString()}
                uniqeIds
                options={columnsOptions}
                onChange={(value: string) =>
                  field.onChange({
                    target: {
                      name: field.name,
                      value: value.toString(),
                    },
                  })
                }
              />
            )}
          </StyledFormikField>
          <StyledFormikField name="background">
            {({ field }: FieldProps) => (
              <RadioButtonGroup
                label={t("form.name.background")}
                selected={field.value}
                uniqeIds
                options={backgroundOptions}
                onChange={(value: string) =>
                  field.onChange({
                    target: {
                      name: field.name,
                      value: value,
                    },
                  })
                }
              />
            )}
          </StyledFormikField>
          <StyledFormikField name="border">
            {({ field }: FieldProps) => (
              <CheckboxItem
                label={t("form.name.border")}
                checked={field.value}
                onChange={() =>
                  field.onChange({
                    target: {
                      name: field.name,
                      value: !field.value,
                    },
                  })
                }
              />
            )}
          </StyledFormikField>
          <ButtonContainer>
            <ButtonV2 variant="outline" onClick={onCancel}>
              {t("cancel")}
            </ButtonV2>
            <ButtonV2 variant="solid" disabled={!dirty || !isValid} type="submit" onClick={() => handleSubmit()}>
              {t("save")}
            </ButtonV2>
          </ButtonContainer>
        </>
      )}
    </Formik>
  );
};

export default GridForm;
