/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { injectT, tType } from '@ndla/i18n';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { HelmetWithTracker } from '@ndla/tracker';
import { useFetchConceptData } from '../FormikForm/formikConceptHooks';
import { toEditConcept } from '../../util/routeHelpers';
import ConceptForm from './ConceptForm';
import { ConceptType, License } from '../../interfaces';
import { NewConceptType, PatchConceptType } from '../../modules/concept/conceptApiInterfaces';

interface Props extends RouteComponentProps {
  initialConcept: {
    title: string;
  };
  locale: string;
  licenses: License[];
  inModal: boolean;
  addConceptInModal?: (savedConcept: ConceptType) => void;
}

const isNewConceptType = (concept: NewConceptType | PatchConceptType): concept is NewConceptType =>
  (concept as NewConceptType).title !== undefined;

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
  const { subjects, concept, createConcept, fetchSearchTags } = useFetchConceptData(
    undefined,
    locale,
  );

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
      <ConceptForm
        // @ts-ignore
        concept={concept ? concept : { ...initialConcept, language: locale }}
        onUpdate={c => {
          if (isNewConceptType(c)) {
            createConceptAndPushRoute(c);
          }
        }}
        conceptChanged={false}
        isNewlyCreated={false}
        fetchConceptTags={fetchSearchTags}
        licenses={licenses}
        inModal={inModal}
        subjects={subjects}
        {...rest}
      />
    </>
  );
};

CreateConcept.defaultProps = {
  inModal: false,
};

export default injectT(withRouter(CreateConcept));
