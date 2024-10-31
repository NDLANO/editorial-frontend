/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldHelperProps, FieldInputProps, Form, Formik } from "formik";
import { CSSProperties, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Item, Indicator } from "@radix-ui/react-radio-group";
import { useQueryClient } from "@tanstack/react-query";
import { ButtonV2 } from "@ndla/button";
import { colors, spacing, fonts, misc } from "@ndla/core";
import { FieldErrorMessage, Fieldset, InputV3, Label, Legend, RadioButtonGroup } from "@ndla/forms";
import { IArticle, IUpdatedArticle } from "@ndla/types-backend/draft-api";
import { Grade, Node } from "@ndla/types-taxonomy";
import { ArticleFormType } from "../../containers/FormikForm/articleFormHooks";
import { useTaxonomyVersion } from "../../containers/StructureVersion/TaxonomyVersionProvider";
import { draftQueryKeys } from "../../modules/draft/draftQueries";
import { usePutNodeMutation } from "../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../modules/nodes/nodeQueries";
import { formatDateForBackend } from "../../util/formatDate";
import handleError from "../../util/handleError";
import { FieldWarning, FormControl, FormField } from "../FormField";
import validateFormik, { RulesType } from "../formikValidationSchema";
import Spinner from "../Spinner";

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

const RightButtonsWrapper = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;
const MutationErrorMessage = styled(FieldErrorMessage)`
  margin-left: auto;
`;

const StyledFieldWarning = styled(FieldWarning)`
  margin-left: auto;
`;

interface Props {
  setOpen: (open: boolean) => void;
  taxonomy: Node[];
  revisionMetaField?: FieldInputProps<ArticleFormType["revisionMeta"]>;
  revisionMetaHelpers?: FieldHelperProps<ArticleFormType["revisionMeta"]>;
  updateNotes?: (art: IUpdatedArticle) => Promise<IArticle>;
  article?: IArticle;
}

interface QualityEvaluationFormValues {
  grade?: number;
  note?: string;
}

const rules: RulesType<QualityEvaluationFormValues> = {
  grade: {
    required: true,
  },
  note: { required: false },
};

const toInitialValues = (initialData: QualityEvaluationFormValues | undefined): QualityEvaluationFormValues => {
  return {
    grade: initialData?.grade,
    note: initialData?.note ?? "",
  };
};

const QualityEvaluationForm = ({
  setOpen,
  taxonomy,
  revisionMetaField,
  revisionMetaHelpers,
  updateNotes,
  article,
}: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const qc = useQueryClient();
  const updateTaxMutation = usePutNodeMutation();

  const [loading, setLoading] = useState({ save: false, delete: false });

  // Since quality evaluation is the same every place the resource is used in taxonomy, we can use the first node
  const node = useMemo(() => taxonomy[0], [taxonomy]);
  const isResource = node.nodeType !== "SUBJECT" && node.nodeType !== "TOPIC";
  const initialValues = useMemo(() => toInitialValues(node.qualityEvaluation), [node.qualityEvaluation]);
  const initialErrors = useMemo(() => validateFormik(initialValues, rules, t), [initialValues, t]);

  const onSubmit = async (values: QualityEvaluationFormValues) => {
    try {
      setLoading({ ...loading, save: true });

      const promises = taxonomy.map((n) =>
        updateTaxMutation.mutateAsync({
          id: n.id,
          qualityEvaluation: { ...values, grade: Number(values.grade) as Grade },
          taxonomyVersion,
        }),
      );
      await Promise.all(promises);

      // Automatically add revision when grade is lowest possible value (5)
      if (
        revisionMetaField &&
        revisionMetaHelpers &&
        !updateTaxMutation.isError &&
        values.grade === 5 &&
        node.qualityEvaluation?.grade !== 5 &&
        isResource
      ) {
        const revisions = revisionMetaField.value ?? [];
        revisionMetaHelpers.setValue(
          revisions.concat({
            revisionDate: formatDateForBackend(new Date()),
            note: values.note || t("qualityEvaluationForm.needsRevision"),
            status: "needs-revision",
          }),
        );
      }

      if (updateNotes && article) {
        await updateNotes({
          revision: article.revision,
          notes: [`Oppdatert kvalitetsvurdering til ${values.grade}.`],
          metaImage: undefined,
          responsibleId: undefined,
        });
        await qc.invalidateQueries({
          queryKey: draftQueryKeys.draft({ id: article.id }),
        });
      }

      await qc.invalidateQueries({
        queryKey: nodeQueryKeys.nodes({
          taxonomyVersion,
        }),
      });
      await qc.invalidateQueries({ queryKey: nodeQueryKeys.childNodes({ taxonomyVersion }) });
      setOpen(false);
    } catch (err) {
      handleError(err);
    }
    setLoading({ ...loading, save: false });
  };

  const onDelete = async () => {
    try {
      setLoading({ ...loading, delete: true });
      const promises = taxonomy.map((n) =>
        updateTaxMutation.mutateAsync({
          id: n.id,
          qualityEvaluation: null,
          taxonomyVersion,
        }),
      );
      await Promise.all(promises);

      await qc.invalidateQueries({
        queryKey: nodeQueryKeys.nodes({
          taxonomyVersion,
        }),
      });
      await qc.invalidateQueries({ queryKey: nodeQueryKeys.childNodes({ taxonomyVersion }) });
      setOpen(false);
    } catch (err) {
      handleError(err);
    }
    setLoading({ ...loading, delete: false });
  };

  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      validate={(values) => validateFormik(values, rules, t)}
      onSubmit={onSubmit}
      onReset={onDelete}
    >
      {({ dirty, isValid, isSubmitting, values }) => (
        <StyledForm>
          <FormField name="grade">
            {({ field, meta, helpers }) => (
              <FormControl isInvalid={!!meta.error} isRequired>
                <RadioButtonGroup
                  orientation="horizontal"
                  value={field.value?.toString()}
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
              {node.qualityEvaluation?.grade && (
                <ButtonV2 variant="outline" colorTheme="danger" type="reset">
                  {loading.delete && <Spinner appearance="small" />}
                  {t("qualityEvaluationForm.delete")}
                </ButtonV2>
              )}
            </div>
            <RightButtonsWrapper>
              <ButtonV2 variant="outline" onClick={() => setOpen(false)}>
                {t("form.abort")}
              </ButtonV2>
              <ButtonV2 disabled={!dirty || !isValid || isSubmitting} type="submit">
                {loading.save && <Spinner appearance="small" />} {t("form.save")}
              </ButtonV2>
            </RightButtonsWrapper>
          </ButtonContainer>
          {updateTaxMutation.isError && <MutationErrorMessage>{t("qualityEvaluationForm.error")}</MutationErrorMessage>}
          {isResource && values.grade === 5 && (
            <StyledFieldWarning>{t("qualityEvaluationForm.warning")}</StyledFieldWarning>
          )}
        </StyledForm>
      )}
    </Formik>
  );
};

export default QualityEvaluationForm;
