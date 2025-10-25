/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { Spinner, Text } from "@ndla/primitives";
import { IArticleDTO } from "@ndla/types-backend/draft-api";
import { NodeType, ResourceType, TaxonomyContext } from "@ndla/types-taxonomy";
import { TaxonomyBlock } from "../../../../components/Taxonomy/TaxonomyBlock";
import { TaxonomyConnections } from "../../../../components/Taxonomy/TaxonomyConnections";
import { TaxonomyResourceTypeSelect } from "../../../../components/Taxonomy/TaxonomyResourceTypeSelect";
import { TaxonomyVisibility } from "../../../../components/Taxonomy/TaxonomyVisibility";
import { MinimalNodeChild } from "../../../../components/Taxonomy/types";
import { RESOURCE_TYPE_LEARNING_PATH, TAXONOMY_ADMIN_SCOPE } from "../../../../constants";
import {
  useCreateResourceResourceTypeMutation,
  useDeleteResourceResourceTypeMutation,
} from "../../../../modules/nodes/nodeMutations";
import { nodeQueryKeys, useNodes } from "../../../../modules/nodes/nodeQueries";
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
  const { t, i18n } = useTranslation();
  const { taxonomyVersion } = useTaxonomyVersion();
  const { userPermissions } = useSession();
  const isTaxonomyAdmin = userPermissions?.includes(TAXONOMY_ADMIN_SCOPE);
  const createResourceResourceTypeMutation = useCreateResourceResourceTypeMutation();
  const deleteResourceResourceTypeMutation = useDeleteResourceResourceTypeMutation();
  const qc = useQueryClient();

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

  const node = nodesQuery.data?.[0];

  const onResourceTypeChanged = async (resourceTypes: ResourceType[]) => {
    if (!node) return;

    // If we update taxonomy-api we can simply send in these IDs.

    const deletedResourceTypes = node.resourceTypes.filter(
      (resourceType) => !resourceTypes.some((rt) => rt.id === resourceType.id),
    );

    const addedResourceTypes = resourceTypes.filter(
      (resourceType) => !node.resourceTypes.some((rt) => rt.id === resourceType.id),
    );

    if (deletedResourceTypes.length) {
      await Promise.all(
        deletedResourceTypes.map((rt) =>
          deleteResourceResourceTypeMutation.mutateAsync({ id: rt.connectionId, taxonomyVersion }),
        ),
      );
    }

    if (addedResourceTypes.length) {
      await Promise.all(
        addedResourceTypes.map((rt) =>
          createResourceResourceTypeMutation.mutateAsync({
            taxonomyVersion,
            body: { resourceId: node.id, resourceTypeId: rt.id },
          }),
        ),
      );
    }

    await qc.invalidateQueries({
      queryKey: nodeQueryKeys.nodes({
        contentURI: `urn:article:${article.id}`,
        language: articleLanguage,
        taxonomyVersion,
        includeContexts: true,
      }),
    });
  };

  const versionsQuery = useVersions();

  if (nodesQuery.isLoading || allResourceTypesQuery.isLoading || versionsQuery.isLoading) {
    return <Spinner />;
  }

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
              resourceType="article"
              taxonomyVersion={taxonomyVersion}
              resourceId={article.id}
              resourceLanguage={articleLanguage}
              node={node}
            />
          )}
          {!node.resourceTypes.length && <Text color="text.error">{t("errorMessage.missingResourceType")}</Text>}
          <TaxonomyResourceTypeSelect
            blacklistedResourceTypes={[RESOURCE_TYPE_LEARNING_PATH]}
            onResourceTypeChanged={onResourceTypeChanged}
            resourceTypes={allResourceTypesQuery.data ?? []}
            value={node.resourceTypes}
          />
          <TaxonomyConnections
            taxonomyVersion={taxonomyVersion}
            type="resource"
            resourceType="article"
            language={articleLanguage}
            resourceId={article.id}
            resourceTitle={article.title?.title ?? ""}
            node={node}
            placements={placements ?? []}
          />
        </>
      )}
    </TaxonomyBlock>
  );
};

export default memo(LearningResourceTaxonomy);
