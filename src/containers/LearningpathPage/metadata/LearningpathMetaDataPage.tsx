/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { LearningpathMetaDataForm } from "./LearningpathMetaDataForm";
import PrivateRoute from "../../PrivateRoute/PrivateRoute";
import { useLearningpathContext } from "../LearningpathLayout";

export const Component = () => {
  return <PrivateRoute component={<LearningpathMetaDataPage />} />;
};

export const LearningpathMetaDataPage = () => {
  const { t } = useTranslation();
  const { learningpath, language } = useLearningpathContext();

  return (
    <>
      <title>{t("htmlTitles.learningpathForm.editMetadata")}</title>
      <LearningpathMetaDataForm learningpath={learningpath} language={language} />
    </>
  );
};
