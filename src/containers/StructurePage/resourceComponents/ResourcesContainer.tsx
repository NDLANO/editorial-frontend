/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import keyBy from "lodash/keyBy";
import { useMemo } from "react";
import styled from "@emotion/styled";
import { breakpoints, mq } from "@ndla/core";
import { Spinner } from "@ndla/icons";
import { NodeChild, ResourceType } from "@ndla/types-taxonomy";
import Resource from "./Resource";
import ResourceBanner from "./ResourceBanner";
import ResourceItems from "./ResourceItems";
import { ResourceWithNodeConnectionAndMeta } from "./StructureResources";
import { DRAFT_RESPONSIBLE } from "../../../constants";
import { Dictionary } from "../../../interfaces";
import { useAuth0Responsibles } from "../../../modules/auth0/auth0Queries";
import { NodeResourceMeta, useNodes } from "../../../modules/nodes/nodeQueries";
import { groupResourcesByType } from "../../../util/taxonomyHelpers";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

const ResourceWrapper = styled.div`
  overflow-y: auto;
  ${mq.range({ from: breakpoints.desktop })} {
    max-height: 80vh;
  }
`;

const StyledResource = styled(Resource)`
  margin-left: 44px;
`;

interface Props {
  nodeResources: ResourceWithNodeConnectionAndMeta[];
  resourceTypes: ResourceType[];
  currentNode: NodeChild;
  contentMeta: Dictionary<NodeResourceMeta>;
  grouped: boolean;
  setCurrentNode: (changedNode: NodeChild) => void;
  contentMetaLoading: boolean;
}
const ResourcesContainer = ({
  resourceTypes,
  nodeResources,
  currentNode,
  contentMeta,
  grouped,
  setCurrentNode,
  contentMetaLoading,
}: Props) => {
  const resourceTypesWithoutMissing = useMemo(
    () => resourceTypes.filter((rt) => rt.id !== "missing").map((rt) => ({ id: rt.id, name: rt.name })),
    [resourceTypes],
  );
  const { taxonomyVersion } = useTaxonomyVersion();
  const currentNodeId = currentNode.id;

  const { data: users } = useAuth0Responsibles(
    { permission: DRAFT_RESPONSIBLE },
    { select: (users) => keyBy(users, (u) => u.app_metadata.ndla_id) },
  );

  const { data } = useNodes(
    { contentURI: currentNode.contentUri!, taxonomyVersion },
    { enabled: !!currentNode.contentUri },
  );

  const paths = useMemo(() => data?.map((d) => d.path).filter((d) => !!d) ?? [], [data]);

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
      <ResourceBanner
        resources={nodeResourcesWithMeta}
        title={currentNode.name}
        contentMeta={contentMeta}
        currentNode={currentNode}
        onCurrentNodeChanged={setCurrentNode}
        resourceTypes={resourceTypesWithoutMissing}
      />
      <ResourceWrapper>
        {currentNode.name && (
          <StyledResource
            currentNodeId={currentNode.id}
            responsible={currentMeta?.responsible ? users?.[currentMeta.responsible.responsibleId]?.name : undefined}
            resource={{
              ...currentNode,
              paths,
              contentMeta: currentMeta,
              resourceTypes: [],
              relevanceId: currentNode.relevanceId,
            }}
            contentMetaLoading={contentMetaLoading}
          />
        )}
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
                />
              ))
            ) : (
              <ResourceItems
                resources={nodeResources}
                currentNodeId={currentNodeId}
                contentMeta={contentMeta}
                contentMetaLoading={contentMetaLoading}
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
