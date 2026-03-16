/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DeleteBinLine, CheckboxCircleLine } from "@ndla/icons";
import {
  Text,
  ListItemContent,
  ListItemHeading,
  ListItemRoot,
  IconButton,
  DialogRoot,
  DialogTrigger,
  DialogContent,
} from "@ndla/primitives";
import { SafeLink, SafeLinkIconButton } from "@ndla/safelink";
import { cva } from "@ndla/styled-system/css";
import { styled } from "@ndla/styled-system/jsx";
import { MultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import { NodeChild } from "@ndla/types-taxonomy";
import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import config from "../../../config";
import { PUBLISHED } from "../../../constants";
import { useMatomoStats } from "../../../modules/matomo/matomoQueries";
import { useBadges } from "../../../util/getBadges";
import { getContentTypeFromResourceTypes } from "../../../util/resourceHelpers";
import { routes } from "../../../util/routeHelpers";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";
import { usePreferences } from "../PreferencesProvider";
import { ResourceGroup, transformMatomoData } from "../utils";
import { DeleteResourceDialogContent } from "./DeleteResourceDialogContent";
import GrepCodesDialog from "./GrepCodesDialog";
import { useElementIsVisible } from "./isVisibleHook";
import MatomoStats from "./MatomoStats";
import QualityEvaluationGrade from "./QualityEvaluationGrade";
import StatusIcons from "./StatusIcons";
import VersionHistory from "./VersionHistory";

const StyledListItemRoot = styled(ListItemRoot, {
  base: {
    width: "100%",
    borderColor: "transparent",
  },
});

const InfoItems = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

const ContentRow = styled("div", {
  base: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "3xsmall",
  },
});

const ControlButtonGroup = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
});

export const linkRecipe = cva({
  base: {
    color: "text.default",
    textDecoration: "underline",
    _hover: {
      textDecoration: "none",
    },
  },
});

const StyledListItemContent = styled(ListItemContent, {
  base: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "4xsmall",
  },
});

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xxsmall",
    alignItems: "center",
  },
});

const StyledListItemHeading = styled(ListItemHeading, {
  variants: {
    isVisible: {
      true: {},
      false: {
        fontStyle: "italic",
        fontWeight: "normal",
      },
    },
  },
});

const IndicatorWrapper = styled("div", {
  base: {
    alignSelf: "stretch",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "xxsmall",
    paddingBlock: "3xsmall",
  },
});

const IndicatorTrack = styled("div", {
  base: {
    width: "1px",
    flex: "1",
    height: "100%",
    backgroundColor: "stroke.default",
  },
});

const Indicator = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "medium",
    height: "medium",
    borderRadius: "full",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "stroke.default",
    background: "background.default",
  },
});

interface Props {
  currentNodeId: string;
  responsible?: string;
  resource: NodeChild;
  contentMeta: MultiSearchSummaryDTO | undefined;
  nodeResourcesIsPending: boolean;
  invalidate: () => void;
  type: ResourceGroup;
  index: number;
  isUngrouped?: boolean;
}

