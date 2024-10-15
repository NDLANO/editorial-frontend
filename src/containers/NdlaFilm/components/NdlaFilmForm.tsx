/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FastField, FieldProps, Formik, FormikHelpers } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import { PageContent } from "@ndla/primitives";
import { IFilmFrontPageData, IMovieTheme } from "@ndla/types-backend/frontpage-api";
import NdlaFilmArticle from "./NdlaFilmArticle";
import SlideshowEditorField from "./SlideshowEditorField";
import ThemeEditorField from "./ThemeEditorField";
import FormAccordion from "../../../components/Accordion/FormAccordion";
import FormAccordions from "../../../components/Accordion/FormAccordions";
import Field from "../../../components/Field";
import validateFormik, { RulesType } from "../../../components/formikValidationSchema";
import FormWrapper from "../../../components/FormWrapper";
import SimpleLanguageHeader from "../../../components/HeaderWithLanguage/SimpleLanguageHeader";
import SaveButton from "../../../components/SaveButton";
import { isSlateEmbed } from "../../../components/SlateEditor/plugins/embed/utils";
import { SAVE_BUTTON_ID } from "../../../constants";
import { useUpdateFilmFrontpageMutation } from "../../../modules/frontpage/filmMutations";
import { isFormikFormDirty } from "../../../util/formHelper";
import { getInitialValues, getNdlaFilmFromSlate } from "../../../util/ndlaFilmHelpers";
import { NdlaErrorPayload } from "../../../util/resolveJsonOrRejectWithError";
import { toEditNdlaFilm } from "../../../util/routeHelpers";
import SubjectpageAbout from "../../EditSubjectFrontpage/components/SubjectpageAbout";
import { AlertModalWrapper } from "../../FormikForm/index";
import usePreventWindowUnload from "../../FormikForm/preventWindowUnloadHook";
import { useMessages } from "../../Messages/MessagesProvider";

export interface FilmFormValues {
  title: Descendant[];
  description: Descendant[];
  visualElement: Descendant[];
  language: string;
  supportedLanguages: string[];
  slideshow: string[];
  themes: IMovieTheme[];
  article?: string;
}

const ndlaFilmRules: RulesType<FilmFormValues> = {
  title: {
    required: true,
  },
  description: {
    required: true,
    maxLength: 300,
  },
  visualElement: {
    required: true,
    test: (values: FilmFormValues) => {
      const element = values?.visualElement[0];
      const data = isSlateEmbed(element) && element.data;
      const badVisualElementId = data && "resource_id" in data && data.resource_id === "";
      return badVisualElementId ? { translationKey: "subjectpageForm.missingVisualElement" } : undefined;
    },
  },
};

interface Props {
  filmFrontpage: IFilmFrontPageData;
  selectedLanguage: string;
}

const NdlaFilmForm = ({ filmFrontpage, selectedLanguage }: Props) => {
  const { t } = useTranslation();
  const [savedToServer, setSavedToServer] = useState(false);
  const [unsaved, setUnsaved] = useState(false);
  usePreventWindowUnload(unsaved);
  const updateFilmFrontpage = useUpdateFilmFrontpageMutation();
  const { createMessage, applicationError, formatErrorMessage } = useMessages();

  const initialValues = getInitialValues(filmFrontpage, selectedLanguage);

  const handleSubmit = async (values: FilmFormValues, formikHelpers: FormikHelpers<FilmFormValues>) => {
    formikHelpers.setSubmitting(true);
    const newNdlaFilm = getNdlaFilmFromSlate(filmFrontpage, values, selectedLanguage);

    try {
      await updateFilmFrontpage.mutateAsync(newNdlaFilm);

      Object.keys(values).map((fieldName) => formikHelpers.setFieldTouched(fieldName, true, true));

      formikHelpers.resetForm();
      setSavedToServer(true);
    } catch (e) {
      const err = e as NdlaErrorPayload;
      if (err?.status === 409) {
        createMessage({
          message: t("alertModal.needToRefresh"),
          timeToLive: 0,
        });
      } else if (err?.json?.messages) {
        createMessage(formatErrorMessage(err));
      } else {
        applicationError(err);
      }
      formikHelpers.setSubmitting(false);
      setSavedToServer(false);
    }
    await formikHelpers.validateForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validate={(values) => validateFormik(values, ndlaFilmRules, t)}
      enableReinitialize={true}
    >
      {(formikProps) => {
        const formIsDirty: boolean = isFormikFormDirty({
          values: formikProps.values,
          initialValues,
          dirty: formikProps.dirty,
        });
        setUnsaved(formIsDirty);
        return (
          <FormWrapper>
            <SimpleLanguageHeader
              articleType="subjectpage"
              editUrl={(_, lang) => toEditNdlaFilm(lang)}
              id={20}
              isSubmitting={formikProps.isSubmitting}
              language={selectedLanguage}
              supportedLanguages={formikProps.values.supportedLanguages}
              title={filmFrontpage.name}
            />

            <FormAccordions defaultOpen={["slideshow", "themes"]}>
              <FormAccordion
                id="about"
                title={t("subjectpageForm.about")}
                hasError={
                  !!formikProps.errors.title || !!formikProps.errors.description || !!formikProps.errors.visualElement
                }
              >
                <PageContent variant="content">
                  <SubjectpageAbout selectedLanguage={selectedLanguage} />
                </PageContent>
              </FormAccordion>
              <FormAccordion
                id="article"
                title={t("ndlaFilm.editor.moreInfoHeader")}
                hasError={!!formikProps.errors.article}
              >
                <FastField name="article">
                  {({ field, form }: FieldProps<string>) => (
                    <NdlaFilmArticle
                      updateFieldValue={(v: string | null) => form.setFieldValue(field.name, v)}
                      fieldValue={field.value}
                    />
                  )}
                </FastField>
              </FormAccordion>
              <FormAccordion
                id="slideshow"
                title={t("ndlaFilm.editor.slideshowHeader")}
                hasError={!!formikProps.errors.slideshow}
              >
                <SlideshowEditorField />
              </FormAccordion>
              <FormAccordion
                id="themes"
                title={t("ndlaFilm.editor.movieGroupHeader")}
                hasError={!!formikProps.errors.themes}
              >
                <ThemeEditorField selectedLanguage={selectedLanguage} />
              </FormAccordion>
            </FormAccordions>

            <Field right>
              <SaveButton
                id={SAVE_BUTTON_ID}
                size="large"
                isSaving={formikProps.isSubmitting}
                showSaved={!formIsDirty && savedToServer}
                formIsDirty={formIsDirty}
                onClick={formikProps.submitForm}
                disabled={!formikProps.isValid}
              />
            </Field>
            <AlertModalWrapper
              isSubmitting={formikProps.isSubmitting}
              formIsDirty={formIsDirty}
              severity="danger"
              text={t("alertModal.notSaved")}
            />
          </FormWrapper>
        );
      }}
    </Formik>
  );
};

export default NdlaFilmForm;
