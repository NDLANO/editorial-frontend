/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import { injectT, tType } from '@ndla/i18n';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { HelmetWithTracker } from '@ndla/tracker';
import { useFetchConceptData } from '../FormikForm/formikConceptHooks';
import { toEditConcept } from '../../util/routeHelpers';
import ConceptForm from './ConceptForm';
import { ConceptType, License } from '../../interfaces';
import { NewConceptType } from '../../modules/concept/conceptApiInterfaces';

interface Props extends RouteComponentProps {
  initialConcept: {
    title: string;
  };
  locale: string;
  licenses: License[];
  inModal: boolean;
  addConceptInModal?: (savedConcept: ConceptType) => void;
}

const CreateConcept = ({
  licenses,
  locale,
  t,
  history,
  initialConcept,
  inModal,
  addConceptInModal,
  ...rest
}: Props & tType) => {
  const {
    subjects,
    concept,
    createConcept,
    fetchStatusStateMachine,
    fetchSearchTags,
    setConcept,
  } = useFetchConceptData(undefined, locale);

  const createConceptAndPushRoute = async (createdConcept: NewConceptType): Promise<void> => {
    const savedConcept: ConceptType = await createConcept(createdConcept);
    if (inModal && addConceptInModal) {
      addConceptInModal(savedConcept);
    } else {
      history.push(toEditConcept(savedConcept.id, createdConcept.language));
    }
  };

  return (
    <>
      <HelmetWithTracker title={t(`conceptform.title`)} />
      {/* @ts-ignore */}
      <ConceptForm
        concept={concept ? concept : { ...initialConcept, language: locale }}
        locale={locale}
        onUpdate={createConceptAndPushRoute}
        fetchStateStatuses={fetchStatusStateMachine}
        fetchConceptTags={fetchSearchTags}
        licenses={licenses}
        inModal={inModal}
        subjects={subjects}
        setConcept={setConcept}
        {...rest}
      />
    </>
  );
};

CreateConcept.defaultProps = {
  inModal: false,
};

export default injectT(withRouter(CreateConcept));
