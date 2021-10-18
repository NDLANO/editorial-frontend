/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { HelmetWithTracker } from '@ndla/tracker';
import { useFetchConceptData } from '../FormikForm/formikConceptHooks';
import { toEditConcept } from '../../util/routeHelpers';
import { License } from '../../interfaces';
import ConceptForm from './ConceptForm/ConceptForm';
import { ConceptPostType } from '../../modules/concept/conceptApiInterfaces';

interface Props {
  initialConcept?: {
    title?: string;
  };
  locale: string;
  licences: License[];
  inModal?: boolean;
  addConceptInModal?: Function;
  licenses: License[];
}

const CreateConcept = ({
  licenses,
  locale,
  history,
  initialConcept,
  inModal = false,
  addConceptInModal,
  ...rest
}: Props & RouteComponentProps) => {
  const { t } = useTranslation();
  const { subjects, createConcept, fetchSearchTags, conceptArticles } = useFetchConceptData(
    undefined,
    locale,
  );

  const createConceptAndPushRoute = async (createdConcept: ConceptPostType) => {
    const savedConcept = await createConcept(createdConcept);
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
        language={locale}
        onUpdate={concept => createConceptAndPushRoute(concept as ConceptPostType)}
        fetchConceptTags={fetchSearchTags}
        licenses={licenses}
        inModal={inModal}
        subjects={subjects}
        conceptArticles={conceptArticles}
        {...rest}
      />
    </>
  );
};

export default withRouter(CreateConcept);
