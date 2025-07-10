/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, FormikHelpers, FormikProps } from "formik";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FieldErrorMessage, FieldRoot, PageContent } from "@ndla/primitives";
import { ILearningPathV2DTO } from "@ndla/types-backend/learningpath-api";
import { LearningpathFormValues } from "./learningpathInterfaces";
import { learningpathApiTypeToFormType } from "./learningpathTransformers";
import FormAccordion from "../../components/Accordion/FormAccordion";
import FormAccordions from "../../components/Accordion/FormAccordions";
import { FormField } from "../../components/FormField";
import { Form, FormContent } from "../../components/FormikForm";
import validateFormik, { RulesType } from "../../components/formikValidationSchema";
import FormWrapper from "../../components/FormWrapper";
import HeaderWithLanguage from "../../components/HeaderWithLanguage";
import { IngressField, MetaImageSearch, TitleField } from "../FormikForm";
import { EditorFooterContainer, EditorFooterContent } from "../../components/SlateEditor/EditorFooter";
import SaveMultiButton from "../../components/SaveMultiButton";
import { LearningpathFormHeader } from "./LearningpathFormHeader";

interface Props {
  learningpath?: ILearningPathV2DTO;
  language: string;
}

export const learningpathRules: RulesType<LearningpathFormValues, ILearningPathV2DTO> = {
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

export const LearningpathForm = ({ learningpath, language }: Props) => {
  const { t } = useTranslation();
  const initialValues = learningpathApiTypeToFormType(learningpath, language);
  const initialErrors = useMemo(() => validateFormik(initialValues, learningpathRules, t), [initialValues, t]);

  const validate = useCallback((values: LearningpathFormValues) => validateFormik(values, learningpathRules, t), [t]);

  const handleSubmit = useCallback((values: LearningpathFormValues, helpers: FormikHelpers<LearningpathFormValues>) => {
    console.log("SUB!!!");
  }, []);

  return (
    <Formik
      initialValues={initialValues}
      initialErrors={initialErrors}
      validate={validate}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnMount
    >
      {({ errors, ...formikProps }: FormikProps<LearningpathFormValues>) => (
        <Form>
          <LearningpathFormHeader learningpath={learningpath} language={language} />
          {/* <HeaderWithLanguage */}
          {/*   id={learningpath?.id} */}
          {/*   language={language} */}
          {/*   title={learningpath?.title.title} */}
          {/*   supportedLanguages={supportedLanguages} */}
          {/*   type="learningpath" */}
          {/* /> */}
          <FormAccordions defaultOpen={["content"]}>
            <FormAccordion
              id="content"
              title={t("form.contentSection")}
              hasError={!!(errors.title || errors.description)}
            >
              <PageContent variant="content">
                <FormContent>
                  <TitleField hideToolbar />
                  {/* TODO: i18n */}
                  <IngressField name="description" maxLength={150} placeholder="temp" />
                </FormContent>
              </PageContent>
            </FormAccordion>
            <FormAccordion id="steps" title={"Steps"} hasError={false}>
              <FormContent>Jajaja</FormContent>
            </FormAccordion>
            {/* <FormAccordion id="metadata" title={t("form.metadataSection")} hasError={false}> */}
            {/*   <FormContent> */}
            {/*     <FormField name="metaImageId"> */}
            {/*       {({ field, meta }) => ( */}
            {/*         <FieldRoot> */}
            {/*           <MetaImageSearch */}
            {/*             metaImageId={field.value} */}
            {/*             showRemoveButton={false} */}
            {/*             language={language} */}
            {/*             showCheckbox={false} */}
            {/*             {...field} */}
            {/*           /> */}
            {/*           <FieldErrorMessage>{meta.error}</FieldErrorMessage> */}
            {/*         </FieldRoot> */}
            {/*       )} */}
            {/*     </FormField> */}
            {/*   </FormContent> */}
            {/* </FormAccordion> */}
          </FormAccordions>
          <EditorFooterContainer>
            <EditorFooterContent>
              <SaveMultiButton
                isSaving={formikProps.isSubmitting}
                formIsDirty={formikProps.dirty}
                showSaved={false}
                hasErrors={false}
                onClick={formikProps.submitForm}
              />
            </EditorFooterContent>
          </EditorFooterContainer>
        </Form>
      )}
    </Formik>
  );
};

export const FormFooter = () => {};
