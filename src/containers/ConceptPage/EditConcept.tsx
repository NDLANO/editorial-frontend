/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HelmetWithTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ConceptForm from './ConceptForm/ConceptForm';
import { useFetchConceptData } from '../FormikForm/formikConceptHooks';
import { useTranslateApi } from '../FormikForm/translateFormHooks';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import Spinner from '../../components/Spinner';
import { LocaleType } from '../../interfaces';

interface Props {
  isNewlyCreated?: boolean;
}

const EditConcept = ({ isNewlyCreated }: Props) => {
  const params = useParams<'id' | 'selectedLanguage'>();
  const conceptId = Number(params.id) || undefined;
  const selectedLanguage = params.selectedLanguage as LocaleType;
  const { t } = useTranslation();
  const {
    concept,
    fetchSearchTags,
    conceptArticles,
    loading,
    setConcept,
    conceptChanged,
    subjects,
    updateConcept,
    updateConceptAndStatus,
  } = useFetchConceptData(conceptId, selectedLanguage!);

  const { translating, translateToNN } = useTranslateApi(concept, setConcept, [
    'id',
    'title.title',
    'content.content',
  ]);

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
          onUpdate: concept => updateConcept(conceptId, concept),
          updateConceptAndStatus: updateConceptAndStatus,
        }}
        language={selectedLanguage!}
        subjects={subjects}
        translateToNN={translateToNN}
      />
    </>
  );
};

export default EditConcept;
