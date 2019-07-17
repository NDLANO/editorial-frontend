import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { HelmetWithTracker } from '@ndla/tracker';
import { injectT } from '@ndla/i18n';
import ConceptForm from './ConceptForm';
import { useFetchConceptData } from '../FormikForm/formikConceptHooks';

const EditConcept = ({ conceptId, selectedLanguage, t, ...rest }) => {
  const { concept, updateConcept } = useFetchConceptData(
    conceptId,
    selectedLanguage,
  );

  if (!concept || !concept.id) {
    return null;
  }

  return (
    <Fragment>
      <HelmetWithTracker
        title={`${concept.title} ${t('htmlTitles.titleTemplate')}`}
      />
      <ConceptForm onUpdate={updateConcept} concept={concept} {...rest} />
    </Fragment>
  );
};

EditConcept.propTypes = {
  conceptId: PropTypes.string.isRequired,
  selectedLanguage: PropTypes.string.isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
};

export default injectT(EditConcept);
