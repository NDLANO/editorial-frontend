/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ILearningPathV2DTO } from "@ndla/types-backend/learningpath-api";
import { Node, NodeType, TaxonomyContext, Version } from "@ndla/types-taxonomy";
import { TaxonomyBlock } from "../../../components/Taxonomy/TaxonomyBlock";
import { TaxonomyConnections } from "../../../components/Taxonomy/TaxonomyConnections";
import { TaxonomyVisibility } from "../../../components/Taxonomy/TaxonomyVisibility";
import { MinimalNodeChild } from "../../../components/Taxonomy/types";
import { TAXONOMY_ADMIN_SCOPE } from "../../../constants";
import { useSession } from "../../Session/SessionProvider";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

interface Props {
  learningpath: ILearningPathV2DTO;
  nodes: Node[] | undefined;
  versions: Version[] | undefined;
  resourceLanguage: string;
}

const contextToPlacement = (
  nodeType: NodeType,
  context: TaxonomyContext,
  resourceLanguage: string,
): MinimalNodeChild => {
  const crumb = context.breadcrumbs[resourceLanguage] ?? Object.values(context.breadcrumbs)[0] ?? [];
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

export const LearningpathTaxonomy = ({ learningpath, resourceLanguage, nodes, versions }: Props) => {
  const { taxonomyVersion } = useTaxonomyVersion();
  const { userPermissions } = useSession();
  const isTaxonomyAdmin = userPermissions?.includes(TAXONOMY_ADMIN_SCOPE);

  const node = nodes?.[0];
  const placements = node?.contexts
    .filter((c) => c.rootId.includes("subject"))
    .map((c) => contextToPlacement(node.nodeType, c, resourceLanguage))
    .toSorted((a, b) => a.id.localeCompare(b.id));

  return (
    <TaxonomyBlock
      key={taxonomyVersion}
      nodes={nodes ?? []}
      hasTaxEntries={!!node?.contexts.length}
      resourceLanguage={resourceLanguage}
      resourceId={learningpath.id}
      resourceTitle={learningpath.title?.title ?? ""}
      resourceType="learningpath"
      nodeType="resource"
      versions={versions ?? []}
    >
      {!!node && (
        <>
          {!!isTaxonomyAdmin && (
            <TaxonomyVisibility
              resourceType="learningpath"
              taxonomyVersion={taxonomyVersion}
              resourceId={learningpath.id}
              resourceLanguage={resourceLanguage}
              node={node}
            />
          )}
          <TaxonomyConnections
            resourceType="learningpath"
            taxonomyVersion={taxonomyVersion}
            type="resource"
            language={resourceLanguage}
            resourceId={learningpath.id}
            resourceTitle={learningpath.title.title}
            node={node}
            placements={placements ?? []}
          />
        </>
      )}
    </TaxonomyBlock>
  );
};
