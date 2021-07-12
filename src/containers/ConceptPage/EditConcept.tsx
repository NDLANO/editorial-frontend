/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { HelmetWithTracker } from '@ndla/tracker';
import { injectT, tType } from '@ndla/i18n';
import { useFetchConceptData } from '../FormikForm/formikConceptHooks';
import { useTranslateApi } from '../FormikForm/translateFormHooks';
import Spinner from '../../components/Spinner';
import { License } from '../../interfaces';
import ConceptForm from './ConceptForm';

const EditConcept = ({
  conceptId,
  isNewlyCreated,
  licenses,
  selectedLanguage,
  t,
}: Props & tType) => {
  const {
    concept,
    fetchSearchTags,
    fetchStatusStateMachine,
    loading,
    setConcept,
    conceptChanged,
    subjects,
    updateConcept,
    updateConceptAndStatus,
  } = useFetchConceptData(parseInt(conceptId), selectedLanguage);

  const { translating, translateToNN } = useTranslateApi(concept, setConcept, [
    'id',
    'title',
    'content',
  ]);

  if (!concept) {
    return null;
  }
  if (loading || translating) {
    return <Spinner withWrapper />;
  }
  return (
    <>
      <HelmetWithTracker title={`${concept.title} ${t('htmlTitles.titleTemplate')}`} />
      {/* @ts-ignore */}
      <ConceptForm
        concept={concept}
        conceptChanged={conceptChanged}
        fetchConceptTags={fetchSearchTags}
        fetchStateStatuses={fetchStatusStateMachine}
        isNewlyCreated={isNewlyCreated}
        licenses={licenses}
        onUpdate={updateConcept}
        subjects={subjects}
        translateToNN={translateToNN}
        translating={translating}
        updateConceptAndStatus={updateConceptAndStatus}
        setConcept={setConcept}
      />
    </>
  );
};

interface Props {
  conceptId: string;
  selectedLanguage: string;
  licenses: License[];
  isNewlyCreated: boolean;
}

export default injectT(EditConcept);
