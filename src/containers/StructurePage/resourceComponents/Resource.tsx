/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { DeleteBinLine, CheckboxCircleLine } from "@ndla/icons";
import { Text, ListItemContent, ListItemHeading, ListItemRoot, IconButton } from "@ndla/primitives";
import { SafeLink, SafeLinkIconButton } from "@ndla/safelink";
import { cva } from "@ndla/styled-system/css";
import { styled } from "@ndla/styled-system/jsx";
import { ContentTypeBadge } from "@ndla/ui";
import GrepCodesDialog from "./GrepCodesDialog";
import MatomoStats from "./MatomoStats";
import QualityEvaluationGrade from "./QualityEvaluationGrade";
import StatusIcons from "./StatusIcons";
import VersionHistory from "./VersionHistory";
import { SupplementaryIndicator } from "../../../components/Taxonomy/SupplementaryIndicator";
import config from "../../../config";
import { PUBLISHED, RESOURCE_FILTER_SUPPLEMENTARY } from "../../../constants";
import { ResourceWithNodeConnectionAndMeta } from "../../../modules/nodes/nodeApiTypes";
import { getContentTypeFromResourceTypes } from "../../../util/resourceHelpers";
import { routes } from "../../../util/routeHelpers";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";
import { transformMatomoData } from "../utils";
import { useElementIsVisible } from "./isVisibleHook";
import { useMatomoStats } from "../../../modules/matomo/matomoQueries";
import { usePreferences } from "../PreferencesProvider";

const StyledListItemRoot = styled(ListItemRoot, {
  base: {
    width: "100%",
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

interface Props {
  currentNodeId: string;
  responsible?: string;
  resource: ResourceWithNodeConnectionAndMeta;
  nodeResourcesIsPending: boolean;
  onDelete: (connectionId: string) => void;
  rootGrepCodesString: string | undefined;
}

const Resource = ({
  currentNodeId,
  resource,
  nodeResourcesIsPending,
  responsible,
  onDelete,
  rootGrepCodesString,
}: Props) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const { showQuality, showMatomoStats } = usePreferences();

  const ref = useRef(null);
  const isVisible = useElementIsVisible(ref, showMatomoStats);

  const {
    data: matomoStatsData,
    isPending: matomoStatsIsPending,
    isError: matomoStatsIsError,
  } = useMatomoStats(
    { urls: [resource.url ?? ""] },
    { enabled: isVisible && !!resource.url && showMatomoStats, staleTime: Infinity },
  );

  const matomoStats = useMemo(() => {
    if (!matomoStatsData || !showMatomoStats || !resource.contextId) return;
    const transformed = transformMatomoData(matomoStatsData);
    if (!transformed) return;
    return transformed[resource.contextId];
  }, [matomoStatsData, resource.contextId, showMatomoStats]);

  const contentType = getContentTypeFromResourceTypes(resource.resourceTypes);
  const numericId = parseInt(resource.contentUri?.split(":").pop() ?? "");

  const structurePaths: string[] = location.pathname.replace("/structure", "").split("/");
  const currentPath = structurePaths.map((p) => p.replace("urn:", "")).join("/");
  const context = resource.contexts.find((ctx) => {
    const pArr = ctx.path.split("/");
    const isResource = pArr[pArr.length - 1].startsWith("resource");
    const pathWithoutResource = pArr.slice(0, pArr.length - (isResource ? 1 : 0)).join("/");
    return pathWithoutResource === currentPath;
  });

  const isSupplementary = resource.relevanceId === RESOURCE_FILTER_SUPPLEMENTARY;

  return (
    <StyledListItemRoot context="list" variant="subtle" ref={ref}>
      <StyledListItemContent>
        <ContentRow>
          <TextWrapper>
            <ListItemHeading>
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
            </ListItemHeading>
            {!!isSupplementary && <SupplementaryIndicator />}
          </TextWrapper>
          <InfoItems>
            {showMatomoStats ? (
              <MatomoStats
                matomoStats={matomoStats}
                matomoStatsIsPending={matomoStatsIsPending}
                matomoStatsIsError={matomoStatsIsError}
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
              resource={resource}
              multipleTaxonomy={resource.contexts?.length > 1}
            />
          </InfoItems>
        </ContentRow>
        <ContentRow>
          <TextWrapper>
            <ContentTypeBadge contentType={contentType} size="small">
              {t(`contentTypes.${contentType}`)}
            </ContentTypeBadge>
            <Text color="text.subtle" aria-hidden>
              |
            </Text>
            <Text color="text.subtle" textStyle="label.small">
              {responsible ?? t("form.responsible.noResponsible")}
            </Text>
          </TextWrapper>
          <ControlButtonGroup>
            {!!(
              resource.contentMeta?.status?.current === PUBLISHED ||
              resource.contentMeta?.status?.other?.includes(PUBLISHED)
            ) && (
              <SafeLinkIconButton
                target="_blank"
                to={`${config.ndlaFrontendDomain}${context?.url}?versionHash=${taxonomyVersion}`}
                aria-label={t("taxonomy.publishedVersion")}
                title={t("taxonomy.publishedVersion")}
                size="small"
                variant="success"
              >
                <CheckboxCircleLine />
              </SafeLinkIconButton>
            )}
            <GrepCodesDialog
              codes={resource.contentMeta?.grepCodes ?? []}
              contentUri={resource.contentUri}
              revision={resource.contentMeta?.revision}
              currentNodeId={currentNodeId}
              rootGrepCodesString={rootGrepCodesString}
            />
            <VersionHistory resource={resource} contentType={contentType} />
            <IconButton
              aria-label={t("form.remove")}
              title={t("form.remove")}
              onClick={() => onDelete(resource.connectionId)}
              size="small"
              variant="danger"
            >
              <DeleteBinLine />
            </IconButton>
          </ControlButtonGroup>
        </ContentRow>
      </StyledListItemContent>
    </StyledListItemRoot>
  );
};

export default Resource;
