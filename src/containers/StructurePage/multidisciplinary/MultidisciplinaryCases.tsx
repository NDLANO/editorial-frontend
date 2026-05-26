/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Spinner } from "@ndla/primitives";
import { Node } from "@ndla/types-backend/taxonomy-api";
import { keyBy } from "@ndla/util";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { childNodesQueryOptions, nodesResourceMetasQueryOptions } from "../../../modules/nodes/nodeQueries";
import { getContentUriFromSearchSummary } from "../../../util/searchHelpers";
import { getContentUrisFromNodes } from "../../../util/taxonomyHelpers";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";
import ResourceItems from "../resourceComponents/ResourceItems";

interface Props {
  currentNode: Node;
}

export const MultidisciplinaryCases = ({ currentNode }: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const childrenQuery = useQuery(
    childNodesQueryOptions({
      connectionTypes: ["LINK"],
      id: currentNode.id,
      language: i18n.language,
      taxonomyVersion,
      recursive: false,
    }),
  );

  const contentUris = useMemo(() => getContentUrisFromNodes(childrenQuery.data ?? []), [childrenQuery.data]);

  const nodeResourceMetasQuery = useQuery({
    ...nodesResourceMetasQueryOptions({
      nodeId: currentNode.id,
      contentUris: contentUris,
      language: i18n.language,
    }),
    enabled: !!childrenQuery.data?.length && !!contentUris.length && currentNode.nodeType !== "PROGRAMME",
  });

  const keyedMetas = useMemo(
    () => keyBy(nodeResourceMetasQuery.data, (m) => getContentUriFromSearchSummary(m)),
    [nodeResourceMetasQuery.data],
  );

  if (childrenQuery.isLoading) {
    return <Spinner />;
  }

  return (
    <ResourceItems
      title={t("taxonomy.link.title")}
      type="link"
      resources={childrenQuery.data ?? []}
      currentNode={currentNode}
      contentMetas={keyedMetas}
      nodeResourcesIsPending={childrenQuery.isPending}
      existingResourceIds={childrenQuery.data?.map((n) => n.id) ?? []}
    />
  );
};
