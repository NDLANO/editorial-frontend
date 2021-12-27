/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { HelmetWithTracker } from '@ndla/tracker';
import { useFetchConceptData } from '../FormikForm/formikConceptHooks';
import { toEditConcept } from '../../util/routeHelpers';
import ConceptForm from './ConceptForm/ConceptForm';
import { ConceptPostType } from '../../modules/concept/conceptApiInterfaces';

interface Props {
  inModal?: boolean;
  addConceptInModal?: Function;
}

const CreateConcept = ({ inModal = false, addConceptInModal }: Props) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { subjects, createConcept, fetchSearchTags, conceptArticles } = useFetchConceptData(
    undefined,
    i18n.language,
  );

  const createConceptAndPushRoute = async (createdConcept: ConceptPostType) => {
    const savedConcept = await createConcept(createdConcept);
    if (inModal && addConceptInModal) {
      addConceptInModal(savedConcept);
    } else {
      navigate(toEditConcept(savedConcept.id, createdConcept.language));
    }
    return savedConcept;
  };

  return (
    <>
      <HelmetWithTracker title={t(`conceptform.title`)} />
      <ConceptForm
        language={i18n.language}
        onUpdate={concept => createConceptAndPushRoute(concept as ConceptPostType)}
        fetchConceptTags={fetchSearchTags}
        inModal={inModal}
        subjects={subjects}
        conceptArticles={conceptArticles}
      />
    </>
  );
};

export default CreateConcept;
