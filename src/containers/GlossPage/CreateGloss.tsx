/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { HelmetWithTracker } from '@ndla/tracker';
import { INewConcept } from '@ndla/types-backend/concept-api';
import { toEditGloss } from '../../util/routeHelpers';
import ConceptForm from '../ConceptPage/ConceptForm/ConceptForm';
import { useFetchConceptData } from '../FormikForm/formikConceptHooks';

interface Props {
  inModal?: boolean;
  addConceptInModal?: Function;
}

const CreateGloss = ({ inModal = false, addConceptInModal }: Props) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { subjects, createConcept, fetchSearchTags, conceptArticles } = useFetchConceptData(undefined, i18n.language);

  const onCreate = useCallback(
    async (createdConcept: INewConcept) => {
      const savedConcept = await createConcept(createdConcept);
      if (inModal && addConceptInModal) {
        addConceptInModal(savedConcept);
      } else {
        navigate(toEditGloss(savedConcept.id, createdConcept.language));
      }
      return savedConcept;
    },
    [addConceptInModal, createConcept, inModal, navigate],
  );

  return (
    <>
      <HelmetWithTracker title={t(`glossform.title`)} />
      <ConceptForm
        language={i18n.language}
        upsertProps={{ onCreate }}
        fetchConceptTags={fetchSearchTags}
        inModal={inModal}
        subjects={subjects}
        conceptArticles={conceptArticles}
        supportedLanguages={[i18n.language]}
        conceptType="gloss"
      />
    </>
  );
};

export default CreateGloss;
