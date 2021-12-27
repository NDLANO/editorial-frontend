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
import { ConceptPatchType } from '../../modules/concept/conceptApiInterfaces';

interface Props {
  isNewlyCreated?: boolean;
}

const EditConcept = ({ isNewlyCreated }: Props) => {
  const { id: conceptId, selectedLanguage } = useParams<'id' | 'selectedLanguage'>();
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
  } = useFetchConceptData(Number(conceptId), selectedLanguage!);

  const { translating, translateToNN } = useTranslateApi(concept, setConcept, [
    'id',
    'title.title',
    'content.content',
  ]);

  if (loading || translating) {
    return <Spinner withWrapper />;
  }

  if (!concept) {
    return <NotFoundPage />;
  }

  return (
    <>
      <HelmetWithTracker title={`${concept.title.title} ${t('htmlTitles.titleTemplate')}`} />
      <ConceptForm
        inModal={false}
        concept={concept}
        conceptArticles={conceptArticles}
        conceptChanged={conceptChanged}
        fetchConceptTags={fetchSearchTags}
        isNewlyCreated={isNewlyCreated}
        onUpdate={async concept => {
          return updateConcept(concept as ConceptPatchType);
        }}
        language={selectedLanguage!}
        subjects={subjects}
        translateToNN={translateToNN}
        updateConceptAndStatus={updateConceptAndStatus}
      />
    </>
  );
};

export default EditConcept;
