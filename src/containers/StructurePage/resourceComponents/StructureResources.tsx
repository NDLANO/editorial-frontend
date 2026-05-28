/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { NodeChild } from "@ndla/types-backend/taxonomy-api";
import { keyBy, partition } from "@ndla/util";
import { useQuery } from "@tanstack/react-query";
import { TFunction } from "i18next";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Auth0UserData, Dictionary } from "../../../interfaces";
import { childNodesQueryOptions, nodesResourceMetasQueryOptions } from "../../../modules/nodes/nodeQueries";
import { getContentUriFromSearchSummary } from "../../../util/searchHelpers";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";
import ResourcesContainer from "./ResourcesContainer";

interface Props {
  currentChildNode: NodeChild;
  users: Dictionary<Auth0UserData> | undefined;
}

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
  const numbered = currentChildNode?.metadata?.customFields["numbered"] === "true";

  const { data: nodeChildren, isPending: nodeResourcesIsPending } = useQuery({
    ...childNodesQueryOptions({
      id: currentChildNode.id,
      language: i18n.language,
      nodeType: ["RESOURCE", "TOPIC"],
      isVisible: false,
      taxonomyVersion,
    }),
    select: (resources) => resources.map((r) => (r.resourceTypes.length > 0 ? r : withMissing(r, t))),
  });

  const [nodeResources, nodeTopics] = partition(nodeChildren, (n) => n.nodeType === "RESOURCE");

  const { data: nodeResourceMetas, isPending: contentMetaIsPending } = useQuery({
    ...nodesResourceMetasQueryOptions({
      nodeId: currentChildNode.id,
      contentUris:
        nodeResources
          ?.map((n) => n.contentUri)
          .concat(currentChildNode.contentUri)
          .filter((uri): uri is string => !!uri) ?? [],
      language: i18n.language,
    }),
    enabled: !!currentChildNode.contentUri || (!!nodeChildren && !!nodeChildren?.length),
  });

  const keyedMetas = useMemo(
    () => keyBy(nodeResourceMetas, (m) => getContentUriFromSearchSummary(m)),
    [nodeResourceMetas],
  );

  const hasSubTopics = nodeTopics?.length > 0 || false;

  return (
    <ResourcesContainer
      nodeResources={nodeResources ?? []}
      currentNode={currentChildNode}
      contentMetas={keyedMetas}
      numbered={numbered}
      hasSubTopics={hasSubTopics}
      nodeResourcesIsPending={contentMetaIsPending || nodeResourcesIsPending}
      users={users}
    />
  );
};

export default memo(StructureResources);
