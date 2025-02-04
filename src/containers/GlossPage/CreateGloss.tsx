/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { IConceptDTO, INewConceptDTO } from "@ndla/types-backend/concept-api";
import { GlossForm } from "./components/GlossForm";
import { toEditGloss } from "../../util/routeHelpers";
import { useFetchConceptData } from "../FormikForm/formikConceptHooks";

interface Props {
  inModal?: boolean;
  addConceptInModal?: (concept: IConceptDTO) => void;
}

const CreateGloss = ({ inModal = false, addConceptInModal }: Props) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { subjects, createConcept, conceptArticles, updateConceptStatus } = useFetchConceptData(
    undefined,
    i18n.language,
  );

  const onCreate = useCallback(
    async (createdConcept: INewConceptDTO) => {
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
      <title>{t(`glossform.title`)}</title>
      <GlossForm
        language={i18n.language}
        upsertProps={{ onCreate, onUpdateStatus: updateConceptStatus }}
        inModal={inModal}
        subjects={subjects}
        conceptArticles={conceptArticles}
        supportedLanguages={[i18n.language]}
      />
    </>
  );
};

export default CreateGloss;
