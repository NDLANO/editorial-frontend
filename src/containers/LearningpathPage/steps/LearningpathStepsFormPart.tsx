/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Portal } from "@ark-ui/react";
import { DragEndEvent } from "@dnd-kit/core";
import { AddLine, Draggable } from "@ndla/icons";
import { Button, DialogContent, DialogHeader, DialogRoot, DialogTitle, DialogTrigger, Text } from "@ndla/primitives";
import { LearningPathV2DTO } from "@ndla/types-backend/learningpath-api";
import { LearningpathStepForm } from "./LearningpathStepForm";
import { LearningStepListItem } from "./LearningStepListItem";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import DndList from "../../../components/DndList";
import { DragHandle } from "../../../components/DraggableItem";
import { FormContent } from "../../../components/FormikForm";
import { PUBLISHED } from "../../../constants";
import {
  useDeleteLearningStepMutation,
  usePutLearningStepOrderMutation,
} from "../../../modules/learningpath/learningpathMutations";
import { learningStepEditId } from "../learningpathUtils";

interface Props {
  learningpath: LearningPathV2DTO;
  language: string;
}

export const LearningpathStepsFormPart = ({ learningpath, language }: Props) => {
  const [open, setOpen] = useState(false);
  const [focusId, setFocusId] = useState<string | undefined>(undefined);
  const { t } = useTranslation();
  const deleteStepMutation = useDeleteLearningStepMutation(language);
  const putLearningStepOrderMutation = usePutLearningStepOrderMutation(language);

  useEffect(() => {
    if (focusId && !open) {
      document.getElementById(focusId)?.focus();
      setFocusId(undefined);
    }
  }, [focusId, open]);

  const onDeleteStep = useCallback(
    async (stepId: number) => {
      const index = learningpath.learningsteps.findIndex((step) => step.id === stepId);
      const focusId = learningpath.learningsteps[index + 1]?.id || learningpath.learningsteps[index - 1]?.id;
      await deleteStepMutation.mutateAsync({ learningpathId: learningpath.id, stepId });
      if (focusId) {
        setFocusId(learningStepEditId(focusId));
      }
    },
    [deleteStepMutation, learningpath.id, learningpath.learningsteps],
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
      {learningpath.learningsteps.length ? (
        <ul>
          <DndList
            items={learningpath.learningsteps}
            onDragEnd={onDragEnd}
            dragHandle={
              <DragHandle>
                <Draggable />
              </DragHandle>
            }
            renderItem={(item) => (
              <LearningStepListItem
                key={item.id}
                item={item}
                onDeleteStep={onDeleteStep}
                learningpathId={learningpath.id}
                language={language}
                onlyPublishedResources={learningpath.status === PUBLISHED}
              />
            )}
          />
        </ul>
      ) : (
        <Text>{t("learningpathForm.steps.noSteps")}</Text>
      )}
      <DialogRoot open={open} onOpenChange={(details) => setOpen(details.open)}>
        <DialogTrigger asChild>
          <Button variant="secondary">
            <AddLine />
            {t("learningpathForm.steps.addStep")}
          </Button>
        </DialogTrigger>
        <Portal>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("learningpathForm.steps.addStep")}</DialogTitle>
              <DialogCloseButton />
            </DialogHeader>
            <LearningpathStepForm
              onClose={(focusId) => {
                setOpen(false);
                if (focusId) {
                  setTimeout(() => setFocusId(learningStepEditId(focusId)), 0);
                }
              }}
              onlyPublishedResources={learningpath.status === PUBLISHED}
            />
          </DialogContent>
        </Portal>
      </DialogRoot>
    </FormContent>
  );
};
