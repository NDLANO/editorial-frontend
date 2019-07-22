import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { withRouter } from 'react-router-dom';
import { HelmetWithTracker } from '@ndla/tracker';
import { useFetchConceptData } from '../FormikForm/formikConceptHooks';
import { toEditConcept } from '../../../src/util/routeHelpers.js';
import ConceptForm from './ConceptForm';
import { LicensesArrayOf } from '../../shapes';

const CreateConcept = props => {
  const { licenses, locale, t, history, ...rest } = props;
  const { createConcept } = useFetchConceptData(undefined, locale);

  const createConceptAndPushRoute = async createdConcept => {
    const savedConcept = await createConcept(createdConcept);
    history.push(toEditConcept(savedConcept.id, createdConcept.language));
  };

  return (
    <Fragment>
      <HelmetWithTracker title={t(`conceptform.title`)} />
      <ConceptForm
        concept={{ language: locale }}
        locale={locale}
        onUpdate={createConceptAndPushRoute}
        licenses={licenses}
        {...rest}
      />
    </Fragment>
  );
};

CreateConcept.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  createMessage: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  licenses: LicensesArrayOf,
};

export default injectT(withRouter(CreateConcept));
