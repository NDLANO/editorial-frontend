/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC } from 'react';
import { HelmetWithTracker } from '@ndla/tracker';
import { injectT, tType } from '@ndla/i18n';
import ConceptForm from './components/ConceptForm';
import { useFetchConceptData } from '../FormikForm/formikConceptHooks';
import { License } from '../../interfaces';
import { useTranslateConceptForm } from '../FormikForm/translateFormHooks';
import Spinner from '../../components/Spinner';

interface Props {
  conceptId?: string;
  createMessage: Function;
  inModal: Boolean;
  isNewlyCreated: Boolean;
  licenses: License[];
  onClose?: Function;
  selectedLanguage: string;
}

const EditConcept: FC<Props & tType> = ({
  conceptId,
  createMessage,
  inModal,
  isNewlyCreated,
  licenses,
  onClose,
  selectedLanguage,
  t,
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
  if (loading) {
    return <Spinner withWrapper />;
  }
  return (
    <>
      <HelmetWithTracker
        title={`${concept.title} ${t('htmlTitles.titleTemplate')}`}
      />
      <ConceptForm
        concept={concept}
        createMessage={createMessage}
        fetchConceptTags={fetchSearchTags}
        fetchStateStatuses={fetchStatusStateMachine}
        inModal={inModal}
        isNewlyCreated={isNewlyCreated}
        licenses={licenses}
        onClose={onClose}
        onUpdate={updateConcept}
        subjects={subjects}
        translateConcept={translateConcept}
        translating={translating}
        updateConceptAndStatus={updateConceptAndStatus}
      />
    </>
  );
};

export default injectT(EditConcept);
