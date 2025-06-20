/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { NodeChild, ResourceType } from "@ndla/types-taxonomy";
import { scrollElementId } from "./isVisibleHook";
import ResourceItems from "./ResourceItems";
import { ResourceWithNodeConnectionAndMeta } from "./StructureResources";
import TopicResourceBanner from "./TopicResourceBanner";
import { Auth0UserData, Dictionary } from "../../../interfaces";
import { NodeResourceMeta, useNodes } from "../../../modules/nodes/nodeQueries";
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
        ) : grouped ? (
          mapping?.map((resource) => (
            <ResourceItems
              key={resource.id}
              resources={resource.resources}
              currentNodeId={currentNodeId}
              contentMeta={contentMeta}
              nodeResourcesIsPending={nodeResourcesIsPending}
              users={users}
            />
          ))
        ) : (
          <ResourceItems
            resources={nodeResources}
            currentNodeId={currentNodeId}
            contentMeta={contentMeta}
            nodeResourcesIsPending={nodeResourcesIsPending}
            users={users}
          />
        )}
      </ResourceWrapper>
    </>
  );
};

export default ResourcesContainer;
