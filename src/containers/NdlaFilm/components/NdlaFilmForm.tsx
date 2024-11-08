/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Formik, FormikHelpers } from "formik";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import { PageContent } from "@ndla/primitives";
import { IFilmFrontPageData, IMovieTheme } from "@ndla/types-backend/frontpage-api";
import NdlaFilmArticle from "./NdlaFilmArticle";
import SlideshowEditor from "./SlideshowEditor";
import ThemeEditor from "./ThemeEditor";
import FormAccordion from "../../../components/Accordion/FormAccordion";
import FormAccordions from "../../../components/Accordion/FormAccordions";
import Field from "../../../components/Field";
import validateFormik, { RulesType } from "../../../components/formikValidationSchema";
import SimpleLanguageHeader from "../../../components/HeaderWithLanguage/SimpleLanguageHeader";
import SaveButton from "../../../components/SaveButton";
import { isSlateEmbed } from "../../../components/SlateEditor/plugins/embed/utils";
import StyledForm from "../../../components/StyledFormComponents";
import { SAVE_BUTTON_ID } from "../../../constants";
import { useUpdateFilmFrontpageMutation } from "../../../modules/frontpage/filmMutations";
import { isFormikFormDirty } from "../../../util/formHelper";
import { getInitialValues, getNdlaFilmFromSlate } from "../../../util/ndlaFilmHelpers";
import { NdlaErrorPayload } from "../../../util/resolveJsonOrRejectWithError";
import { toEditNdlaFilm } from "../../../util/routeHelpers";
import SubjectpageAbout from "../../EditSubjectFrontpage/components/SubjectpageAbout";
import { AlertDialogWrapper } from "../../FormikForm";
import usePreventWindowUnload from "../../FormikForm/preventWindowUnloadHook";
import { useMessages } from "../../Messages/MessagesProvider";

interface Props {
  filmFrontpage: IFilmFrontPageData;
  selectedLanguage: string;
}

export interface FilmFormikType {
  name: string;
  title: Descendant[];
  description: Descendant[];
  visualElement: Descendant[];
  language: string;
  supportedLanguages: string[];
  slideShow: string[];
  themes: IMovieTheme[];
  article?: string;
}

const ndlaFilmRules: RulesType<FilmFormikType> = {
  title: {
    required: true,
  },
  description: {
    required: true,
    maxLength: 300,
  },
  visualElement: {
    required: true,
    test: (values: FilmFormikType) => {
      const element = values?.visualElement[0];
      const data = isSlateEmbed(element) && element.data;
      const badVisualElementId = data && "resource_id" in data && data.resource_id === "";
      return badVisualElementId ? { translationKey: "subjectpageForm.missingVisualElement" } : undefined;
    },
  },
};

const NdlaFilmForm = ({ filmFrontpage, selectedLanguage }: Props) => {
  const { t } = useTranslation();
  const [savedToServer, setSavedToServer] = useState(false);
  const [unsaved, setUnsaved] = useState(false);
  usePreventWindowUnload(unsaved);

  const updateFilmFrontpage = useUpdateFilmFrontpageMutation();
  const { createMessage, applicationError, formatErrorMessage } = useMessages();

  const initialValues = getInitialValues(filmFrontpage, selectedLanguage);

  const handleSubmit = async (values: FilmFormikType, formikHelpers: FormikHelpers<FilmFormikType>) => {
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
      setSavedToServer(false);
    }
    await formikHelpers.validateForm();
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validate={(values) => validateFormik(values, ndlaFilmRules, t)}
      enableReinitialize
    >
      {(formik) => {
        const { values, dirty, isSubmitting, errors, isValid, submitForm } = formik;
        const formIsDirty: boolean = isFormikFormDirty({
          values,
          initialValues,
          dirty,
        });
        setUnsaved(formIsDirty);
        return (
          <StyledForm>
            <SimpleLanguageHeader
              articleType="subjectpage"
              editUrl={(_, lang) => toEditNdlaFilm(lang)}
              id={20}
              isSubmitting={isSubmitting}
              language={selectedLanguage}
              supportedLanguages={values.supportedLanguages}
              title={values.name}
            />

            <FormAccordions defaultOpen={["slideshow", "themes"]}>
              <FormAccordion
                id="about"
                title={t("subjectpageForm.about")}
                hasError={!!errors.title || !!errors.description || !!errors.visualElement}
              >
                <PageContent variant="content">
                  <SubjectpageAbout selectedLanguage={selectedLanguage} />
                </PageContent>
              </FormAccordion>
              <FormAccordion id="article" title={t("ndlaFilm.editor.moreInfoHeader")} hasError={!!errors.article}>
                <NdlaFilmArticle fieldName="article" />
              </FormAccordion>
              <FormAccordion id="slideshow" title={t("ndlaFilm.editor.slideshowHeader")} hasError={!!errors.slideShow}>
                <SlideshowEditor fieldName="slideShow" />
              </FormAccordion>
              <FormAccordion id="themes" title={t("ndlaFilm.editor.movieGroupHeader")} hasError={!!errors.themes}>
                <ThemeEditor selectedLanguage={selectedLanguage} />
              </FormAccordion>
            </FormAccordions>
            <Field right>
              <SaveButton
                id={SAVE_BUTTON_ID}
                size="large"
                isSaving={isSubmitting}
                showSaved={!formIsDirty && savedToServer}
                formIsDirty={formIsDirty}
                onClick={submitForm}
                disabled={!isValid}
              />
            </Field>
            <AlertDialogWrapper
              isSubmitting={isSubmitting}
              formIsDirty={formIsDirty}
              severity="danger"
              text={t("alertModal.notSaved")}
            />
          </StyledForm>
        );
      }}
    </Formik>
  );
};

export default NdlaFilmForm;
