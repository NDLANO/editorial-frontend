/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { HelmetWithTracker } from '@ndla/tracker';
import { injectT } from '@ndla/i18n';
import ConceptForm from './ConceptForm';
import { useFetchConceptData } from '../FormikForm/formikConceptHooks';
import { LicensesArrayOf } from '../../shapes';
import { useTranslateApi } from '../FormikForm/translateFormHooks';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import Spinner from '../../components/Spinner';

const EditConcept = ({ conceptId, isNewlyCreated, licenses, selectedLanguage, t, ...rest }) => {
  const {
    concept,
    fetchSearchTags,
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

  if (!concept) {
    return null;
  }

  if (loading || translating) {
    return <Spinner withWrapper />;
  }

  if (!concept.created) {
    return <NotFoundPage />;
  }

  return (
    <>
      <HelmetWithTracker title={`${concept.title} ${t('htmlTitles.titleTemplate')}`} />
      <ConceptForm
        concept={concept}
        conceptChanged={conceptChanged}
        fetchConceptTags={fetchSearchTags}
        fetchStateStatuses={fetchStatusStateMachine}
        isNewlyCreated={isNewlyCreated}
        licenses={licenses}
        onUpdate={updateConcept}
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
  licenses: LicensesArrayOf.isRequired,
  isNewlyCreated: PropTypes.bool,
  createMessage: PropTypes.func.isRequired,
};

export default injectT(EditConcept);
