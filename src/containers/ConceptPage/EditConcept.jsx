/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { HelmetWithTracker } from '@ndla/tracker';
import { injectT } from '@ndla/i18n';
import ConceptForm from './components/ConceptForm';
import { useFetchConceptData } from '../FormikForm/formikConceptHooks';
import { LicensesArrayOf } from '../../shapes';
import { useConceptTranslateForm } from '../FormikForm/translateFormHooks';

const EditConcept = ({
  conceptId,
  isNewlyCreated,
  selectedLanguage,
  t,
  ...rest
}) => {
  const {
    concept,
    updateConcept,
    subjects,
    updateConceptAndStatus,
    fetchStatusStateMachine,
    fetchSearchTags,
  } = useFetchConceptData(conceptId, selectedLanguage);

  const { translating, translateConcept } = useConceptTranslateForm(
    concept,
    updateConcept,
  );

  if (!concept) {
    return null;
  }

  return (
    <Fragment>
      <HelmetWithTracker
        title={`${concept.title} ${t('htmlTitles.titleTemplate')}`}
      />
      <ConceptForm
        concept={concept}
        fetchConceptTags={fetchSearchTags}
        fetchStateStatuses={fetchStatusStateMachine}
        isNewlyCreated={isNewlyCreated}
        onUpdate={updateConcept}
        subjects={subjects}
        translateConcept={translateConcept}
        translating={translating}
        updateConceptAndStatus={updateConceptAndStatus}
        {...rest}
      />
    </Fragment>
  );
};

EditConcept.propTypes = {
  conceptId: PropTypes.string,
  selectedLanguage: PropTypes.string.isRequired,
  licenses: LicensesArrayOf.isRequired,
  isNewlyCreated: PropTypes.bool,
};

export default injectT(EditConcept);
