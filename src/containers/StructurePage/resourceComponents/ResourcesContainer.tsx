/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Spinner } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { MultiSearchSummaryDTO } from "@ndla/types-backend/search-api";
import { NodeChild, ResourceType } from "@ndla/types-taxonomy";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Auth0UserData, Dictionary } from "../../../interfaces";
import { useNodes } from "../../../modules/nodes/nodeQueries";
import { partitionResources } from "../../../util/taxonomyHelpers";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";
import { MultidisciplinaryCases } from "../multidisciplinary/MultidisciplinaryCases";
import { scrollElementId } from "./isVisibleHook";
import ResourceItems from "./ResourceItems";
import TopicResourceBanner from "./TopicResourceBanner";

const ResourceWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xxlarge",
    overflowY: "auto",
    padding: "xsmall",
    desktop: {
      maxHeight: "80vh",
    },
  },
});

interface Props {
  nodeResources: NodeChild[];
  resourceTypes: ResourceType[];
  currentNode: NodeChild;
  contentMetas: Dictionary<MultiSearchSummaryDTO>;
  isUngrouped: boolean;
  hasSubTopics: boolean;
  nodeResourcesIsPending: boolean;
  users: Dictionary<Auth0UserData> | undefined;
}

const ResourcesContainer = ({
  resourceTypes,
  nodeResources,
  currentNode,
  contentMetas,
  isUngrouped,
  hasSubTopics,
  nodeResourcesIsPending,
  users,
}: Props) => {
  const { t } = useTranslation();
  const resourceTypesWithoutMissing = useMemo(
    () =>
      resourceTypes
        .filter((rt) => rt.id !== "missing")
        .map((rt) => ({
          ...rt,
          subtypes: undefined,
        })),
    [resourceTypes],
  );
  const { taxonomyVersion } = useTaxonomyVersion();

  const { data } = useNodes(
    { contentURI: currentNode.contentUri, taxonomyVersion, includeContexts: true, filterProgrammes: true },
    { enabled: !!currentNode.contentUri },
  );

  const { coreArticles, supplementaryArticles, learningpaths } = partitionResources(
    nodeResources ?? [],
    resourceTypes ?? [],
    isUngrouped,
  );

  const paths = useMemo(() => data?.map((d) => d.path ?? "").filter((d) => !!d) ?? [], [data]);
  const currentMeta = currentNode.contentUri ? contentMetas[currentNode.contentUri] : undefined;

  return (
    <>
      <TopicResourceBanner
        resources={nodeResources}
        contentMetas={contentMetas}
        currentContentMeta={currentMeta}
        currentNode={{ ...currentNode, paths, resourceTypes: [] }}
        nodeResourcesIsPending={nodeResourcesIsPending}
        responsible={currentMeta?.responsible ? users?.[currentMeta.responsible.responsibleId]?.name : undefined}
        topicNodes={data}
      />
      <ResourceWrapper id={scrollElementId}>
        {nodeResourcesIsPending ? (
          <Spinner aria-label={t("loading")} />
        ) : (
          <>
            {!hasSubTopics && (
              <ResourceItems
                type="core"
                title={t("taxonomy.core.title")}
                resources={coreArticles}
                resourceTypes={resourceTypesWithoutMissing}
                currentNode={currentNode}
                contentMetas={contentMetas}
                nodeResourcesIsPending={nodeResourcesIsPending}
                existingResourceIds={nodeResources.map((r) => r.id)}
                users={users}
                isUngrouped={isUngrouped}
              />
            )}
            {!hasSubTopics && (
              <ResourceItems
                type="learningpath"
                title={t("taxonomy.learningpath.title")}
                resources={learningpaths}
                resourceTypes={resourceTypesWithoutMissing}
                currentNode={currentNode}
                contentMetas={contentMetas}
                nodeResourcesIsPending={nodeResourcesIsPending}
                existingResourceIds={nodeResources.map((r) => r.id)}
                users={users}
              />
            )}
            <MultidisciplinaryCases currentNode={currentNode} />
            {!hasSubTopics && (
              <ResourceItems
                type="supplementary"
                title={t("taxonomy.supplementary.title")}
                description={t("taxonomy.supplementary.description")}
                resources={supplementaryArticles}
                resourceTypes={resourceTypesWithoutMissing}
                currentNode={currentNode}
                contentMetas={contentMetas}
                nodeResourcesIsPending={nodeResourcesIsPending}
                existingResourceIds={nodeResources.map((r) => r.id)}
                users={users}
              />
            )}
          </>
        )}
      </ResourceWrapper>
    </>
  );
};

export default ResourcesContainer;
