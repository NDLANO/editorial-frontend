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
import ConceptForm from './components/ConceptForm';
import { useFetchConceptData } from '../FormikForm/formikConceptHooks';
import { LicensesArrayOf } from '../../shapes';
import { useTranslateConceptForm } from '../FormikForm/translateFormHooks';

import Spinner from '../../components/Spinner';

const EditConcept = ({
  conceptId,
  isNewlyCreated,
  licenses,
  selectedLanguage,
  t,
  ...rest
}) => {
  const {
    concept,
    fetchSearchTags,
    fetchStatusStateMachine,
    loading,
    setConcept,
    subjects,
    updateConcept,
    updateConceptAndStatus,
  } = useFetchConceptData(conceptId, selectedLanguage);

  const { translating, translateConcept } = useTranslateConceptForm(
    concept,
    setConcept,
  );

  if (!concept) {
    return null;
  }
  if (loading && translating) {
    return <Spinner withWrapper />;
  }
  return (
    <>
      <HelmetWithTracker
        title={`${concept.title} ${t('htmlTitles.titleTemplate')}`}
      />
      <ConceptForm
        concept={concept}
        fetchConceptTags={fetchSearchTags}
        fetchStateStatuses={fetchStatusStateMachine}
        isNewlyCreated={isNewlyCreated}
        licenses={licenses}
        onUpdate={updateConcept}
        subjects={subjects}
        translateConcept={translateConcept}
        translating={translating}
        updateConceptAndStatus={updateConceptAndStatus}
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
};

export default injectT(EditConcept);
