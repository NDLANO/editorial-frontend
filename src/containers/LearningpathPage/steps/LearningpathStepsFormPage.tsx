/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { AddLine, CloseLine, Draggable, ExpandUpDownLine, PencilLine } from "@ndla/icons";
import { Button, ListItemContent, ListItemRoot, PageContent, Spinner, Text } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { Stack, styled } from "@ndla/styled-system/jsx";
import { ILearningPathV2DTO } from "@ndla/types-backend/learningpath-api";
import { LearningpathStepForm } from "./LearningpathStepForm";
import DndList from "../../../components/DndList";
import { DragHandle } from "../../../components/DraggableItem";
import { FormActionsContainer } from "../../../components/FormikForm";
import { useLearningpath } from "../../../modules/learningpath/learningpathQueries";
import { routes } from "../../../util/routeHelpers";
import NotFound from "../../NotFoundPage/NotFoundPage";
import { LearningpathFormHeader } from "../components/LearningpathFormHeader";
import { LearningpathFormStepper } from "../components/LearningpathFormStepper";
import { getFormTypeFromStep, learningpathStepCloseButtonId, learningpathStepEditButtonId } from "../learningpathUtils";

export const LearningpathStepsFormPage = () => {
  const { id, language } = useParams<"id" | "language">();
  const parsedId = parseInt(id ?? "");
  const learningpathQuery = useLearningpath({ id: parsedId }, { enabled: !!parsedId });

  // TODO: Error should not return NotFound
  if (!parsedId || !language || learningpathQuery.isError) {
    return <NotFound />;
  }

  if (learningpathQuery.isPending) {
    return <Spinner />;
  }

  return (
    <PageContent>
      <title>Edit learning path</title>
      <Content learningpath={learningpathQuery.data} language={language} />
    </PageContent>
  );
};

interface Props {
  learningpath: ILearningPathV2DTO;
  language: string;
}

const StyledListItemRoot = styled(ListItemRoot, {
  base: {
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "0",
  },
});

const StyledListItemContent = styled(ListItemContent, {
  base: {
    padding: "xsmall",
  },
  variants: {
    active: {
      true: {
        background: "surface.subtle",
        border: "1px solid",
        borderBottom: "0",
        borderColor: "stroke.discrete",
      },
    },
  },
});

const Content = ({ learningpath, language }: Props) => {
  const [dndEnabled, setDndEnabled] = useState(false);
  const { t } = useTranslation();
  const { stepId } = useParams<"stepId">();
  const location = useLocation();
  const [sortedLearningpathSteps, setSortedLearningpathSteps] = useState(learningpath.learningsteps ?? []);

  useEffect(() => {
    if (!learningpath.learningsteps) return;
    setSortedLearningpathSteps(learningpath.learningsteps);
  }, [learningpath.learningsteps]);

  // const onCancelSort = useCallback(() => {
  //   setSortedLearningpathSteps(learningpath.learningsteps ?? []);
  //   setDndEnabled(false);
  // }, [learningpath.learningsteps]);

  return (
    <>
      <LearningpathFormHeader learningpath={learningpath} language={language} />
      <LearningpathFormStepper id={learningpath.id} language={language} currentStep="steps" />
      {!stepId && !location.pathname.includes("new") && (
        <FormActionsContainer>
          <Button onClick={() => setDndEnabled((s) => !s)} variant={dndEnabled ? "secondary" : "primary"}>
            <ExpandUpDownLine />
            {dndEnabled ? t("learningpathForm.steps.disableDnd") : t("learningpathForm.steps.enableDnd")}
          </Button>
          {!!dndEnabled && <Button>{t("save")}</Button>}
        </FormActionsContainer>
      )}
      <ul>
        <DndList
          items={sortedLearningpathSteps}
          onDragEnd={(_, newArray) => setSortedLearningpathSteps(newArray)}
          disabled={!dndEnabled}
          dragHandle={
            <DragHandle>
              <Draggable />
            </DragHandle>
          }
          renderItem={(item) => (
            <StyledListItemRoot context="list" key={item.id} variant="subtle" nonInteractive>
              <StyledListItemContent active={!!stepId && parseInt(stepId) === item.id}>
                <Stack gap="xxsmall">
                  <Text fontWeight="bold" textStyle="label.medium">
                    {item.title.title}
                  </Text>
                  <Text textStyle="label.small">
                    {t(`learningpathForm.steps.formTypes.${getFormTypeFromStep(item)}`)}
                  </Text>
                </Stack>
                {!!stepId && parseInt(stepId) === item.id ? (
                  <SafeLinkButton
                    variant="tertiary"
                    id={learningpathStepCloseButtonId(item.id)}
                    to={routes.learningpath.edit(learningpath.id, language, "steps")}
                    state={{ focusStepId: learningpathStepEditButtonId(item.id) }}
                  >
                    <CloseLine />
                    {t("close")}
                  </SafeLinkButton>
                ) : (
                  <SafeLinkButton
                    variant="tertiary"
                    id={learningpathStepCloseButtonId(item.id)}
                    to={routes.learningpath.editStep(learningpath.id, item.id, language)}
                    state={{ focusStepId: learningpathStepEditButtonId(item.id) }}
                  >
                    Rediger steg
                    <PencilLine />
                  </SafeLinkButton>
                )}
              </StyledListItemContent>
              {!!stepId && parseInt(stepId) === item.id && <LearningpathStepForm step={item} />}
            </StyledListItemRoot>
          )}
        />
      </ul>
      <Outlet />
      {!stepId && (
        <SafeLinkButton to={routes.learningpath.createStep(learningpath.id, language)} variant="secondary">
          <AddLine />
          Legg til steg
        </SafeLinkButton>
      )}
    </>
  );
};
