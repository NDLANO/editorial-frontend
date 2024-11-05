/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { CheckboxCircleFill } from "@ndla/icons/editor";
import { Text, ListItemContent, ListItemHeading, ListItemRoot } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { cva } from "@ndla/styled-system/css";
import { styled } from "@ndla/styled-system/jsx";
import QualityEvaluationGrade from "./QualityEvaluationGrade";
import StatusIcons from "./StatusIcons";
import { ResourceWithNodeConnectionAndMeta } from "./StructureResources";
import VersionHistory from "./VersionHistory";
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

const StyledCheckboxCircleFill = styled(CheckboxCircleFill, {
  base: {
    fill: "surface.success",
    marginInlineStart: "3xsmall",
  },
});

const ContentRow = styled("div", {
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
    flexWrap: "wrap",
    justifyContent: "flex-end",
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
    gap: "4xsmall",
  },
});

const InfoTextWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "5xsmall",
  },
});

interface Props {
  responsible?: string;
  resource: ResourceWithNodeConnectionAndMeta;
  contentMetaLoading: boolean;
  showQuality: boolean;
}

const Resource = ({ resource, contentMetaLoading, responsible, showQuality }: Props) => {
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
        <ContentRow>
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
            />
          </InfoItems>
        </ContentRow>
        <ContentRow>
          <InfoTextWrapper>
            <Text color="text.subtle" textStyle="label.small">
              {t(`contentTypes.${contentType}`)}
            </Text>
            <Text color="text.subtle" aria-hidden>
              |
            </Text>
            <Text color="text.subtle" textStyle="label.small">
              <b>{`${t("form.responsible.label")}: `}</b>
              {responsible ?? t("form.responsible.noResponsible")}
            </Text>
          </InfoTextWrapper>
          <ControlButtonGroup>
            {(resource.contentMeta?.status?.current === PUBLISHED ||
              resource.contentMeta?.status?.other?.includes(PUBLISHED)) && (
              <SafeLink
                target="_blank"
                to={`${config.ndlaFrontendDomain}${path}?versionHash=${taxonomyVersion}`}
                css={linkRecipe.raw()}
              >
                {t("taxonomy.publishedVersion")}
                <StyledCheckboxCircleFill size="small" />
              </SafeLink>
            )}
            <VersionHistory resource={resource} contentType={contentType} />
          </ControlButtonGroup>
        </ContentRow>
      </StyledListItemContent>
    </StyledListItemRoot>
  );
};

export default Resource;
