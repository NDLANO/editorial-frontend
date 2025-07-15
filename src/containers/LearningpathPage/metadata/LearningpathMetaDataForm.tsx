/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, FormikProps } from "formik";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FieldErrorMessage, FieldInput, FieldLabel, FieldRoot, FieldTextArea } from "@ndla/primitives";
import {
  ILearningPathV2DTO,
  INewLearningPathV2DTO,
  IUpdatedLearningPathV2DTO,
} from "@ndla/types-backend/learningpath-api";
import { LearningpathMetaImageField } from "./LearningpathMetaImageField";
import { FormRemainingCharacters } from "../../../components/Form/FormRemainingCharacters";
import { FormField } from "../../../components/FormField";
import { Form, FormActionsContainer, FormContent } from "../../../components/FormikForm";
import validateFormik, { RulesType } from "../../../components/formikValidationSchema";
import SaveMultiButton from "../../../components/SaveMultiButton";
import {
  usePatchLearningpathMutation,
  usePostLearningpathMutation,
} from "../../../modules/learningpath/learningpathMutations";
import { routes } from "../../../util/routeHelpers";
import { LearningpathFormHeader } from "../components/LearningpathFormHeader";
import { LearningpathFormStepper } from "../components/LearningpathFormStepper";

interface LearningpathMetaDataFormValues {
  title: string;
  description: string;
  coverPhotoUrl?: string;
}

interface Props {
  learningpath?: ILearningPathV2DTO;
  language: string;
}

const learningpathApiTypeToFormType = (
  learningpath: ILearningPathV2DTO | undefined,
): LearningpathMetaDataFormValues => {
  return {
    title: learningpath?.title.title ?? "",
    description: learningpath?.description.description ?? "",
    coverPhotoUrl: learningpath?.coverPhoto?.url,
  };
};

const learningpathFormTypeToNewApiType = (
  values: LearningpathMetaDataFormValues,
  language: string,
): INewLearningPathV2DTO => {
  return {
    language,
    title: values.title,
    description: values.description,
    coverPhotoMetaUrl: values.coverPhotoUrl,
  };
};

const learningpathFormTypeToApiType = (
  learningpath: ILearningPathV2DTO,
  values: LearningpathMetaDataFormValues,
  language: string,
): IUpdatedLearningPathV2DTO => {
  return {
    revision: learningpath.revision,
    language,
    title: values.title,
    description: values.description,
    coverPhotoMetaUrl: values.coverPhotoUrl,
  };
};

const metaDataRules: RulesType<LearningpathMetaDataFormValues, ILearningPathV2DTO> = {
  title: {
    required: true,
    maxLength: 75,
    warnings: {
      languageMatch: true,
    },
  },
  introduction: {
    maxLength: 150,
    warnings: {
      languageMatch: true,
    },
  },
};

export const LearningpathMetaDataForm = ({ learningpath, language }: Props) => {
  const { t } = useTranslation();
  const postLearningpathMutation = usePostLearningpathMutation();
  const patchLearningpathMutation = usePatchLearningpathMutation();
  const initialValues = learningpathApiTypeToFormType(learningpath);
  const initialErrors = useMemo(() => validateFormik(initialValues, metaDataRules, t), [initialValues, t]);
  const navigate = useNavigate();

  const validate = useCallback(
    (values: LearningpathMetaDataFormValues) => validateFormik(values, metaDataRules, t),
    [t],
  );

  const handleSubmit = useCallback(
    async (values: LearningpathMetaDataFormValues) => {
      if (learningpath) {
        const apiValue = learningpathFormTypeToApiType(learningpath, values, language);
        await patchLearningpathMutation.mutateAsync({ id: learningpath.id, learningpath: apiValue });
      } else {
        const apiValue = learningpathFormTypeToNewApiType(values, language);
        const res = await postLearningpathMutation.mutateAsync(apiValue);
        navigate(routes.learningpath.edit(res.id, language, "steps"));
      }
    },
    [language, learningpath, navigate, patchLearningpathMutation, postLearningpathMutation],
  );

  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      validate={validate}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnMount
    >
      {({ errors, ...formikProps }: FormikProps<LearningpathMetaDataFormValues>) => (
        <Form>
          <LearningpathFormHeader learningpath={learningpath} language={language} />
          {!!learningpath?.id && (
            <LearningpathFormStepper id={learningpath.id} language={language} currentStep="metadata" />
          )}
          <FormContent>
            <FormField name="title">
              {({ field, meta }) => (
                <FieldRoot required invalid={!!meta.error}>
                  <FieldLabel>{t("learningpathForm.metadata.titleLabel")}</FieldLabel>
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                  <FieldInput {...field} />
                  <FormRemainingCharacters value={field.value} maxLength={75} />
                </FieldRoot>
              )}
            </FormField>
            <FormField name="description">
              {({ field, meta }) => (
                <FieldRoot required invalid={!!meta.error}>
                  <FieldLabel>{t("learningpathForm.metadata.descriptionLabel")}</FieldLabel>
                  <FieldErrorMessage>{meta.error}</FieldErrorMessage>
                  <FieldTextArea {...field} />
                  <FormRemainingCharacters value={field.value} maxLength={150} />
                </FieldRoot>
              )}
            </FormField>
            <LearningpathMetaImageField language={language} />
          </FormContent>
          <FormActionsContainer>
            <SaveMultiButton
              isSaving={formikProps.isSubmitting}
              formIsDirty={formikProps.dirty}
              // TODO: Update this
              showSaved={false}
              hasErrors={!!Object.keys(errors).length}
              hideSecondaryButton
              onClick={formikProps.submitForm}
            />
          </FormActionsContainer>
        </Form>
      )}
    </Formik>
  );
};
