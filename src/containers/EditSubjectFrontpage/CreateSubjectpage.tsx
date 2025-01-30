/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PageContainer } from "@ndla/primitives";
import { INewSubjectFrontPageDataDTO } from "@ndla/types-backend/frontpage-api";
import SubjectpageForm from "./components/SubjectpageForm";
import { LocaleType } from "../../interfaces";
import { toEditSubjectpage } from "../../util/routeHelpers";
import { useFetchSubjectpageData } from "../FormikForm/formikSubjectpageHooks";

interface LocationState {
  elementName?: string;
}

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

  const createSubjectpageAndPushRoute = async (createdSubjectpage: INewSubjectFrontPageDataDTO) => {
    const savedSubjectpage = await createSubjectpage(createdSubjectpage);
    const savedId = savedSubjectpage?.id;
    if (savedId) {
      navigate(toEditSubjectpage(elementId, selectedLanguage, savedId));
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
          isNewlyCreated={false}
        />
      </main>
    </PageContainer>
  );
};

export default CreateSubjectpage;
