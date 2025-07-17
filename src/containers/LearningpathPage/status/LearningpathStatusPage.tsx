/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router-dom";
import { Button, Heading, PageContent, Text } from "@ndla/primitives";
import { FormActionsContainer, FormContent } from "../../../components/FormikForm";
import { PageSpinner } from "../../../components/PageSpinner";
import { PUBLISHED } from "../../../constants";
import { usePutLearningpathStatusMutation } from "../../../modules/learningpath/learningpathMutations";
import { useLearningpath } from "../../../modules/learningpath/learningpathQueries";
import { routes } from "../../../util/routeHelpers";
import NotFound from "../../NotFoundPage/NotFoundPage";
import { LearningpathFormHeader } from "../components/LearningpathFormHeader";
import { LearningpathFormStepper } from "../components/LearningpathFormStepper";

export const LearningpathStatusPage = () => {
  const { t } = useTranslation();
  const { id, language } = useParams<"id" | "language">();
  const numericId = parseInt(id || "");
  const learningpathQuery = useLearningpath({ id: numericId, language }, { enabled: !!numericId });
  const putLearningpathStatusMutation = usePutLearningpathStatusMutation();

  if (!numericId || !language) {
    return <NotFound />;
  }

  if (learningpathQuery.isPending) {
    return <PageSpinner />;
  }

  if (learningpathQuery.data?.status === PUBLISHED) {
    return <Navigate to={routes.learningpath.edit(numericId, language)} replace />;
  }

  return (
    <PageContent>
      <title>{t("htmlTitles.learningpathForm.status")}</title>
      <LearningpathFormHeader learningpath={learningpathQuery.data} language={language} />
      <LearningpathFormStepper id={numericId} language={language} currentStep="status" />
      <FormContent>
        <Heading>Endre status på læringssti</Heading>
        <Text>
          En læringssti kan bare publiseres en gang. Når den først er publisert vil alle fremtidige endringer ende opp
          direkte på ndla.no. Hver nye språkversjon av en læringssti må publiseres separat.
        </Text>
        <FormActionsContainer>
          <Button
            loading={putLearningpathStatusMutation.isPending}
            onClick={() => putLearningpathStatusMutation.mutate({ learningpathId: numericId, status: PUBLISHED })}
          >
            Publiser
          </Button>
        </FormActionsContainer>
      </FormContent>
    </PageContent>
  );
};
