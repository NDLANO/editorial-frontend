/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import styled from "@emotion/styled";
import { breakpoints, mq } from "@ndla/core";
import { Spinner } from "@ndla/primitives";
import { NodeChild, ResourceType } from "@ndla/types-taxonomy";
import ResourceItems from "./ResourceItems";
import { ResourceWithNodeConnectionAndMeta } from "./StructureResources";
import TopicResourceBanner from "./TopicResourceBanner";
import { Auth0UserData, Dictionary } from "../../../interfaces";
import { NodeResourceMeta, useNodes } from "../../../modules/nodes/nodeQueries";
import { groupResourcesByType } from "../../../util/taxonomyHelpers";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

const ResourceWrapper = styled.div`
  overflow-y: auto;
  ${mq.range({ from: breakpoints.desktop })} {
    max-height: 80vh;
  }
`;

interface Props {
  nodeResources: ResourceWithNodeConnectionAndMeta[];
  resourceTypes: ResourceType[];
  currentNode: NodeChild;
  contentMeta: Dictionary<NodeResourceMeta>;
  grouped: boolean;
  contentMetaLoading: boolean;
  showQuality: boolean;
  users: Dictionary<Auth0UserData> | undefined;
}
const ResourcesContainer = ({
  resourceTypes,
  nodeResources,
  currentNode,
  contentMeta,
  grouped,
  contentMetaLoading,
  showQuality,
  users,
}: Props) => {
  const resourceTypesWithoutMissing = useMemo(
    () => resourceTypes.filter((rt) => rt.id !== "missing").map((rt) => ({ id: rt.id, name: rt.name })),
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
        contentMetaLoading={contentMetaLoading}
        responsible={currentMeta?.responsible ? users?.[currentMeta.responsible.responsibleId]?.name : undefined}
        topicNodes={data}
        showQuality={showQuality}
      />
      <ResourceWrapper>
        {contentMetaLoading ? (
          <Spinner />
        ) : (
          <>
            {grouped ? (
              mapping?.map((resource) => (
                <ResourceItems
                  key={resource.id}
                  resources={resource.resources}
                  currentNodeId={currentNodeId}
                  contentMeta={contentMeta}
                  contentMetaLoading={contentMetaLoading}
                  users={users}
                  showQuality={showQuality}
                />
              ))
            ) : (
              <ResourceItems
                resources={nodeResources}
                currentNodeId={currentNodeId}
                contentMeta={contentMeta}
                contentMetaLoading={contentMetaLoading}
                users={users}
                showQuality={showQuality}
              />
            )}
          </>
        )}
      </ResourceWrapper>
    </>
  );
};

export default ResourcesContainer;
