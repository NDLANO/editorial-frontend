/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Heading, Spinner } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { NodeChild, ResourceType } from "@ndla/types-taxonomy";
import { scrollElementId } from "./isVisibleHook";
import ResourceItems from "./ResourceItems";
import TopicResourceBanner from "./TopicResourceBanner";
import { Auth0UserData, Dictionary } from "../../../interfaces";
import { NodeResourceMeta, ResourceWithNodeConnectionAndMeta } from "../../../modules/nodes/nodeApiTypes";
import { useNode, useNodes } from "../../../modules/nodes/nodeQueries";
import { useSearchGrepCodes } from "../../../modules/search/searchQueries";
import { groupResourcesByType } from "../../../util/taxonomyHelpers";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

const ResourceWrapper = styled("div", {
  base: {
    overflowY: "auto",
    desktop: {
      maxHeight: "80vh",
    },
  },
});

const ListContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

interface Props {
  nodeResources: ResourceWithNodeConnectionAndMeta[];
  resourceTypes: ResourceType[];
  currentNode: NodeChild;
  contentMeta: Dictionary<NodeResourceMeta>;
  grouped: boolean;
  nodeResourcesIsPending: boolean;
  users: Dictionary<Auth0UserData> | undefined;
}

const ResourcesContainer = ({
  resourceTypes,
  nodeResources,
  currentNode,
  contentMeta,
  grouped,
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
  const currentNodeId = currentNode.id;

  const rootNodeQuery = useNode(
    { id: currentNode?.context?.rootId ?? "", language: "nb", taxonomyVersion },
    { enabled: !!currentNode?.context },
  );

  const rootGrepCodes = rootNodeQuery.data?.metadata.grepCodes.filter((code) => code.startsWith("KV"));

  const rootGrepCodesQuery = useSearchGrepCodes({ codes: rootGrepCodes ?? [] }, { enabled: !!rootGrepCodes?.length });

  const rootGrepCodesString = rootGrepCodesQuery.data?.results?.map((c) => `${c.code} - ${c.title.title}`).join(", ");

  const { data } = useNodes(
    { contentURI: currentNode.contentUri, taxonomyVersion, includeContexts: true, filterProgrammes: true },
    { enabled: !!currentNode.contentUri },
  );

  const paths = useMemo(() => data?.map((d) => d.path ?? "").filter((d) => !!d) ?? [], [data]);

  const nodeResourcesWithMeta: ResourceWithNodeConnectionAndMeta[] =
    useMemo(
      () =>
        nodeResources?.map((res) => ({
          ...res,
          contentMeta: res.contentUri ? contentMeta[res.contentUri] : undefined,
        })),
      [contentMeta, nodeResources],
    ) ?? [];
  const mapping = groupResourcesByType(nodeResourcesWithMeta ?? [], resourceTypes ?? []);
  const currentMeta = currentNode.contentUri ? contentMeta[currentNode.contentUri] : undefined;

  return (
    <>
      <TopicResourceBanner
        resources={nodeResourcesWithMeta}
        contentMeta={contentMeta}
        resourceTypes={resourceTypesWithoutMissing}
        rootGrepCodesString={rootGrepCodesString}
        currentNode={{
          ...currentNode,
          paths,
          contentMeta: currentMeta,
          resourceTypes: [],
          relevanceId: currentNode.relevanceId,
        }}
        nodeResourcesIsPending={nodeResourcesIsPending}
        responsible={currentMeta?.responsible ? users?.[currentMeta.responsible.responsibleId]?.name : undefined}
        topicNodes={data}
      />
      <ResourceWrapper id={scrollElementId}>
        {nodeResourcesIsPending ? (
          <Spinner aria-label={t("loading")} />
        ) : (
          <ListContainer>
            <Heading asChild consumeCss textStyle="label.medium" fontWeight="bold">
              <h2>{t("taxonomy.learningResources")}</h2>
            </Heading>
            {grouped ? (
              mapping?.map((resource) => (
                <ResourceItems
                  type="resource"
                  key={resource.id}
                  resources={resource.resources}
                  currentNodeId={currentNodeId}
                  contentMeta={contentMeta}
                  nodeResourcesIsPending={nodeResourcesIsPending}
                  users={users}
                  rootGrepCodesString={rootGrepCodesString}
                />
              ))
            ) : (
              <ResourceItems
                type="resource"
                resources={nodeResources}
                currentNodeId={currentNodeId}
                contentMeta={contentMeta}
                nodeResourcesIsPending={nodeResourcesIsPending}
                users={users}
                rootGrepCodesString={rootGrepCodesString}
              />
            )}
          </ListContainer>
        )}
      </ResourceWrapper>
    </>
  );
};

export default ResourcesContainer;
