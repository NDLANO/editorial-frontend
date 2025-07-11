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
import { Descendant } from "slate";
import {
  ILearningPathV2DTO,
  INewLearningPathV2DTO,
  IUpdatedLearningPathV2DTO,
} from "@ndla/types-backend/learningpath-api";
import { Form, FormActionsContainer, FormContent } from "../../../components/FormikForm";
import validateFormik, { RulesType } from "../../../components/formikValidationSchema";
import SaveMultiButton from "../../../components/SaveMultiButton";
import {
  usePatchLearningpathMutation,
  usePostLearningpathMutation,
} from "../../../modules/learningpath/learningpathMutations";
import { editorValueToPlainText, plainTextToEditorValue } from "../../../util/articleContentConverter";
import { IngressField, TitleField } from "../../FormikForm";
import { LearningpathFormHeader } from "../components/LearningpathFormHeader";
import { LearningpathFormStepper } from "../components/LearningpathFormStepper";

interface LearningpathMetaDataFormValues {
  title: Descendant[];
  description: Descendant[];
}

interface Props {
  learningpath?: ILearningPathV2DTO;
  language: string;
}

const learningpathApiTypeToFormType = (
  learningpath: ILearningPathV2DTO | undefined,
): LearningpathMetaDataFormValues => {
  return {
    title: plainTextToEditorValue(learningpath?.title.title ?? ""),
    description: plainTextToEditorValue(learningpath?.description.description ?? ""),
  };
};

const learningpathFormTypeToNewApiType = (
  values: LearningpathMetaDataFormValues,
  language: string,
): INewLearningPathV2DTO => {
  return {
    language,
    title: editorValueToPlainText(values.title),
    description: editorValueToPlainText(values.description),
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
    title: editorValueToPlainText(values.title),
    description: editorValueToPlainText(values.description),
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
        await postLearningpathMutation.mutateAsync(apiValue);
      }
    },
    [language, learningpath, patchLearningpathMutation, postLearningpathMutation],
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
            <TitleField hideToolbar />
            <IngressField name="description" maxLength={150} placeholder="temp" />
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
