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
import { styled } from "@ndla/styled-system/jsx";
import { Node } from "@ndla/types-taxonomy";
import { keyBy } from "@ndla/util";
import { useChildNodes, useNodeResourceMetas } from "../../../modules/nodes/nodeQueries";
import { getContentUriFromSearchSummary } from "../../../util/searchHelpers";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";
import ResourceItems from "../resourceComponents/ResourceItems";

interface Props {
  currentNode: Node;
}

const ListContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

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

  if (!childrenQuery.data?.length) {
    return null;
  }

  return (
    <ListContainer>
      <Heading asChild consumeCss textStyle="label.medium" fontWeight="bold">
        <h2>{t("taxonomy.multidisciplinary.title")}</h2>
      </Heading>
      <ResourceItems
        type="link"
        resources={childrenQuery.data}
        currentNodeId={currentNode.id}
        contentMetas={keyedMetas}
        nodeResourcesIsPending={childrenQuery.isPending}
      />
    </ListContainer>
  );
};
