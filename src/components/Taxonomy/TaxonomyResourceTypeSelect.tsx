/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Node, ResourceType } from "@ndla/types-taxonomy";
import { partition } from "@ndla/util";
import ResourceTypeSelect, { ResourceTypeWithParent } from "../../containers/ArticlePage/components/ResourceTypeSelect";
import { useTaxonomyVersion } from "../../containers/StructureVersion/TaxonomyVersionProvider";
import {
  useCreateResourceResourceTypeMutation,
  useDeleteResourceResourceTypeMutation,
} from "../../modules/nodes/nodeMutations";
import { nodeQueryKeys } from "../../modules/nodes/nodeQueries";

interface Props {
  resourceTypes: ResourceType[];
  blacklistedResourceTypes: string[];
  articleId: number;
  node: Node;
  articleLanguage: string;
}

export const TaxonomyResourceTypeSelect = ({
  blacklistedResourceTypes,
  resourceTypes,
  articleLanguage,
  node,
  articleId,
}: Props) => {
  const { taxonomyVersion } = useTaxonomyVersion();
  const createResourceResourceTypeMutation = useCreateResourceResourceTypeMutation();
  const deleteResourceResourceTypeMutation = useDeleteResourceResourceTypeMutation();
  const qc = useQueryClient();

  const filteredResourceTypes = useMemo(
    () =>
      resourceTypes
        .filter((rt) => !blacklistedResourceTypes.includes(rt.id))
        .map((rt) => ({
          ...rt,
          subtypes: rt?.subtypes?.filter((st) => !blacklistedResourceTypes.includes(st.id)),
        })) ?? [],
    [blacklistedResourceTypes, resourceTypes],
  );

  const onChangeSelectedResource = async (resourceType: ResourceTypeWithParent) => {
    const [persistedResourceTypes, deletableResourceTypes] = partition(
      node.resourceTypes,
      (rt) => resourceType.id === rt.id || resourceType.parentType?.id === rt.id,
    );

    if (deletableResourceTypes.length) {
      await Promise.all(
        deletableResourceTypes.map((rt) =>
          deleteResourceResourceTypeMutation.mutateAsync({ id: rt.connectionId, taxonomyVersion }),
        ),
      );
    }

    const newResourceTypes = [];

    if (!persistedResourceTypes.some((rt) => rt.id === resourceType.id)) {
      newResourceTypes.push(resourceType);
    }

    if (resourceType.parentType && !persistedResourceTypes.some((rt) => rt.id === resourceType.parentType?.id)) {
      newResourceTypes.push(resourceType.parentType);
    }

    await Promise.all(
      newResourceTypes.map((rt) =>
        createResourceResourceTypeMutation.mutateAsync({
          taxonomyVersion,
          body: { resourceId: node.id, resourceTypeId: rt.id },
        }),
      ),
    );

    await qc.invalidateQueries({
      queryKey: nodeQueryKeys.nodes({
        contentURI: `urn:article:${articleId}`,
        language: articleLanguage,
        taxonomyVersion,
        includeContexts: true,
      }),
    });
  };

  return (
    <ResourceTypeSelect
      availableResourceTypes={filteredResourceTypes}
      selectedResourceType={node.resourceTypes.find((rt) => !!rt.parentId) ?? node.resourceTypes[0]}
      onChangeSelectedResource={onChangeSelectedResource}
    />
  );
};
