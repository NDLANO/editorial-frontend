/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Portal } from "@ark-ui/react";
import { DeleteBinLine, ErrorWarningFill, PencilLine } from "@ndla/icons";
import {
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  IconButton,
  ListItemContent,
  ListItemRoot,
  Text,
} from "@ndla/primitives";
import { Stack, styled } from "@ndla/styled-system/jsx";
import { LearningStepV2DTO } from "@ndla/types-backend/learningpath-api";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import { FormActionsContainer } from "../../../components/FormikForm";
import { PUBLISHED } from "../../../constants";
import { useDraft } from "../../../modules/draft/draftQueries";
import { learningStepEditId } from "../learningpathUtils";
import { LearningpathStepForm } from "./LearningpathStepForm";

interface Props {
  item: LearningStepV2DTO;
  language: string;
  learningpathId: number;
  onDeleteStep: (stepId: number) => void;
  onlyPublishedResources: boolean;
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
});

const StyledErrorWarningFill = styled(ErrorWarningFill, {
  base: {
    color: "icon.warning",
  },
});

const ARTICLE_ID_REGEX = /\/article-iframe\/?.*?\/(\d+)/gm;

export const LearningStepListItem = ({ item, onDeleteStep, language, onlyPublishedResources }: Props) => {
  const [open, setOpen] = useState(false);
  const [focusId, setFocusId] = useState<string | undefined>(undefined);
  const { t } = useTranslation();

  useEffect(() => {
    if (focusId && !open) {
      document.getElementById(focusId)?.focus();
      setFocusId(undefined);
    }
  }, [focusId, open]);

  const articleId = useMemo(() => {
    if (item.type !== "ARTICLE") return 0;
    if (item.articleId) return item.articleId;
    if (item.embedUrl?.url) {
      const articleId = parseInt(item.embedUrl.url.match(ARTICLE_ID_REGEX)?.[0]?.split("/")?.pop() ?? "");
      return articleId ?? 0;
    }
    return 0;
  }, [item.articleId, item.embedUrl?.url, item.type]);

  const draftQuery = useDraft({ id: articleId, language }, { enabled: item.type === "ARTICLE" && !!articleId });

  const hasPublishedVersion = useMemo(() => {
    if (item.type !== "ARTICLE") return true; // Only check for published if resource
    return draftQuery.data?.status.current === PUBLISHED || draftQuery.data?.status.other.includes(PUBLISHED);
  }, [draftQuery.data?.status, item.type]);

  return (
    <StyledListItemRoot id={item.id.toString()} key={item.id} nonInteractive>
      <StyledListItemContent>
        <Stack gap="xxsmall">
          <Text fontWeight="bold" textStyle="label.medium">
            {item.title.title}
          </Text>
          <Text textStyle="label.small">{t(`learningpathForm.steps.formTypes.${item.type}`)}</Text>
        </Stack>
        <FormActionsContainer>
          {!hasPublishedVersion && (
            <StyledErrorWarningFill
              aria-label={t("learningpathForm.steps.noPublishedVersion")}
              title={t("learningpathForm.steps.noPublishedVersion")}
            />
          )}
          <IconButton
            variant="danger"
            onClick={() => onDeleteStep(item.id)}
            aria-label={t("delete")}
            title={t("delete")}
          >
            <DeleteBinLine />
          </IconButton>
          <DialogRoot
            open={open}
            size={item.type === "TEXT" || item.description?.description.length ? "large" : "medium"}
            onOpenChange={(details) => setOpen(details.open)}
            ids={{
              trigger: learningStepEditId(item.id),
            }}
          >
            <DialogTrigger asChild>
              <IconButton
                variant="tertiary"
                aria-label={t("learningpathForm.steps.editStep")}
                title={t("learningpathForm.steps.editStep")}
              >
                <PencilLine />
              </IconButton>
            </DialogTrigger>
            <Portal>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("learningpathForm.steps.editStep")}</DialogTitle>
                  <DialogCloseButton />
                </DialogHeader>
                <LearningpathStepForm
                  onlyPublishedResources={onlyPublishedResources}
                  step={item}
                  onClose={(focusId) => {
                    setOpen(false);
                    if (focusId) {
                      setTimeout(() => setFocusId(learningStepEditId(focusId)), 0);
                    }
                  }}
                />
              </DialogContent>
            </Portal>
          </DialogRoot>
        </FormActionsContainer>
      </StyledListItemContent>
    </StyledListItemRoot>
  );
};