const Resource = ({
  currentNodeId,
  resource,
  nodeResourcesIsPending,
  responsible,
  invalidate,
  contentMeta,
  type,
  index,
  isUngrouped,
}: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const { showQuality, showMatomoStats } = usePreferences();

  const ref = useRef(null);
  const isVisible = useElementIsVisible(ref, showMatomoStats);

  const {
    data: matomoStatsData,
    isPending: matomoStatsIsPending,
    isError: matomoStatsIsError,
  } = useMatomoStats(
    {
      urls: resource.contexts
        .filter((context) => context.rootId.startsWith("urn:subject"))
        .map((context) => context.url),
    },
    { enabled: isVisible && !!resource.url && showMatomoStats, staleTime: Infinity },
  );

  const matomoStats = useMemo(() => {
    if (!matomoStatsData || !showMatomoStats || !resource.contextId) return;
    const transformed = transformMatomoData(matomoStatsData);
    if (!transformed) return;
    return transformed;
  }, [matomoStatsData, resource.contextId, showMatomoStats]);

  const badges = useBadges({
    resourceTypes: resource.resourceTypes,
    relevanceId: resource.relevanceId,
    resourceType: type === "link" ? "multidisciplinary" : resource.nodeType.toLowerCase(),
  });

  const contentType = getContentTypeFromResourceTypes(resource.resourceTypes);
  const numericId = parseInt(resource.contentUri?.split(":").pop() ?? "");

  return (
    <StyledListItemRoot ref={ref}>
      {!!isUngrouped && (
        <IndicatorWrapper>
          <Indicator>{index + 1}</Indicator>
          <IndicatorTrack />
        </IndicatorWrapper>
      )}
      <StyledListItemContent>
        <ContentRow>
          <TextWrapper>
            <StyledListItemHeading isVisible={resource.metadata.visible}>
              {numericId ? (
                <SafeLink
                  to={
                    contentType === "learning-path"
                      ? routes.learningpath.edit(numericId, i18n.language)
                      : routes.editArticle(numericId, contentType)
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  css={linkRecipe.raw()}
                >
                  {resource.name}
                </SafeLink>
              ) : (
                <Text textStyle="body.link" css={linkRecipe.raw()}>
                  {resource.name}
                </Text>
              )}
            </StyledListItemHeading>
          </TextWrapper>
          <InfoItems>
            {showMatomoStats ? (
              <MatomoStats
                stats={resource.contextId ? matomoStats?.[resource.contextId] : undefined}
                allStats={resource.contextids.map((cId) => matomoStats?.[cId])}
                isPending={matomoStatsIsPending}
                isError={matomoStatsIsError}
                contentMeta={contentMeta}
              />
            ) : null}
            {!!showQuality && (
              <QualityEvaluationGrade
                grade={resource.qualityEvaluation?.grade}
                tooltip={
                  resource.qualityEvaluation?.note
                    ? `${t("qualityEvaluationForm.title")}: ${resource.qualityEvaluation?.note}`
                    : t("qualityEvaluationForm.title")
                }
              />
            )}
            <StatusIcons
              nodeResourcesIsPending={nodeResourcesIsPending}
              contentMeta={contentMeta}
              resource={resource}
              multipleTaxonomy={resource.contexts?.length > 1}
            />
          </InfoItems>
        </ContentRow>
        <ContentRow>
          <TextWrapper>
            <Text color="text.subtle">{badges.join(", ")}</Text>
            <Text color="text.subtle" aria-hidden>
              |
            </Text>
            <Text color="text.subtle" textStyle="label.small">
              {responsible ?? t("form.responsible.noResponsible")}
            </Text>
          </TextWrapper>
          <ControlButtonGroup>
            {!!(contentMeta?.status?.current === PUBLISHED || contentMeta?.status?.other?.includes(PUBLISHED)) && (
              <SafeLinkIconButton
                target="_blank"
                to={`${config.ndlaFrontendDomain}${resource.context?.url}?versionHash=${taxonomyVersion}`}
                aria-label={t("taxonomy.publishedVersion")}
                title={t("taxonomy.publishedVersion")}
                size="small"
                variant="success"
              >
                <CheckboxCircleLine />
              </SafeLinkIconButton>
            )}
            <GrepCodesDialog
              codes={contentMeta?.grepCodes ?? []}
              contentUri={resource.contentUri}
              revision={contentMeta?.revision}
              currentNodeId={currentNodeId}
            />
            <VersionHistory resource={resource} contentMeta={contentMeta} contentType={contentType} />
            <DialogRoot>
              <DialogTrigger asChild>
                <IconButton aria-label={t("form.remove")} title={t("form.remove")} size="small" variant="danger">
                  <DeleteBinLine />
                </IconButton>
              </DialogTrigger>
              <DialogContent>
                <DeleteResourceDialogContent resource={resource} contentMeta={contentMeta} invalidate={invalidate} />
              </DialogContent>
            </DialogRoot>
          </ControlButtonGroup>
        </ContentRow>
      </StyledListItemContent>
    </StyledListItemRoot>
  );
};

export default Resource;
