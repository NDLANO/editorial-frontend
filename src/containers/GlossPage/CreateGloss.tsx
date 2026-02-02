/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PageContent } from "@ndla/primitives";
import { ConceptDTO, NewConceptDTO } from "@ndla/types-backend/concept-api";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { NynorskTranslateProvider } from "../../components/NynorskTranslateProvider";
import { toEditGloss } from "../../util/routeHelpers";
import { useFetchConceptData } from "../FormikForm/formikConceptHooks";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import { GlossForm } from "./components/GlossForm";

interface Props {
  inDialog?: boolean;
  addConceptInDialog?: (concept: ConceptDTO) => void;
}

export const Component = () => <PrivateRoute component={<CreateGlossPage />} />;

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
    async (createdConcept: NewConceptDTO) => {
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
