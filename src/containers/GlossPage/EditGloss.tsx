/*
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HelmetWithTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ConceptForm from '../ConceptPage/ConceptForm/ConceptForm';
import { useFetchConceptData } from '../FormikForm/formikConceptHooks';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import Spinner from '../../components/Spinner';
import { LocaleType } from '../../interfaces';
import { TranslateType, useTranslateToNN } from '../../components/NynorskTranslateProvider';

const translateFields: TranslateType[] = [
  {
    field: 'title.title',
    type: 'text',
  },
  {
    field: 'content.content',
    type: 'text',
  },
  {
    field: 'tags.tags',
    type: 'text',
  },
];

interface Props {
  isNewlyCreated?: boolean;
}

const EditGloss = ({ isNewlyCreated }: Props) => {
  const params = useParams<'id' | 'selectedLanguage'>();
  const conceptId = Number(params.id) || undefined;
  const selectedLanguage = params.selectedLanguage as LocaleType;
  const { t } = useTranslation();
  const {
    concept,
    setConcept,
    fetchSearchTags,
    conceptArticles,
    loading,
    conceptChanged,
    subjects,
    updateConcept,
  } = useFetchConceptData(conceptId, selectedLanguage!);

  const { shouldTranslate, translate, translating } = useTranslateToNN();

  useEffect(() => {
    (async () => {
      if (concept && !loading && shouldTranslate) {
        await translate(concept, translateFields, setConcept);
      }
    })();
  }, [concept, loading, setConcept, shouldTranslate, translate]);

  if (loading || translating) {
    return <Spinner withWrapper />;
  }

  if (!concept || !conceptId) {
    return <NotFoundPage />;
  }
  const newLanguage = !concept.supportedLanguages.includes(selectedLanguage);

  return (
    <>
      <HelmetWithTracker title={`${concept.title.title} ${t('htmlTitles.titleTemplate')}`} />
      <ConceptForm
        inModal={false}
        concept={concept}
        conceptArticles={conceptArticles}
        conceptChanged={conceptChanged || newLanguage}
        fetchConceptTags={fetchSearchTags}
        isNewlyCreated={isNewlyCreated}
        upsertProps={{
          onUpdate: (concept) => updateConcept(conceptId, concept),
        }}
        language={selectedLanguage!}
        subjects={subjects}
        supportedLanguages={concept.supportedLanguages}
        conceptType="gloss"
      />
    </>
  );
};

export default EditGloss;