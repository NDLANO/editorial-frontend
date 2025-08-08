/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Button, Heading, Text } from "@ndla/primitives";
import { FormActionsContainer, FormContent } from "../../../components/FormikForm";
import { PUBLISHED } from "../../../constants";
import { usePutLearningpathStatusMutation } from "../../../modules/learningpath/learningpathMutations";
import PrivateRoute from "../../PrivateRoute/PrivateRoute";
import { useLearningpathContext } from "../LearningpathLayout";

export const Component = () => {
  return <PrivateRoute component={<LearningpathStatusPage />} />;
};

export const LearningpathStatusPage = () => {
  const { t } = useTranslation();
  const { learningpath, language } = useLearningpathContext();
  const putLearningpathStatusMutation = usePutLearningpathStatusMutation(language);

  const isPublished = learningpath.status === PUBLISHED;

  return (
    <FormContent>
      <title>{t("htmlTitles.learningpathForm.status")}</title>
      <Heading asChild consumeCss>
        <h2>{t("learningpathForm.status.heading")}</h2>
      </Heading>
      <Text>{t(`learningpathForm.status.${isPublished ? "publishedText" : "unpublishedText"}`)}</Text>
      <FormActionsContainer>
        <Button
          disabled={learningpath.status === PUBLISHED}
          loading={putLearningpathStatusMutation.isPending}
          onClick={() => putLearningpathStatusMutation.mutate({ learningpathId: learningpath.id, status: PUBLISHED })}
        >
          {t("learningpathForm.status.publish")}
        </Button>
      </FormActionsContainer>
    </FormContent>
  );
};
