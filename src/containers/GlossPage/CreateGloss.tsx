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
import { PageContent } from "@ndla/primitives";
import { IConceptDTO, INewConceptDTO } from "@ndla/types-backend/concept-api";
import { GlossForm } from "./components/GlossForm";
import { NynorskTranslateProvider } from "../../components/NynorskTranslateProvider";
import { toEditGloss } from "../../util/routeHelpers";
import { useFetchConceptData } from "../FormikForm/formikConceptHooks";

interface Props {
  inDialog?: boolean;
  addConceptInDialog?: (concept: IConceptDTO) => void;
}

export const CreateGlossPage = () => {
  return (
    <NynorskTranslateProvider>
      <PageContent>
        <CreateGloss />
      </PageContent>
    </NynorskTranslateProvider>
  );
};

const CreateGloss = ({ inDialog = false, addConceptInDialog }: Props) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { createConcept, updateConceptStatus } = useFetchConceptData(undefined, i18n.language);

  const onCreate = useCallback(
    async (createdConcept: INewConceptDTO) => {
      const savedConcept = await createConcept(createdConcept);
      if (inDialog && addConceptInDialog) {
        addConceptInDialog(savedConcept);
      } else {
        navigate(toEditGloss(savedConcept.id, createdConcept.language), { state: { isNewlyCreated: true } });
      }
      return savedConcept;
    },
    [addConceptInDialog, createConcept, inDialog, navigate],
  );

  return (
    <>
      <title>{t(`glossform.title`)}</title>
      <GlossForm
        language={i18n.language}
        upsertProps={{ onCreate, onUpdateStatus: updateConceptStatus }}
        inDialog={inDialog}
        translatedFieldsToNN={[]}
      />
    </>
  );
};
