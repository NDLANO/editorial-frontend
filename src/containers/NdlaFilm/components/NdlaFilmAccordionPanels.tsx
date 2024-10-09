/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { FieldProps, FormikErrors, FormikHelpers, FormikProps, FormikValues } from "formik";
import { useTranslation } from "react-i18next";
import { PageContent } from "@ndla/primitives";
import NdlaFilmArticle from "./NdlaFilmArticle";
import { FilmFormikType } from "./NdlaFilmForm";
import SlideshowEditor from "./SlideshowEditor";
import ThemeEditor from "./ThemeEditor";
import FormAccordion from "../../../components/Accordion/FormAccordion";
import FormAccordions from "../../../components/Accordion/FormAccordions";
import FormikField from "../../../components/FormikField";
import { Values } from "../../../components/SlateEditor/editorTypes";
import SubjectpageAbout from "../../EditSubjectFrontpage/components/SubjectpageAbout";

interface Props {
  selectedLanguage: string;
}

interface ComponentProps extends Props {
  errors: FormikErrors<Values>;
  formIsDirty: boolean;
  handleSubmit: (formik: FormikProps<FilmFormikType>) => void;
}

const SubjectpageAccordionPanels = ({ errors, selectedLanguage }: ComponentProps) => {
  const { t } = useTranslation();
  const onUpdateMovieList = (
    field: FieldProps<FormikValues>["field"],
    form: FormikHelpers<FormikValues>,
    movieList: string[],
  ) => {
    form.setFieldTouched(field.name, true, false);
    field.onChange({
      target: {
        name: field.name,
        value: movieList || [],
      },
    });
  };
  const onUpdateArticle = (
    field: FieldProps<FormikValues>["field"],
    form: FormikHelpers<FormikValues>,
    article?: string,
  ) => {
    form.setFieldTouched(field.name, true, false);
    field.onChange({
      target: {
        name: field.name,
        value: article,
      },
    });
  };

  return (
    <FormAccordions defaultOpen={["slideshow", "themes"]}>
      <FormAccordion
        id="about"
        title={t("subjectpageForm.about")}
        hasError={["title", "description", "visualElement"].some((field) => field in errors)}
      >
        <PageContent variant="content">
          <SubjectpageAbout selectedLanguage={selectedLanguage} />
        </PageContent>
      </FormAccordion>
      <FormAccordion id="article" title={t("ndlaFilm.editor.moreInfoHeader")} hasError={false}>
        <NdlaFilmArticle fieldName={"article"} onUpdateArticle={onUpdateArticle} />
      </FormAccordion>
      <FormAccordion
        id="slideshow"
        title={t("ndlaFilm.editor.slideshowHeader")}
        hasError={["metaDescription", "mobileBannerId"].some((field) => field in errors)}
      >
        <FormikField name={"slideShow"}>
          {() => <SlideshowEditor onUpdateSlideshow={onUpdateMovieList} fieldName={"slideShow"} />}
        </FormikField>
      </FormAccordion>
      <FormAccordion
        id="themes"
        title={t("ndlaFilm.editor.movieGroupHeader")}
        hasError={["editorsChoices"].some((field) => field in errors)}
      >
        <FormikField name={"themes"}>
          {() => <ThemeEditor onUpdateMovieTheme={onUpdateMovieList} selectedLanguage={selectedLanguage} />}
        </FormikField>
      </FormAccordion>
    </FormAccordions>
  );
};

export default SubjectpageAccordionPanels;
