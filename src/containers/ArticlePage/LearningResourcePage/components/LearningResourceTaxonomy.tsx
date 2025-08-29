/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from "react";
import { useTranslation } from "react-i18next";
import { Spinner } from "@ndla/primitives";
import { IArticleDTO } from "@ndla/types-backend/draft-api";
import { NodeType, TaxonomyContext } from "@ndla/types-taxonomy";
import { TaxonomyBlock } from "../../../../components/Taxonomy/TaxonomyBlock";
import { TaxonomyConnections } from "../../../../components/Taxonomy/TaxonomyConnections";
import { TaxonomyResourceTypeSelect } from "../../../../components/Taxonomy/TaxonomyResourceTypeSelect";
import { TaxonomyVisibility } from "../../../../components/Taxonomy/TaxonomyVisibility";
import { MinimalNodeChild } from "../../../../components/Taxonomy/types";
import { TAXONOMY_ADMIN_SCOPE } from "../../../../constants";
import { useNodes } from "../../../../modules/nodes/nodeQueries";
import { useAllResourceTypes } from "../../../../modules/taxonomy/resourcetypes/resourceTypesQueries";
import { useVersions } from "../../../../modules/taxonomy/versions/versionQueries";
import { useSession } from "../../../Session/SessionProvider";
import { useTaxonomyVersion } from "../../../StructureVersion/TaxonomyVersionProvider";

interface Props {
  article: IArticleDTO;
  articleLanguage: string;
  hasTaxEntries: boolean;
}

const contextToPlacement = (
  nodeType: NodeType,
  context: TaxonomyContext,
  articleLanguage: string,
): MinimalNodeChild => {
  const crumb = context.breadcrumbs[articleLanguage] ?? Object.values(context.breadcrumbs)[0] ?? [];
  return {
    id: context.parentIds[context.parentIds.length - 1],
    breadcrumbs: crumb,
    relevanceId: context.relevanceId,
    connectionId: context.connectionId,
    isPrimary: context.isPrimary,
    path: context.path.split("/").slice(1).join("/"),
    name: crumb[crumb.length - 1] ?? "",
    metadata: {
      visible: context.isVisible,
    },
    nodeType,
    context,
  };
};

const LearningResourceTaxonomy = ({ article, articleLanguage, hasTaxEntries }: Props) => {
  const { i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const { userPermissions } = useSession();
  const isTaxonomyAdmin = userPermissions?.includes(TAXONOMY_ADMIN_SCOPE);

  const nodesQuery = useNodes({
    contentURI: `urn:article:${article.id}`,
    taxonomyVersion,
    language: articleLanguage,
    includeContexts: true,
  });

  const allResourceTypesQuery = useAllResourceTypes(
    { language: i18n.language, taxonomyVersion },
    { select: (rts) => rts },
  );

  const versionsQuery = useVersions();

  if (nodesQuery.isLoading || allResourceTypesQuery.isLoading || versionsQuery.isLoading) {
    return <Spinner />;
  }

  const node = nodesQuery.data?.[0];
  const placements = node?.contexts
    .filter((c) => c.rootId.includes("subject"))
    .map((c) => contextToPlacement(node.nodeType, c, articleLanguage))
    .toSorted((a, b) => a.id.localeCompare(b.id));

  return (
    <TaxonomyBlock
      key={taxonomyVersion}
      nodes={nodesQuery.data ?? []}
      hasTaxEntries={hasTaxEntries}
      resourceLanguage={articleLanguage}
      resourceId={article.id}
      resourceTitle={article.title?.title ?? ""}
      resourceType="article"
      nodeType="resource"
      versions={versionsQuery.data ?? []}
    >
      {!!node && (
        <>
          {!!isTaxonomyAdmin && (
            <TaxonomyVisibility
              taxonomyVersion={taxonomyVersion}
              articleId={article.id}
              articleLanguage={articleLanguage}
              node={node}
            />
          )}
          <TaxonomyResourceTypeSelect
            blacklistedResourceTypes={["learningpath"]}
            resourceTypes={allResourceTypesQuery.data ?? []}
            articleId={article.id}
            articleLanguage={articleLanguage}
            node={node}
          />
          <TaxonomyConnections
            taxonomyVersion={taxonomyVersion}
            type="resource"
            language={articleLanguage}
            article={article}
            node={node}
            placements={placements ?? []}
          />
        </>
      )}
    </TaxonomyBlock>
  );
};

export default memo(LearningResourceTaxonomy);
