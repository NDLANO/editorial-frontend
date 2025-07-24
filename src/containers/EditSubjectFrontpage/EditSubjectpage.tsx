/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { PageContainer } from "@ndla/primitives";
import SubjectpageForm from "./components/SubjectpageForm";
import { PageSpinner } from "../../components/PageSpinner";
import { LocaleType } from "../../interfaces";
import { useFetchSubjectpageData } from "../FormikForm/formikSubjectpageHooks";
import NotFoundPage from "../NotFoundPage/NotFoundPage";

const EditSubjectpage = () => {
  const { t } = useTranslation();
  const { elementId, subjectpageId, selectedLanguage } = useParams<
    "elementId" | "subjectpageId" | "selectedLanguage"
  >();
  const { loading, subjectpage, updateSubjectpage, error, editorsChoices } = useFetchSubjectpageData(
    elementId!,
    selectedLanguage as LocaleType,
    subjectpageId,
  );

  if (error !== undefined) {
    return <NotFoundPage />;
  }

  if (loading || !subjectpage || !subjectpage.id) {
    return <PageSpinner />;
  }

  return (
    <PageContainer asChild consumeCss>
      <main>
        <title>{`${subjectpage?.about?.title} ${t("htmlTitles.titleTemplate")}`}</title>
        <SubjectpageForm
          editorsChoices={editorsChoices}
          elementId={elementId!}
          subjectpage={subjectpage}
          selectedLanguage={selectedLanguage!}
          updateSubjectpage={updateSubjectpage}
        />
      </main>
    </PageContainer>
  );
};

export default EditSubjectpage;
