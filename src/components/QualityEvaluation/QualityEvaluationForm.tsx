/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FieldHelperProps, FieldInputProps, Formik } from "formik";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import {
  Button,
  FieldErrorMessage,
  FieldHelper,
  FieldInput,
  FieldLabel,
  FieldRoot,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupLabel,
  RadioGroupRoot,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IArticle, IUpdatedArticle } from "@ndla/types-backend/draft-api";
import { Grade, Node } from "@ndla/types-taxonomy";
import { ArticleFormType } from "../../containers/FormikForm/articleFormHooks";
import { useTaxonomyVersion } from "../../containers/StructureVersion/TaxonomyVersionProvider";
import { draftQueryKeys } from "../../modules/draft/draftQueries";
import { usePutNodeMutation } from "../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../modules/nodes/nodeQueries";
import { formatDateForBackend } from "../../util/formatDate";
import handleError from "../../util/handleError";
import { FormField } from "../FormField";
import { FormActionsContainer, FormikForm } from "../FormikForm";
import validateFormik, { RulesType } from "../formikValidationSchema";

export type QualityEvaluationValue = "1" | "2" | "3" | "4" | "5";

// TODO: We should change these colors
const qualityEvaluationOptions: Record<QualityEvaluationValue, string> = {
  "1": "#5cbc80",
  "2": "#90C670",
  "3": "#C3D060",
  "4": "#ead854",
  "5": "#d1372e",
};

const ButtonContainer = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
  },
});

const StyledRadioGroupRoot = styled(RadioGroupRoot, {
  base: {
    _horizontal: {
      flexDirection: "column",
    },
  },
});

const StyledRadioGroupItem = styled(RadioGroupItem, {
  base: {
    padding: "xxsmall",
    borderRadius: "xsmall",
    outlineOffset: "-5xsmall",
    "&:has(input:focus-visible)": {
      outlineOffset: "0",
    },
  },
  variants: {
    quality: {
      "1": {
        borderRadius: "xsmall",
        outline: "2px solid",
        outlineOffset: "-5xsmall",
        outlineColor: qualityEvaluationOptions["1"],
        "&:has(input:focus-visible)": {
          outlineColor: qualityEvaluationOptions["1"],
          outlineOffset: "-5xsmall",
          boxShadow: "0 0 0 2px var(--shadow-color)",
          boxShadowColor: "stroke.default",
        },
      },
      "2": {
        background: qualityEvaluationOptions["2"],
      },
      "3": {
        background: qualityEvaluationOptions["3"],
      },
      "4": {
        background: qualityEvaluationOptions["4"],
      },
      "5": {
        borderRadius: "xsmall",
        outline: "2px solid",
        outlineOffset: "-5xsmall",
        outlineColor: qualityEvaluationOptions["5"],
        "&:has(input:focus-visible)": {
          outlineColor: qualityEvaluationOptions["5"],
          outlineOffset: "-5xsmall",
          boxShadow: "0 0 0 2px var(--shadow-color)",
          boxShadowColor: "stroke.default",
        },
      },
    },
  },
});

const ItemsWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    flexWrap: "wrap",
  },
});

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
      {({ dirty, isValid, isSubmitting }) => (
        <FormikForm>
          <FormField name="grade">
            {({ field, meta, helpers }) => (
              <FieldRoot invalid={!!meta.error} required>
                <StyledRadioGroupRoot
                  orientation="horizontal"
                  value={field.value?.toString()}
                  onValueChange={(details) => helpers.setValue(Number(details.value))}
                >
                  <RadioGroupLabel>{t("qualityEvaluationForm.title")}</RadioGroupLabel>
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                  {field.value === 5 && <FieldHelper>{t("qualityEvaluationForm.warning")}</FieldHelper>}
                  <ItemsWrapper>
                    {Object.entries(qualityEvaluationOptions).map(([value, _]) => (
                      <StyledRadioGroupItem key={value} value={value} quality={value as QualityEvaluationValue}>
                        <RadioGroupItemControl />
                        <RadioGroupItemText>{value}</RadioGroupItemText>
                        <RadioGroupItemHiddenInput />
                      </StyledRadioGroupItem>
                    ))}
                  </ItemsWrapper>
                </StyledRadioGroupRoot>
              </FieldRoot>
            )}
          </FormField>
          <FormField name="note">
            {({ field }) => (
              <FieldRoot>
                <FieldLabel>{t("qualityEvaluationForm.note")}</FieldLabel>
                <FieldInput {...field} />
              </FieldRoot>
            )}
          </FormField>
          <ButtonContainer>
            {node.qualityEvaluation?.grade && (
              <Button variant="danger" type="reset" loading={loading.delete}>
                {t("qualityEvaluationForm.delete")}
              </Button>
            )}
            <FormActionsContainer>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                {t("form.abort")}
              </Button>
              <Button disabled={!dirty || !isValid || isSubmitting} loading={loading.save} type="submit">
                {t("form.save")}
              </Button>
            </FormActionsContainer>
          </ButtonContainer>
          {updateTaxMutation.isError && <Text color="text.error">{t("qualityEvaluationForm.error")}</Text>}
        </FormikForm>
      )}
    </Formik>
  );
};

export default QualityEvaluationForm;
