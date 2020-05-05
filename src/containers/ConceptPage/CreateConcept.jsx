/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { withRouter } from 'react-router-dom';
import { HelmetWithTracker } from '@ndla/tracker';
import { useFetchConceptData } from '../FormikForm/formikConceptHooks';
import { toEditConcept } from '../../util/routeHelpers';
import ConceptForm from './components/ConceptForm';
import { LicensesArrayOf } from '../../shapes';

const CreateConcept = props => {
  const {
    licenses,
    locale,
    t,
    history,
    initialConcept,
    inModal,
    addConceptInModal,
    ...rest
  } = props;
  const { subjects, createConcept, fetchStateStatuses } = useFetchConceptData(
    undefined,
    locale,
  );

  const createConceptAndPushRoute = async createdConcept => {
    const savedConcept = await createConcept(createdConcept);
    if (inModal && addConceptInModal) {
      addConceptInModal(savedConcept);
    } else {
      history.push(toEditConcept(savedConcept.id, createdConcept.language));
    }
  };

  return (
    <Fragment>
      <HelmetWithTracker title={t(`conceptform.title`)} />
      <ConceptForm
        concept={{ ...initialConcept, language: locale }}
        locale={locale}
        onUpdate={createConceptAndPushRoute}
        fetchStateStatuses={fetchStateStatuses}
        licenses={licenses}
        inModal={inModal}
        subjects={subjects}
        {...rest}
      />
    </Fragment>
  );
};

CreateConcept.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  initialConcept: PropTypes.shape({
    title: PropTypes.string,
  }),
  createMessage: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  licenses: LicensesArrayOf,
  inModal: PropTypes.bool,
  addConceptInModal: PropTypes.func,
};

CreateConcept.defaultProps = {
  inModal: false,
};

export default injectT(withRouter(CreateConcept));
