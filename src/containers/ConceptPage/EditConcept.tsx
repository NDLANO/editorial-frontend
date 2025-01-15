/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import ConceptForm from "./ConceptForm/ConceptForm";
import { TranslateType, useTranslateToNN } from "../../components/NynorskTranslateProvider";
import { PageSpinner } from "../../components/PageSpinner";
import { LocaleType } from "../../interfaces";
import { useFetchConceptData } from "../FormikForm/formikConceptHooks";
import NotFoundPage from "../NotFoundPage/NotFoundPage";

const translateFields: TranslateType[] = [
  {
    field: "title.title",
    type: "text",
  },
  {
    field: "content.content",
    type: "text",
  },
  {
    field: "content.htmlContent",
    type: "html",
  },
  {
    field: "tags.tags",
    type: "text",
  },
];

interface Props {
  isNewlyCreated?: boolean;
}

const EditConcept = ({ isNewlyCreated }: Props) => {
  const params = useParams<"id" | "selectedLanguage">();
  const conceptId = Number(params.id) || undefined;
  const selectedLanguage = params.selectedLanguage as LocaleType;
  const { t } = useTranslation();
  const { concept, setConcept, conceptArticles, loading, conceptChanged, subjects, updateConcept } =
    useFetchConceptData(conceptId, selectedLanguage!);

  const { shouldTranslate, translate, translating } = useTranslateToNN();

  useEffect(() => {
    (async () => {
      if (concept && !loading && shouldTranslate) {
        await translate(concept, translateFields, setConcept);
      }
    })();
  }, [concept, loading, setConcept, shouldTranslate, translate]);

  if (loading || translating) {
    return <PageSpinner />;
  }

  if (!concept || !conceptId) {
    return <NotFoundPage />;
  }
  const newLanguage = !concept.supportedLanguages.includes(selectedLanguage);

  return (
    <>
      <title>{`${concept.title.title} ${t("htmlTitles.titleTemplate")}`} </title>
      <ConceptForm
        inModal={false}
        concept={concept}
        conceptArticles={conceptArticles}
        conceptChanged={conceptChanged || newLanguage}
        isNewlyCreated={isNewlyCreated}
        upsertProps={{
          onUpdate: (concept) => updateConcept(conceptId, concept),
        }}
        language={selectedLanguage!}
        subjects={subjects}
        supportedLanguages={concept.supportedLanguages}
      />
    </>
  );
};

export default EditConcept;
