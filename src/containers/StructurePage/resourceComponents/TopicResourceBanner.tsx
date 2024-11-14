/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MessageLine } from "@ndla/icons/common";
import { CheckboxCircleLine } from "@ndla/icons/editor";
import { Text } from "@ndla/primitives";
import { SafeLink, SafeLinkIconButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { Node, ResourceType } from "@ndla/types-taxonomy";
import ApproachingRevisionDate from "./ApproachingRevisionDate";
import GrepCodesDialog from "./GrepCodesDialog";
import JumpToStructureButton from "./JumpToStructureButton";
import { linkRecipe } from "./Resource";
import StatusIcons from "./StatusIcons";
import { ResourceWithNodeConnectionAndMeta } from "./StructureResources";
import VersionHistory from "./VersionHistory";
import AverageQualityEvaluation from "../../../components/QualityEvaluation/AverageQualityEvaluation";
import QualityEvaluation from "../../../components/QualityEvaluation/QualityEvaluation";
import { SupplementaryIndicator } from "../../../components/Taxonomy/SupplementaryIndicator";
import config from "../../../config";
import { PUBLISHED, RESOURCE_FILTER_SUPPLEMENTARY } from "../../../constants";
import { Dictionary } from "../../../interfaces";
import { NodeResourceMeta } from "../../../modules/nodes/nodeQueries";
import { stripInlineContentHtmlTags } from "../../../util/formHelper";
import { routes } from "../../../util/routeHelpers";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";
import PlannedResourceModal from "../plannedResource/PlannedResourceModal";

const ResourceGroupBanner = styled("div", {
  base: {
    backgroundColor: "surface.brand.2.subtle",
    borderRadius: "xsmall",
    padding: "small",
    border: "1px solid",
    borderColor: "stroke.subtle",
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    marginBlockEnd: "xsmall",
  },
});

const StyledText = styled(Text, {
  variants: {
    visible: {
      false: {
        fontStyle: "italic",
        color: "text.subtle",
      },
    },
  },
});

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xxsmall",
    alignItems: "center",
  },
});

const ContentWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    alignItems: "center",
    flexWrap: "wrap",
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

const TopRow = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "3xsmall",
    justifyContent: "flex-end",
    "&[data-show-quality='true']": {
      justifyContent: "space-between",
    },
  },
});

const StyledResource = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "4xsmall",
  },
});

const getWorkflowCount = (contentMeta: Dictionary<NodeResourceMeta>) => {
  const contentMetaList = Object.values(contentMeta);
  const workflowCount = contentMetaList.filter((c) => c.status?.current !== PUBLISHED).length;
  return workflowCount;
};

interface Props {
  contentMeta: Dictionary<NodeResourceMeta>;
  currentNode: ResourceWithNodeConnectionAndMeta;
  resources: ResourceWithNodeConnectionAndMeta[];
  resourceTypes: Pick<ResourceType, "id" | "name">[];
  articleIds?: number[];
  contentMetaLoading: boolean;
  responsible: string | undefined;
  topicNodes: Node[] | undefined;
  showQuality: boolean;
}

const TopicResourceBanner = ({
  contentMeta,
  currentNode,
  resourceTypes,
  resources,
  contentMetaLoading,
  responsible,
  topicNodes,
  showQuality,
}: Props) => {
  const { t } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const elementCount = Object.values(contentMeta).length;
  const workflowCount = useMemo(() => getWorkflowCount(contentMeta), [contentMeta]);

  const numericId = parseInt(currentNode.contentUri?.split(":").pop() ?? "");

  const lastCommentTopicArticle = useMemo(
    () => Object.values(contentMeta).find((el) => el.articleType === "topic-article")?.comments?.[0]?.content,
    [contentMeta],
  );

  const contexts = topicNodes?.filter((node) => !!node.contexts.length);
  const isSupplementary = currentNode.relevanceId === RESOURCE_FILTER_SUPPLEMENTARY;

  return (
    <ResourceGroupBanner>
      <TopRow data-show-quality={showQuality}>
        {showQuality && (
          <ContentWrapper>
            <AverageQualityEvaluation gradeAverage={currentNode.gradeAverage} nodeType="TOPIC" />
            <QualityEvaluation articleType="topic-article" taxonomy={[currentNode]} />
          </ContentWrapper>
        )}
        <ContentWrapper>
          <Text color="text.subtle" textStyle="label.small">{`${workflowCount}/${elementCount} ${t(
            "taxonomy.workflow",
          ).toLowerCase()}`}</Text>
          {lastCommentTopicArticle && (
            <MessageLine
              title={stripInlineContentHtmlTags(lastCommentTopicArticle)}
              aria-label={stripInlineContentHtmlTags(lastCommentTopicArticle)}
            />
          )}
          <ApproachingRevisionDate resources={resources} contentMeta={contentMeta} currentNode={currentNode} />
        </ContentWrapper>
        <ControlButtonGroup>
          <JumpToStructureButton nodeId={currentNode.id} />
          <PlannedResourceModal currentNode={currentNode} resourceTypes={resourceTypes} resources={resources} />
        </ControlButtonGroup>
      </TopRow>
      <StyledResource>
        <ContentRow>
          <TextWrapper>
            {numericId ? (
              <SafeLink
                to={routes.topic.edit(numericId, "topic-article")}
                target="_blank"
                rel="noopener noreferrer"
                css={linkRecipe.raw()}
              >
                <StyledText visible={!!currentNode.metadata?.visible}>{currentNode.name}</StyledText>
              </SafeLink>
            ) : (
              <StyledText visible={!!currentNode.metadata?.visible} textStyle="body.link" css={linkRecipe.raw()}>
                {currentNode.name}
              </StyledText>
            )}
            {isSupplementary && <SupplementaryIndicator />}
          </TextWrapper>
          <StatusIcons
            contentMetaLoading={contentMetaLoading}
            resource={currentNode}
            multipleTaxonomy={contexts?.length ? contexts.length > 1 : false}
          />
        </ContentRow>
        <ContentRow>
          <TextWrapper>
            <Text color="text.subtle" textStyle="label.small">
              {t("articleType.topic-article")}
            </Text>
            <Text color="text.subtle" aria-hidden>
              |
            </Text>
            <Text color="text.subtle" textStyle="label.small">
              {responsible ?? t("form.responsible.noResponsible")}
            </Text>
          </TextWrapper>
          <ControlButtonGroup>
            {(currentNode.contentMeta?.status?.current === PUBLISHED ||
              currentNode.contentMeta?.status?.other?.includes(PUBLISHED)) && (
              <SafeLinkIconButton
                target="_blank"
                to={`${config.ndlaFrontendDomain}${currentNode.path}?versionHash=${taxonomyVersion}`}
                aria-label={t("taxonomy.publishedVersion")}
                title={t("taxonomy.publishedVersion")}
                size="small"
                variant="success"
              >
                <CheckboxCircleLine />
              </SafeLinkIconButton>
            )}
            <GrepCodesDialog
              codes={currentNode.contentMeta?.grepCodes ?? []}
              contentType={"topic-article"}
              contentUri={currentNode.contentUri}
              revision={currentNode.contentMeta?.revision}
              currentNodeId={currentNode.id}
            />
            <VersionHistory resource={currentNode} contentType="topic-article" />
          </ControlButtonGroup>
        </ContentRow>
      </StyledResource>
    </ResourceGroupBanner>
  );
};

export default TopicResourceBanner;
