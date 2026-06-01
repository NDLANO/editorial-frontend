/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { NodeChild, ResourceType } from "@ndla/types-backend/taxonomy-api";
import { keyBy, partition } from "@ndla/util";
import { useQuery } from "@tanstack/react-query";
import { TFunction } from "i18next";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Auth0UserData, Dictionary } from "../../../interfaces";
import {
  childNodesQueryOptions,
  convertContentUrisToSearchParams,
  extrapolateNodeResourcesFromSearch,
} from "../../../modules/nodes/nodeQueries";
import { searchQueryOptions } from "../../../modules/search/searchQueries";
import { resourceTypesQueryOptions } from "../../../modules/taxonomy/resourcetypes/resourceTypesQueries";
import { getContentUriFromSearchSummary } from "../../../util/searchHelpers";
import { getContentUrisFromNodes } from "../../../util/taxonomyHelpers";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";
import ResourcesContainer from "./ResourcesContainer";

interface Props {
  currentChildNode: NodeChild;
  users: Dictionary<Auth0UserData> | undefined;
}

const getMissingResourceType = (t: TFunction): ResourceType & { disabled?: boolean } => ({
  id: "missing",
  name: t("taxonomy.missingResourceType"),
  disabled: true,
  supportedLanguages: [],
  translations: [],
  subtypes: [],
});

const withMissing = (r: NodeChild, t: TFunction): NodeChild => ({
  ...r,
  resourceTypes: [
    {
      id: "missing",
      name: t("taxonomy.missingResourceType"),
      connectionId: "",
      parentId: "",
      supportedLanguages: [],
      translations: [],
    },
  ],
});

const StructureResources = ({ currentChildNode, users }: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const isUngrouped = currentChildNode?.metadata?.customFields["topic-resources"] === "ungrouped";

  const { data: nodeChildren, isLoading: nodeResourcesIsPending } = useQuery({
    ...childNodesQueryOptions({
      id: currentChildNode.id,
      language: i18n.language,
      nodeType: ["RESOURCE", "TOPIC"],
      includeContexts: true,
      filterProgrammes: true,
      isVisible: false,
      taxonomyVersion,
    }),
    select: (resources) => resources.map((r) => (r.resourceTypes.length > 0 ? r : withMissing(r, t))),
  });

  const [nodeResources, nodeTopics] = partition(nodeChildren, (n) => n.nodeType === "RESOURCE");

  const contentUris = useMemo(
    () => getContentUrisFromNodes([...nodeResources, currentChildNode]),
    [currentChildNode, nodeResources],
  );

  const { data: nodeResourceMetas, isLoading: contentMetaIsPending } = useQuery({
    ...searchQueryOptions({
      language: i18n.language,
      ...convertContentUrisToSearchParams(contentUris),
    }),
    select: (data) => extrapolateNodeResourcesFromSearch(contentUris, data.results),
    enabled: !!nodeChildren?.length && !!contentUris.length && currentChildNode.nodeType !== "PROGRAMME",
  });

  const keyedMetas = useMemo(
    () => keyBy(nodeResourceMetas, (m) => getContentUriFromSearchSummary(m)),
    [nodeResourceMetas],
  );

  const { data: resourceTypes } = useQuery({
    ...resourceTypesQueryOptions({ language: i18n.language, taxonomyVersion }),
    select: (resourceTypes) => resourceTypes.concat(getMissingResourceType(t)),
  });

  const hasSubTopics = nodeTopics?.length > 0 || false;

  return (
    <ResourcesContainer
      nodeResources={nodeResources ?? []}
      resourceTypes={resourceTypes ?? []}
      currentNode={currentChildNode}
      contentMetas={keyedMetas}
      isUngrouped={isUngrouped}
      hasSubTopics={hasSubTopics}
      nodeResourcesIsPending={contentMetaIsPending || nodeResourcesIsPending}
      users={users}
    />
  );
};

export default memo(StructureResources);
