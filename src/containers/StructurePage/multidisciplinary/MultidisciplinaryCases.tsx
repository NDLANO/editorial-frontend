/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Spinner } from "@ndla/primitives";
import { Node } from "@ndla/types-taxonomy";
import { keyBy } from "@ndla/util";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useChildNodes, useNodeResourceMetas } from "../../../modules/nodes/nodeQueries";
import { getContentUriFromSearchSummary } from "../../../util/searchHelpers";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";
import ResourceItems from "../resourceComponents/ResourceItems";

interface Props {
  currentNode: Node;
}

export const MultidisciplinaryCases = ({ currentNode }: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const childrenQuery = useChildNodes({
    connectionTypes: ["LINK"],
    id: currentNode.id,
    language: i18n.language,
    taxonomyVersion,
    recursive: false,
  });

  const nodeResourceMetasQuery = useNodeResourceMetas(
    {
      nodeId: currentNode.id,
      contentUris: childrenQuery.data?.map((node) => node.contentUri).filter((uri): uri is string => !!uri) ?? [],
      language: i18n.language,
    },
    { enabled: !!childrenQuery.data?.length },
  );

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
