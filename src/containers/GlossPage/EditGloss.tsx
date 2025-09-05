/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { PageContent } from "@ndla/primitives";
import { IUpdatedConceptDTO } from "@ndla/types-backend/concept-api";
import { GlossForm } from "./components/GlossForm";
import { NynorskTranslateProvider, TranslateType, useTranslateToNN } from "../../components/NynorskTranslateProvider";
import { PageSpinner } from "../../components/PageSpinner";
import { LocaleType } from "../../interfaces";
import { useFetchConceptData } from "../FormikForm/formikConceptHooks";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

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
    field: "tags.tags",
    type: "text",
  },
];

export const Component = () => <PrivateRoute component={<EditGlossPage />} />;

export const EditGlossPage = () => {
  return (
    <NynorskTranslateProvider>
      <PageContent>
        <EditGloss />
      </PageContent>
    </NynorskTranslateProvider>
  );
};

const EditGloss = () => {
  const params = useParams<"id" | "selectedLanguage">();
  const conceptId = Number(params.id);
  const selectedLanguage = params.selectedLanguage as LocaleType;
  const { t } = useTranslation();
  const { concept, setConcept, loading, conceptChanged, updateConcept } = useFetchConceptData(
    conceptId,
    selectedLanguage!,
  );

  const { shouldTranslate, translate, translating, translatedFields } = useTranslateToNN();

  const onUpdate = useCallback(
    (concept: IUpdatedConceptDTO) => {
      return updateConcept(conceptId, concept);
    },
    [conceptId, updateConcept],
  );

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
      <title>{`${concept.title.title} ${t("htmlTitles.titleTemplate")}`}</title>
      <GlossForm
        inDialog={false}
        concept={concept}
        conceptChanged={conceptChanged || newLanguage}
        upsertProps={{ onUpdate }}
        language={selectedLanguage!}
        translatedFieldsToNN={translatedFields}
      />
    </>
  );
};
