/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PageContainer } from "@ndla/primitives";
import { INewSubjectPageDTO } from "@ndla/types-backend/frontpage-api";
import SubjectpageForm from "./components/SubjectpageForm";
import { LocaleType } from "../../interfaces";
import { toEditSubjectpage } from "../../util/routeHelpers";
import { useFetchSubjectpageData } from "../FormikForm/formikSubjectpageHooks";
import PrivateRoute from "../PrivateRoute/PrivateRoute";

interface LocationState {
  elementName?: string;
}

export const Component = () => <PrivateRoute component={<CreateSubjectpage />} />;

const CreateSubjectpage = () => {
  const { t } = useTranslation();
  const params = useParams<"selectedLanguage" | "elementId">();
  const selectedLanguage = params.selectedLanguage as LocaleType;
  const elementId = params.elementId!;
  const location = useLocation();
  const locationState = location.state as LocationState | undefined;
  const elementName = locationState?.elementName;
  const navigate = useNavigate();
  const { createSubjectpage } = useFetchSubjectpageData(elementId, selectedLanguage, undefined);

  const createSubjectpageAndPushRoute = async (createdSubjectpage: INewSubjectPageDTO) => {
    const savedSubjectpage = await createSubjectpage(createdSubjectpage);
    const savedId = savedSubjectpage?.id;
    if (savedId) {
      navigate(toEditSubjectpage(elementId, selectedLanguage, savedId), { state: { isNewlyCreated: true } });
    }
    return savedSubjectpage;
  };

  return (
    <PageContainer asChild consumeCss>
      <main>
        <title>{t("htmlTitles.createSubjectpage")}</title>
        <SubjectpageForm
          selectedLanguage={selectedLanguage}
          elementName={elementName}
          createSubjectpage={createSubjectpageAndPushRoute}
          elementId={elementId}
        />
      </main>
    </PageContainer>
  );
};
