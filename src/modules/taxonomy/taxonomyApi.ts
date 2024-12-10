/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import orderBy from "lodash/orderBy";
import { ResolvedUrl, Node } from "@ndla/types-taxonomy";
import { createResourceResourceType, deleteResourceResourceType } from "./resourcetypes";
import { taxonomyApi } from "../../config";
import { TaxNode } from "../../containers/ArticlePage/LearningResourcePage/components/taxonomy/TaxonomyBlock";
import { doDiff } from "../../containers/NodeDiff/diffUtils";
import { WithTaxonomyVersion } from "../../interfaces";
import { apiResourceUrl, httpFunctions } from "../../util/apiHelpers";
import {
  deleteNodeConnection,
  postNode,
  postNodeConnection,
  putNodeConnection,
  putNodeMetadata,
} from "../nodes/nodeApi";

const baseUrl = apiResourceUrl(taxonomyApi);

const { fetchAndResolve } = httpFunctions;

interface ResolveUrlsParams extends WithTaxonomyVersion {
  path: string;
}

const resolveUrls = ({ path, taxonomyVersion }: ResolveUrlsParams): Promise<ResolvedUrl> => {
  return fetchAndResolve({
    url: `${baseUrl}/url/resolve`,
    taxonomyVersion,
    queryParams: { path },
  });
};

export interface UpdateTaxParams {
  node: TaxNode;
  originalNode: TaxNode;
}

export const updateTax = async ({ node, originalNode }: UpdateTaxParams, taxonomyVersion: string) => {
  const resourceTypesDiff = doDiff(
    originalNode.resourceTypes,
    node.resourceTypes,
    { connectionId: true, supportedLanguages: true, translations: true },
    "id",
  );
  const resourceDiff = doDiff(originalNode.placements, node.placements, { isPrimary: true }, "id");

  const primaryConnection = node.placements.find((p) => p.isPrimary);
  const originalPrimary = originalNode.placements.find((p) => p.isPrimary);

  const diffChanged = primaryConnection?.connectionId !== originalPrimary?.connectionId;

  if (resourceDiff.changed.diffType !== "NONE" || diffChanged) {
    const placementDiff = orderBy(resourceDiff.diff, (d) => d.isPrimary.other, "desc");
    for (const diff of placementDiff) {
      if (diff.changed.diffType === "ADDED") {
        await postNodeConnection({
          body: {
            parentId: diff.id.other!,
            childId: node.id,
            primary: diff.isPrimary.other!,
            relevanceId: diff.relevanceId?.other,
          },
          taxonomyVersion,
        });
      } else if (diff.changed.diffType === "DELETED") {
        await deleteNodeConnection({
          id: diff.connectionId.original!,
          taxonomyVersion,
        });
      } else if (
        diff.changed.diffType === "MODIFIED" ||
        (diffChanged && diff.connectionId.other === primaryConnection?.connectionId)
      ) {
        await putNodeConnection({
          id: diff.connectionId.original!,
          body: {
            primary: diff.isPrimary.other!,
            relevanceId: diff.relevanceId?.other,
          },
          taxonomyVersion,
        });
      }
    }
  }

  if (node.metadata.visible !== originalNode.metadata.visible) {
    await putNodeMetadata({
      id: node.id,
      meta: { visible: node.metadata.visible },
      taxonomyVersion,
    });
  }

  if (resourceTypesDiff.changed.diffType !== "NONE") {
    const rtPromises = resourceTypesDiff.diff.map((rt) => {
      if (rt.changed.diffType === "DELETED") {
        return deleteResourceResourceType({
          id: rt.connectionId.original!,
          taxonomyVersion,
        });
      } else if (rt.changed.diffType === "ADDED") {
        return createResourceResourceType({
          body: { resourceId: node.id, resourceTypeId: rt.id.other! },
          taxonomyVersion,
        });
      } else return Promise.resolve();
    });

    await Promise.all(rtPromises);
  }
};

export interface CreateTopicNodeConnections extends WithTaxonomyVersion {
  articleId: number;
  name: string;
  placements: Node[];
}

export const createTopicNodeConnections = async ({
  articleId,
  name,
  placements,
  taxonomyVersion,
}: CreateTopicNodeConnections) => {
  const placementPromises = placements.map(async (placement) => {
    const location = await postNode({
      body: {
        contentUri: `urn:article:${articleId}`,
        name: name,
        nodeType: "TOPIC",
        visible: false,
      },
      taxonomyVersion,
    });

    const nodeId = location.replace("/v1/nodes/", "");
    await postNodeConnection({
      body: {
        childId: nodeId,
        parentId: placement.id,
      },
      taxonomyVersion,
    });
  });
  await Promise.resolve(placementPromises);
};

export { resolveUrls };
