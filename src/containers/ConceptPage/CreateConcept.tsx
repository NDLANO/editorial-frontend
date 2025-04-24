/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { IConceptDTO, INewConceptDTO } from "@ndla/types-backend/concept-api";
import ConceptForm from "./ConceptForm/ConceptForm";
import { toEditConcept } from "../../util/routeHelpers";
import { useFetchConceptData } from "../FormikForm/formikConceptHooks";

interface Props {
  inDialog?: boolean;
  addConceptInDialog?: (concept: IConceptDTO) => void;
}

const CreateConcept = ({ inDialog = false, addConceptInDialog }: Props) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { createConcept, updateConceptStatus } = useFetchConceptData(undefined, i18n.language);

  const onCreate = useCallback(
    async (createdConcept: INewConceptDTO) => {
      const savedConcept = await createConcept(createdConcept);
      if (inDialog && addConceptInDialog) {
        addConceptInDialog(savedConcept);
      } else {
        navigate(toEditConcept(savedConcept.id, createdConcept.language));
      }
      return savedConcept;
    },
    [addConceptInDialog, createConcept, inDialog, navigate],
  );

  return (
    <>
      <title>{t(`conceptForm.title`)}</title>
      <ConceptForm
        language={i18n.language}
        upsertProps={{ onCreate, onUpdateStatus: updateConceptStatus }}
        inDialog={inDialog}
        supportedLanguages={[i18n.language]}
        translatedFieldsToNN={[]}
      />
    </>
  );
};

export default CreateConcept;
