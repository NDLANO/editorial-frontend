/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { TrashCanOutline } from "@ndla/icons/action";
import { Check } from "@ndla/icons/editor";
import { Text, ListItemContent, ListItemHeading, ListItemRoot, IconButton } from "@ndla/primitives";
import { SafeLink, SafeLinkIconButton } from "@ndla/safelink";
import { cva } from "@ndla/styled-system/css";
import { styled } from "@ndla/styled-system/jsx";
import { ContentTypeBadgeNew } from "@ndla/ui";
import GrepCodesModal from "./GrepCodesModal";
import QualityEvaluationGrade from "./QualityEvaluationGrade";
import StatusIcons from "./StatusIcons";
import { ResourceWithNodeConnectionAndMeta } from "./StructureResources";
import VersionHistory from "./VersionHistory";
import RelevanceOption from "../../../components/Taxonomy/RelevanceOption";
import config from "../../../config";
import { PUBLISHED } from "../../../constants";
import { getContentTypeFromResourceTypes } from "../../../util/resourceHelpers";
import { routes, toLearningpathFull } from "../../../util/routeHelpers";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

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
  },
});

const StyledCheckIcon = styled(Check, {
  base: {
    fill: "surface.success",
  },
});

const TopRow = styled("div", {
  base: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
  },
});

const BottomRow = styled("div", {
  base: {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

const ControlButtonGroup = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
  },
});

const linkRecipe = cva({
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
    gap: "5xsmall",
  },
});

interface Props {
  currentNodeId: string;
  responsible?: string;
  resource: ResourceWithNodeConnectionAndMeta;
  onDelete: (connectionId: string) => void;
  contentMetaLoading: boolean;
  showQuality: boolean;
}

const Resource = ({ resource, onDelete, currentNodeId, contentMetaLoading, responsible, showQuality }: Props) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const contentType = getContentTypeFromResourceTypes(resource.resourceTypes);
  const numericId = parseInt(resource.contentUri?.split(":").pop() ?? "");

  const structurePaths: string[] = location.pathname.replace("/structure", "").split("/");
  const currentPath = structurePaths.map((p) => p.replace("urn:", "")).join("/");
  const path = resource.paths.find((p) => {
    const pArr = p.split("/");
    const isResource = pArr[pArr.length - 1].startsWith("resource");
    const pathWithoutResource = pArr.slice(0, pArr.length - (isResource ? 1 : 0)).join("/");
    return pathWithoutResource === currentPath;
  });

  return (
    <StyledListItemRoot context="list" variant="subtle">
      <StyledListItemContent>
        <TopRow>
          <ContentTypeBadgeNew contentType={contentType} />
          <InfoItems>
            {showQuality && (
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
              contentMetaLoading={contentMetaLoading}
              resource={resource}
              multipleTaxonomy={resource.contexts?.length > 1}
              path={path}
            />
            <RelevanceOption resource={resource} currentNodeId={currentNodeId} />
          </InfoItems>
        </TopRow>
        <ListItemHeading>
          {numericId ? (
            <SafeLink
              to={
                contentType === "learning-path"
                  ? toLearningpathFull(numericId, i18n.language)
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
        <BottomRow>
          <Text textStyle="label.small">
            <b>{`${t("form.responsible.label")}: `}</b>
            {responsible ?? t("form.responsible.noResponsible")}
          </Text>
          <ControlButtonGroup>
            {(resource.contentMeta?.status?.current === PUBLISHED ||
              resource.contentMeta?.status?.other?.includes(PUBLISHED)) && (
              <SafeLinkIconButton
                target="_blank"
                to={`${config.ndlaFrontendDomain}${path}?versionHash=${taxonomyVersion}`}
                aria-label={t("form.workflow.published")}
                title={t("form.workflow.published")}
                variant="secondary"
                size="small"
              >
                <StyledCheckIcon />
              </SafeLinkIconButton>
            )}
            <GrepCodesModal
              codes={resource.contentMeta?.grepCodes ?? []}
              contentType={contentType}
              contentUri={resource.contentUri}
              revision={resource.contentMeta?.revision}
              currentNodeId={currentNodeId}
            />
            <VersionHistory resource={resource} contentType={contentType} />
            <IconButton
              aria-label={t("form.remove")}
              title={t("form.remove")}
              onClick={() => onDelete(resource.connectionId)}
              size="small"
              variant="danger"
            >
              <TrashCanOutline />
            </IconButton>
          </ControlButtonGroup>
        </BottomRow>
      </StyledListItemContent>
    </StyledListItemRoot>
  );
};

export default Resource;
