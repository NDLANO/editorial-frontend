/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import PropTypes from 'prop-types';
import { HelmetWithTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import ConceptForm from './ConceptForm/ConceptForm';
import { useFetchConceptData } from '../FormikForm/formikConceptHooks';
import { useTranslateApi } from '../FormikForm/translateFormHooks';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import Spinner from '../../components/Spinner';

const EditConcept = ({ conceptId, isNewlyCreated, selectedLanguage, ...rest }) => {
  const { t } = useTranslation();
  const {
    concept,
    fetchSearchTags,
    conceptArticles,
    fetchStatusStateMachine,
    loading,
    setConcept,
    conceptChanged,
    subjects,
    updateConcept,
    updateConceptAndStatus,
  } = useFetchConceptData(conceptId, selectedLanguage);

  const { translating, translateToNN } = useTranslateApi(concept, setConcept, [
    'id',
    'title',
    'content',
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
        concept={concept}
        conceptArticles={conceptArticles}
        conceptChanged={conceptChanged}
        fetchConceptTags={fetchSearchTags}
        fetchStateStatuses={fetchStatusStateMachine}
        isNewlyCreated={isNewlyCreated}
        onUpdate={updateConcept}
        language={selectedLanguage}
        subjects={subjects}
        translateToNN={translateToNN}
        translating={translating}
        updateConceptAndStatus={updateConceptAndStatus}
        setConcept={setConcept}
        {...rest}
      />
    </>
  );
};

EditConcept.propTypes = {
  conceptId: PropTypes.string,
  selectedLanguage: PropTypes.string.isRequired,
  isNewlyCreated: PropTypes.bool,
};

export default EditConcept;
