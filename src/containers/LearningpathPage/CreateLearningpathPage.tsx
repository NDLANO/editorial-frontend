/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PageContent } from "@ndla/primitives";
import { useTranslation } from "react-i18next";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import { LearningpathForm } from "./LearningpathForm";

export const Component = () => {
  return <PrivateRoute component={<CreateLearningpathPage />} />;
};

export const CreateLearningpathPage = () => {
  const { t, i18n } = useTranslation();
  return (
    <PageContent>
      <title>{t("htmlTitles.learningpath.new")}</title>
      <LearningpathForm learningpath={undefined} language={i18n.language} />
    </PageContent>
  );
};
