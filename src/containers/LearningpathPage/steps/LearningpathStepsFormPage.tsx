/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useParams } from "react-router-dom";
import { DragEndEvent } from "@dnd-kit/core";
import { AddLine, Draggable } from "@ndla/icons";
import { Heading, Text } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { LearningpathStepForm } from "./LearningpathStepForm";
import DndList from "../../../components/DndList";
import { DragHandle } from "../../../components/DraggableItem";
import { FormContent } from "../../../components/FormikForm";
import {
  useDeleteLearningStepMutation,
  usePutLearningStepOrderMutation,
} from "../../../modules/learningpath/learningpathMutations";
import { routes } from "../../../util/routeHelpers";
import PrivateRoute from "../../PrivateRoute/PrivateRoute";
import { useLearningpathContext } from "../LearningpathLayout";
import { LearningStepListItem } from "./LearningStepListItem";

interface LocationState {
  focusStepId?: string;
}

export const Component = () => {
  return <PrivateRoute component={<LearningpathStepsFormPage />} />;
};

export const LearningpathStepsFormPage = () => {
  const { t } = useTranslation();
  const { learningpath, language } = useLearningpathContext();
  const { stepId } = useParams<"stepId">();
  const deleteStepMutation = useDeleteLearningStepMutation(language);
  const putLearningStepOrderMutation = usePutLearningStepOrderMutation(language);
  const location = useLocation();

  useEffect(() => {
    const locationState = location.state as LocationState;
    const focusId = locationState?.focusStepId;
    if (!focusId) return;
    setTimeout(() => {
      const focusElement = document.getElementById(focusId.toString());
      focusElement?.focus();
    }, 0);
  }, [location, stepId]);

  const onDeleteStep = useCallback(
    async (stepId: number) => {
      const el = document.getElementById(stepId.toString())?.closest("li");
      const focusEl = [el?.nextElementSibling, el?.previousElementSibling].find(
        (el) => el?.tagName === "LI",
      ) as HTMLElement | null;
      await deleteStepMutation.mutateAsync({ learningpathId: learningpath.id, stepId });
      focusEl?.focus();
    },
    [deleteStepMutation, learningpath.id],
  );

  const onDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      const overIndex = over?.data.current?.index;
      const activeIndex = active.data.current?.index;
      if (!Number.isInteger(overIndex) || !Number.isInteger(activeIndex) || overIndex === activeIndex) return;
      await putLearningStepOrderMutation.mutateAsync({
        learningpathId: learningpath.id,
        stepId: Number(active.id) || -1,
        seqNo: overIndex,
      });
    },
    [learningpath.id, putLearningStepOrderMutation],
  );

  return (
    <FormContent>
      <title>{t("htmlTitles.learningpathForm.editSteps")}</title>
      <Heading asChild consumeCss>
        <h2>{t("learningpathForm.steps.heading")}</h2>
      </Heading>
      {!learningpath.learningsteps.length ? (
        <Text>{t("learningpathForm.steps.noSteps")}</Text>
      ) : (
        <ul>
          <DndList
            items={learningpath.learningsteps}
            onDragEnd={onDragEnd}
            disabled={!!stepId}
            dragHandle={
              <DragHandle>
                <Draggable />
              </DragHandle>
            }
            renderItem={(item) => (
              <LearningStepListItem
                key={item.id}
                item={item}
                stepId={stepId}
                onDeleteStep={onDeleteStep}
                learningpathId={learningpath.id}
                language={language}
              />
            )}
          />
        </ul>
      )}
      {stepId === "new" && <LearningpathStepForm />}
      {!stepId && (
        <SafeLinkButton to={routes.learningpath.createStep(learningpath.id, language)} variant="secondary">
          <AddLine />
          {t("learningpathForm.steps.addStep")}
        </SafeLinkButton>
      )}
    </FormContent>
  );
};
