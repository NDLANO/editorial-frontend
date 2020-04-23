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

const EditConcept = ({ conceptId, selectedLanguage, t, ...rest }) => {
  const { concept, updateConcept, subjects, tags } = useFetchConceptData(
    conceptId,
    selectedLanguage,
  );

  if (!concept) {
    return null;
  }

  const isNewlyCreated = concept => {
    const conceptDate = Date.parse(concept.created);
    const dateNow = Date.now();

    // accounting for server lag up to 10 seconds
    return dateNow - conceptDate <= 10000;
  };

  return (
    <Fragment>
      <HelmetWithTracker
        title={`${concept.title} ${t('htmlTitles.titleTemplate')}`}
      />
      <ConceptForm
        onUpdate={updateConcept}
        concept={concept}
        subjects={subjects}
        tags={tags}
        isNewlyCreated={isNewlyCreated(concept)}
        {...rest}
      />
    </Fragment>
  );
};

EditConcept.propTypes = {
  conceptId: PropTypes.string,
  selectedLanguage: PropTypes.string.isRequired,
  licenses: LicensesArrayOf.isRequired,
};

export default injectT(EditConcept);
