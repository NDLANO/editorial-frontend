/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ResolvedUrl, Node } from "@ndla/types-taxonomy";
import { taxonomyApi } from "../../config";
import { WithTaxonomyVersion } from "../../interfaces";
import { apiResourceUrl, httpFunctions } from "../../util/apiHelpers";
import { postNode, postNodeConnection } from "../nodes/nodeApi";

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
