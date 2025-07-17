/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useParams } from "react-router-dom";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { AddLine, CloseLine, DeleteBinLine, Draggable, PencilLine } from "@ndla/icons";
import { IconButton, ListItemContent, ListItemRoot, PageContent, Spinner, Text } from "@ndla/primitives";
import { SafeLinkButton, SafeLinkIconButton } from "@ndla/safelink";
import { Stack, styled } from "@ndla/styled-system/jsx";
import { ILearningPathV2DTO } from "@ndla/types-backend/learningpath-api";
import { LearningpathStepForm } from "./LearningpathStepForm";
import DndList from "../../../components/DndList";
import { DragHandle } from "../../../components/DraggableItem";
import { FormActionsContainer, FormContent } from "../../../components/FormikForm";
import {
  useDeleteLearningStepMutation,
  usePutLearningStepOrderMutation,
} from "../../../modules/learningpath/learningpathMutations";
import { useLearningpath } from "../../../modules/learningpath/learningpathQueries";
import { routes } from "../../../util/routeHelpers";
import NotFound from "../../NotFoundPage/NotFoundPage";
import { LearningpathFormHeader } from "../components/LearningpathFormHeader";
import { LearningpathFormStepper } from "../components/LearningpathFormStepper";
import { getFormTypeFromStep, learningpathStepCloseButtonId, learningpathStepEditButtonId } from "../learningpathUtils";

export const LearningpathStepsFormPage = () => {
  const { t } = useTranslation();
  const { id, language } = useParams<"id" | "language">();
  const parsedId = parseInt(id ?? "");
  const learningpathQuery = useLearningpath({ id: parsedId, language }, { enabled: !!parsedId });

  // TODO: Error should not return NotFound
  if (!parsedId || !language || learningpathQuery.isError) {
    return <NotFound />;
  }

  if (learningpathQuery.isLoading) {
    return <Spinner />;
  }

  if (!learningpathQuery.data) {
    return <NotFound />;
  }

  return (
    <PageContent>
      <title>{t("htmlTitles.learningpathForm.editSteps")}</title>
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
    padding: "0",
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
  const { t } = useTranslation();
  const { stepId } = useParams<"stepId">();
  const [sortedLearningpathSteps, setSortedLearningpathSteps] = useState(learningpath.learningsteps ?? []);
  const deleteStepMutation = useDeleteLearningStepMutation();
  const putLearningStepOrderMutation = usePutLearningStepOrderMutation();

  useEffect(() => {
    if (!learningpath.learningsteps) return;
    setSortedLearningpathSteps(learningpath.learningsteps);
  }, [learningpath.learningsteps]);

  const onDeleteStep = useCallback(
    async (stepId: number) => {
      await deleteStepMutation.mutateAsync({ learningpathId: learningpath.id, stepId });
    },
    [deleteStepMutation, learningpath.id],
  );

  const onDragEnd = useCallback(
    async (event: DragEndEvent) => {
      // TODO: Error handling
      try {
        const { active, over } = event;
        if (over?.data.current && active.data.current) {
          const oldIndex = learningpath.learningsteps.findIndex((step) => step.id === Number(active.id));
          const newIndex = learningpath.learningsteps.findIndex((step) => step.id === Number(over.id));

          if (newIndex === undefined || newIndex === oldIndex) return;

          const sortedArr = arrayMove(sortedLearningpathSteps, oldIndex, newIndex);
          const dropped = sortedLearningpathSteps.find((step) => step.id === Number(active.id));

          setSortedLearningpathSteps(sortedArr);
          await putLearningStepOrderMutation.mutateAsync({
            learningpathId: learningpath.id,
            stepId: dropped?.id ?? -1,
            seqNo: newIndex,
          });
        }
      } catch (err) {
        // TODO: Error handling
      }
    },
    [learningpath.id, learningpath.learningsteps, putLearningStepOrderMutation, sortedLearningpathSteps],
  );

  return (
    <FormContent>
      <LearningpathFormHeader learningpath={learningpath} language={language} />
      <LearningpathFormStepper id={learningpath.id} language={language} currentStep="steps" />
      <ul>
        <DndList
          items={sortedLearningpathSteps}
          onDragEnd={onDragEnd}
          disabled={!!stepId}
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
                  <FormActionsContainer>
                    <IconButton
                      variant="danger"
                      onClick={() => onDeleteStep(item.id)}
                      aria-label={t("delete")}
                      title={t("delete")}
                    >
                      <DeleteBinLine />
                    </IconButton>
                    <SafeLinkIconButton
                      variant="tertiary"
                      id={learningpathStepCloseButtonId(item.id)}
                      to={routes.learningpath.editStep(learningpath.id, item.id, language)}
                      state={{ focusStepId: learningpathStepEditButtonId(item.id) }}
                      aria-label={t("learningpathForm.steps.editStep")}
                      title={t("learningpathForm.steps.editStep")}
                    >
                      <PencilLine />
                    </SafeLinkIconButton>
                  </FormActionsContainer>
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
          {t("learningpathForm.steps.addStep")}
        </SafeLinkButton>
      )}
    </FormContent>
  );
};
