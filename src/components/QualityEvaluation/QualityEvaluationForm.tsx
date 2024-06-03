/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Form, Formik, useField } from "formik";
import { CSSProperties, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Item, Indicator } from "@radix-ui/react-radio-group";
import { ButtonV2 } from "@ndla/button";
import { colors, spacing, fonts, misc } from "@ndla/core";
import { FieldErrorMessage, Fieldset, InputV3, Label, Legend, RadioButtonGroup } from "@ndla/forms";
import { RevisionMetaFormType } from "../../containers/FormikForm/AddRevisionDateField";
import { formatDateForBackend } from "../../util/formatDate";
import { FormControl, FormField } from "../FormField";
import validateFormik, { RulesType } from "../formikValidationSchema";

export const qualityEvaluationOptions: { [key: number]: string } = {
  1: colors.support.green,
  2: "#90C670",
  3: "#C3D060",
  4: colors.support.yellow,
  5: colors.support.red,
};

const StyledFieldset = styled(Fieldset)`
  display: flex;
  gap: ${spacing.xsmall};
  align-items: center;
`;

// Color needed in order for wcag contrast reqirements to be met
export const blackContrastColor = "#000";

export const gradeItemStyles = css`
  padding: 0px ${spacing.nsmall};
  font-weight: ${fonts.weight.semibold};
  border-radius: ${misc.borderRadius};
  color: ${blackContrastColor};
  ${fonts.size.text.content};
  &[data-border="false"] {
    background-color: var(--item-color);
  }
  &[data-border="true"] {
    box-shadow: inset 0px 0px 0px 2px var(--item-color);
  }
`;

const StyledItem = styled(Item)`
  all: unset;
  ${gradeItemStyles};

  &:hover {
    cursor: pointer;
    border-radius: ${misc.borderRadius};
    outline: 2px solid ${colors.brand.primary};
  }
  &[data-state="checked"] {
    outline: 2px solid ${blackContrastColor};
  }
`;

const ButtonContainer = styled.div`
  margin-top: ${spacing.small};
  display: flex;
  justify-content: space-between;
`;

const RightButtonswrapper = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

interface Props {
  setOpen: (open: boolean) => void;
}

export interface QualityEvaluationFormValues {
  grade?: number;
  note?: string;
}

const rules: RulesType<QualityEvaluationFormValues> = {
  grade: {
    required: true,
  },
  note: { required: false },
};

const toInitialValues = (initialData: QualityEvaluationFormValues | null): QualityEvaluationFormValues => {
  return {
    grade: initialData?.grade,
    note: initialData?.note ?? "",
  };
};

const QualityEvaluationForm = ({ setOpen }: Props) => {
  const { t } = useTranslation();
  const [qualityEvaluationField, , helpers] = useField<QualityEvaluationFormValues | null>("qualityEvaluation");
  const [revisionMetaField, , revisionMetaHelpers] = useField<RevisionMetaFormType>("revisionMeta");

  const initialValues = useMemo(() => toInitialValues(qualityEvaluationField.value), [qualityEvaluationField.value]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);

  const onSubmit = (values: QualityEvaluationFormValues) => {
    // Automatically add revision when grade is lowest possible value (5)
    if (values.grade === 5 && qualityEvaluationField.value?.grade !== 5) {
      const revisions = revisionMetaField.value ?? [];
      revisionMetaHelpers.setValue(
        revisions.concat({
          revisionDate: formatDateForBackend(new Date()),
          note: values.note || t("qualityEvaluationForm.needsRevision"),
          status: "needs-revision",
        }),
      );
    }
    helpers.setValue(values);
    setOpen(false);
  };

  const onDelete = () => {
    helpers.setValue(null);
    setOpen(false);
  };
  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      validate={(values) => validateFormik(values, rules, t)}
      onSubmit={onSubmit}
      onReset={onDelete}
    >
      {({ dirty, isValid }) => (
        <StyledForm>
          <FormField name="grade">
            {({ field, meta, helpers }) => (
              <FormControl isInvalid={!!meta.error} isRequired>
                <RadioButtonGroup
                  orientation="horizontal"
                  defaultValue={field.value?.toString()}
                  onValueChange={(v) => helpers.setValue(Number(v))}
                  asChild
                >
                  <StyledFieldset>
                    <Legend margin="none" textStyle="label-small">
                      {t("qualityEvaluationForm.title")}
                    </Legend>
                    {Object.entries(qualityEvaluationOptions).map(([value, color]) => (
                      <div key={value}>
                        <StyledItem
                          id={`quality-${value}`}
                          value={value.toString()}
                          data-color-value={value}
                          style={{ "--item-color": color } as CSSProperties}
                          data-border={value === "1" || value === "5"}
                        >
                          <Indicator forceMount>{value}</Indicator>
                        </StyledItem>
                        <Label htmlFor={`quality-${value}`} visuallyHidden>
                          {value}
                        </Label>
                      </div>
                    ))}
                  </StyledFieldset>
                </RadioButtonGroup>
                <FieldErrorMessage>{meta.error}</FieldErrorMessage>
              </FormControl>
            )}
          </FormField>
          <FormField name="note">
            {({ field }) => (
              <FormControl>
                <Label margin="none" textStyle="label-small">
                  {t("qualityEvaluationForm.note")}
                </Label>
                <InputV3 {...field} />
              </FormControl>
            )}
          </FormField>
          <ButtonContainer>
            <div>
              {qualityEvaluationField.value?.grade && (
                <ButtonV2 variant="outline" colorTheme="danger" type="reset">
                  {t("qualityEvaluationForm.delete")}
                </ButtonV2>
              )}
            </div>
            <RightButtonswrapper>
              <ButtonV2 variant="outline" onClick={() => setOpen(false)}>
                {t("form.abort")}
              </ButtonV2>
              <ButtonV2 disabled={!dirty || !isValid} type="submit">
                {t("qualityEvaluationForm.add")}
              </ButtonV2>
            </RightButtonswrapper>
          </ButtonContainer>
        </StyledForm>
      )}
    </Formik>
  );
};

export default QualityEvaluationForm;
