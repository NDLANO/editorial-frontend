/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CloseLine, DeleteBinLine, ErrorWarningFill, PencilLine } from "@ndla/icons";
import { IconButton, ListItemContent, ListItemRoot, Text } from "@ndla/primitives";
import { SafeLinkButton, SafeLinkIconButton } from "@ndla/safelink";
import { Stack, styled } from "@ndla/styled-system/jsx";
import { ILearningStepV2DTO } from "@ndla/types-backend/learningpath-api";
import { FormActionsContainer } from "../../../components/FormikForm";
import { PUBLISHED } from "../../../constants";
import { routes } from "../../../util/routeHelpers";
import { getFormTypeFromStep, learningpathStepCloseButtonId, learningpathStepEditButtonId } from "../learningpathUtils";
import { LearningpathStepForm } from "./LearningpathStepForm";
import { useDraft } from "../../../modules/draft/draftQueries";

interface Props {
  stepId: string | undefined;
  item: ILearningStepV2DTO;
  language: string;
  learningpathId: number;
  onDeleteStep: (stepId: number) => void;
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

const StyledErrorWarningFill = styled(ErrorWarningFill, {
  base: {
    color: "icon.warning",
  },
});

const ARTICLE_ID_REGEX = /\/article-iframe\/?.*?\/(\d+)/gm;

export const LearningStepListItem = ({ item, stepId, onDeleteStep, language, learningpathId }: Props) => {
  const { t } = useTranslation();
  const stepType = useMemo(() => getFormTypeFromStep(item), [item]);

  const articleId = useMemo(() => {
    if (stepType !== "resource") return 0;
    if (item.articleId) return item.articleId;
    if (item.embedUrl?.url) {
      const articleId = parseInt(item.embedUrl.url.match(ARTICLE_ID_REGEX)?.[0]?.split("/")?.pop() ?? "");
      return articleId ?? 0;
    }
    return 0;
  }, [item.articleId, item.embedUrl?.url, stepType]);

  const draftQuery = useDraft({ id: articleId, language }, { enabled: stepType === "resource" && !!articleId });

  const hasPublishedVersion = useMemo(() => {
    if (stepType !== "resource") return true; // Only check for published if resource
    return draftQuery.data?.status.current === PUBLISHED || draftQuery.data?.status.other.includes(PUBLISHED);
  }, [draftQuery.data?.status, stepType]);

  return (
    <StyledListItemRoot context="list" key={item.id} variant="subtle" nonInteractive>
      <StyledListItemContent active={!!stepId && parseInt(stepId) === item.id}>
        <Stack gap="xxsmall">
          <Text fontWeight="bold" textStyle="label.medium">
            {item.title.title}
          </Text>
          <Text textStyle="label.small">{t(`learningpathForm.steps.formTypes.${stepType}`)}</Text>
        </Stack>
        {!!stepId && parseInt(stepId) === item.id ? (
          <SafeLinkButton
            variant="tertiary"
            id={learningpathStepCloseButtonId(item.id)}
            to={routes.learningpath.edit(learningpathId, language, "steps")}
            state={{ focusStepId: learningpathStepEditButtonId(item.id) }}
          >
            <CloseLine />
            {t("close")}
          </SafeLinkButton>
        ) : (
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
            <SafeLinkIconButton
              variant="tertiary"
              id={learningpathStepEditButtonId(item.id)}
              to={routes.learningpath.editStep(learningpathId, item.id, language)}
              state={{ focusStepId: learningpathStepCloseButtonId(item.id) }}
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
  );
};
