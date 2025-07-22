/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { Outlet, useLocation, useOutletContext, useParams } from "react-router-dom";
import { PageContainer, PageContent } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ILearningPathV2DTO } from "@ndla/types-backend/learningpath-api";
import { LearningpathErrorMessage } from "./components/LearningpathErrorMessage";
import { PageSpinner } from "../../components/PageSpinner";
import { useLearningpath } from "../../modules/learningpath/learningpathQueries";
import { isNotFoundError } from "../../util/resolveJsonOrRejectWithError";
import NotFound from "../NotFoundPage/NotFoundPage";
import { LearningpathFormHeader } from "./components/LearningpathFormHeader";
import { LearningpathFormStepper } from "./components/LearningpathFormStepper";

const getCurrentStep = (pathname: string): "metadata" | "steps" | "preview" | "status" => {
  if (pathname.includes("metadata")) {
    return "metadata";
  } else if (pathname.includes("steps")) {
    return "steps";
  } else if (pathname.includes("preview")) {
    return "preview";
  } else if (pathname.includes("status")) {
    return "status";
  }
  return "metadata"; // Default step
};

const Container = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

export const LearningpathLayout = () => {
  const { id, language } = useParams<"id" | "language">();
  const [enableClone, setEnableClone] = useState(true);
  const numericId = parseInt(id ?? "");
  const learningpathQuery = useLearningpath({ id: numericId, language }, { enabled: !!numericId });
  const location = useLocation();

  if (!numericId || !language) {
    return <NotFound />;
  }

  if (learningpathQuery.isLoading) {
    return <PageSpinner />;
  }

  if (learningpathQuery.isError && isNotFoundError(learningpathQuery.error)) {
    return <NotFound />;
  }

  if (learningpathQuery.isError || !learningpathQuery.data) {
    return (
      <PageContainer>
        <LearningpathErrorMessage />
      </PageContainer>
    );
  }

  return (
    <PageContent>
      <Container>
        <LearningpathFormHeader learningpath={learningpathQuery.data} language={language} enableClone={enableClone} />
        <LearningpathFormStepper
          id={learningpathQuery.data.id}
          language={language}
          currentStep={getCurrentStep(location.pathname)}
        />
        <Outlet context={{ learningpath: learningpathQuery.data, enableClone, setEnableClone, language }} />
      </Container>
    </PageContent>
  );
};

interface LearningpathContext {
  learningpath: ILearningPathV2DTO;
  language: string;
  enableClone: boolean;
  setEnableClone: (enable: boolean) => void;
}

export const useLearningpathContext = () => {
  return useOutletContext<LearningpathContext>();
};
