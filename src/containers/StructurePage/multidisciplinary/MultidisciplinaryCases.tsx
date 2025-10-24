/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Heading, Spinner } from "@ndla/primitives";
import { Node } from "@ndla/types-taxonomy";
import { keyBy } from "@ndla/util";
import { useChildNodesWithArticleType, useNode, useNodeResourceMetas } from "../../../modules/nodes/nodeQueries";
import { useSearchGrepCodes } from "../../../modules/search/searchQueries";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";
import ResourceItems from "../resourceComponents/ResourceItems";

interface Props {
  currentNode: Node;
}

export const MultidisciplinaryCases = ({ currentNode }: Props) => {
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const childrenQuery = useChildNodesWithArticleType({
    connectionTypes: ["LINK"],
    id: currentNode.id,
    language: i18n.language,
    taxonomyVersion,
    recursive: false,
  });

  const nodeResourceMetasQuery = useNodeResourceMetas(
    {
      nodeId: currentNode.id,
      ids: childrenQuery.data?.map((r) => r.contentUri).filter<string>((uri): uri is string => !!uri) ?? [],
      language: i18n.language,
    },
    { enabled: !!childrenQuery.data?.length },
  );

  const rootNodeQuery = useNode(
    { id: currentNode?.context?.rootId ?? "", language: "nb", taxonomyVersion },
    { enabled: !!currentNode?.context },
  );

  const rootGrepCodes = rootNodeQuery.data?.metadata.grepCodes.filter((code) => code.startsWith("KV"));

  const rootGrepCodesQuery = useSearchGrepCodes({ codes: rootGrepCodes ?? [] }, { enabled: !!rootGrepCodes?.length });

  const rootGrepCodesString = rootGrepCodesQuery.data?.results?.map((c) => `${c.code} - ${c.title.title}`).join(", ");

  const keyedMetas = useMemo(
    () => keyBy(nodeResourceMetasQuery.data, (m) => m.contentUri),
    [nodeResourceMetasQuery.data],
  );

  if (childrenQuery.isLoading) {
    return <Spinner />;
  }

  if (!childrenQuery.data?.length) {
    return null;
  }

  return (
    <>
      <Heading asChild consumeCss textStyle="label.medium" fontWeight="bold">
        <h2>{t("taxonomy.multidisciplinary.title")}</h2>
      </Heading>
      <ResourceItems
        resources={childrenQuery.data}
        currentNodeId={currentNode.id}
        contentMeta={keyedMetas}
        nodeResourcesIsPending={childrenQuery.isPending}
        rootGrepCodesString={rootGrepCodesString}
      />
    </>
  );
};
