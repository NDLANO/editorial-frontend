/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik } from "formik";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ILearningPathV2DTO } from "@ndla/types-backend/learningpath-api";
import { LearningpathFormHeader } from "./components/LearningpathFormHeader";
import {
  learningpathApiTypeToFormType,
  learningpathFormTypeToApiType,
  learningpathFormTypeToNewApiType,
  LearningpathFormValues,
} from "./learningpathFormUtils";
import FormAccordion from "../../components/Accordion/FormAccordion";
import FormAccordions from "../../components/Accordion/FormAccordions";
import { Form } from "../../components/FormikForm";
import validateFormik, { RulesType } from "../../components/formikValidationSchema";
import {
  usePatchLearningpathMutation,
  usePostLearningpathMutation,
} from "../../modules/learningpath/learningpathMutations";
import { routes } from "../../util/routeHelpers";
import RevisionNotes from "../ArticlePage/components/RevisionNotes";
import { AlertDialogWrapper } from "../FormikForm/AlertDialogWrapper";
import { PreventWindowUnload } from "../FormikForm/PreventWindowUnload";
import { LearningpathMetaFormPart } from "./metadata/LearningpathMetaFormPart";
import { LearningpathStepsFormPart } from "./steps/LearningpathStepsFormPart";
import EditorFooter from "../../components/SlateEditor/EditorFooter";
import { useSession } from "../Session/SessionProvider";

interface Props {
  learningpath: ILearningPathV2DTO | undefined;
  language: string;
}

const metaDataRules: RulesType<LearningpathFormValues, ILearningPathV2DTO> = {
  title: {
    required: true,
    warnings: {
      languageMatch: true,
    },
  },
  introduction: {
    warnings: {
      languageMatch: true,
    },
  },
  revisionMeta: {
    test: (values) => {
      const emptyNote = values.revisionMeta?.find((meta) => meta.note.length === 0);
      if (emptyNote !== undefined) {
        return { translationKey: "validation.noEmptyRevision" };
      }
      return undefined;
    },
  },
  revisionError: {
    test: (values) => {
      const revisionItems = values.revisionMeta.length ?? 0;
      if (!revisionItems) {
        return { translationKey: "validation.missingRevision" };
      }
      const unfinishedRevision = values.revisionMeta.some((rev) => rev.status === "needs-revision");
      if (!unfinishedRevision) {
        return { translationKey: "validation.unfinishedRevision" };
      }
      return undefined;
    },
  },
};

export const LearningpathForm = ({ learningpath, language }: Props) => {
  const [savedToServer, setSavedToServer] = useState(false);
  const { t } = useTranslation();
  const { ndlaId } = useSession();
  const initialValues = learningpathApiTypeToFormType(learningpath, ndlaId);
  const initialErrors = useMemo(() => validateFormik(initialValues, metaDataRules, t), [initialValues, t]);
  const navigate = useNavigate();
  const postLearningpathMutation = usePostLearningpathMutation();
  const patchLearningpathMutation = usePatchLearningpathMutation();

  const validate = useCallback((values: LearningpathFormValues) => validateFormik(values, metaDataRules, t), [t]);

  const handleSubmit = useCallback(
    async (values: LearningpathFormValues) => {
      if (learningpath) {
        const apiValue = learningpathFormTypeToApiType(learningpath, values, language);
        await patchLearningpathMutation.mutateAsync({ id: learningpath.id, learningpath: apiValue });
        setSavedToServer(true);
      } else {
        const apiValue = learningpathFormTypeToNewApiType(values, language);
        const res = await postLearningpathMutation.mutateAsync(apiValue);
        navigate(routes.learningpath.edit(res.id, language));
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
      {({ errors, ...formikProps }) => {
        const formIsDirty =
          formikProps.dirty || !!(learningpath && !learningpath.supportedLanguages.includes(language));
        return (
          <Form>
            <LearningpathFormHeader learningpath={learningpath} language={language} />
            <PreventWindowUnload preventUnload={formIsDirty} />
            <FormAccordions defaultOpen={["learningpath-meta"]}>
              <LearningpathMetaFormPart language={language} />
              {!!learningpath && (
                <FormAccordion id="steps" title={t("learningpathForm.steps.title")} hasError={false}>
                  <LearningpathStepsFormPart learningpath={learningpath} language={language} />
                </FormAccordion>
              )}
              <FormAccordion
                id="revision"
                title={t("form.name.revisions")}
                hasError={!!errors.revisionMeta || !!errors.revisionError}
              >
                <RevisionNotes />
              </FormAccordion>
            </FormAccordions>
            <EditorFooter
              type="learningpath"
              formIsDirty={formIsDirty}
              savedToServer={savedToServer}
              onSaveClick={formikProps.handleSubmit}
              hideSecondaryButton
              hasErrors={!!Object.keys(errors).length}
            />
            <AlertDialogWrapper
              isSubmitting={formikProps.isSubmitting}
              formIsDirty={formIsDirty}
              severity="danger"
              text={t("alertDialog.notSaved")}
            />
          </Form>
        );
      }}
    </Formik>
  );
};
