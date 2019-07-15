import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { HelmetWithTracker } from '@ndla/tracker';
import { injectT } from '@ndla/i18n';
import ConceptForm from './ConceptForm';
import { toEditConcept } from '../../util/routeHelpers';
import { useFetchConceptData } from '../FormikForm/formikConceptHooks';

const EditConcept = ({ conceptId, selectedLanguage, t, ...rest }) => {
  const { concept, updateConcept } = useFetchConceptData(
    conceptId,
    selectedLanguage,
  );
  console.log(concept);
  if (!concept || !concept.id) {
    return null;
  }

  /* if (concept.articleType !== 'topic-article') {
    return (
      <Redirect
        to={toEditConcept(concept.id, concept.language)}
      />
    );
  }*/
  return (
    <Fragment>
      <Redirect to={toEditConcept(concept.id, concept.language)} />
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
  createMessage: PropTypes.func.isRequired,
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      license: PropTypes.string,
    }),
  ).isRequired,
};

export default injectT(EditConcept);
