/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ResourceType, ResolvedUrl } from '@ndla/types-taxonomy';
import sortBy from 'lodash/sortBy';
import { apiResourceUrl, httpFunctions } from '../../util/apiHelpers';
import { createResourceResourceType, deleteResourceResourceType } from './resourcetypes';
import { taxonomyApi } from '../../config';
import { WithTaxonomyVersion } from '../../interfaces';
import { TaxNode } from '../../containers/ArticlePage/LearningResourcePage/components/LearningResourceTaxonomy';
import { doDiff } from '../../containers/NodeDiff/diffUtils';
import {
  deleteNodeConnection,
  postNodeConnection,
  putNodeConnection,
  putNodeMetadata,
} from '../nodes/nodeApi';

const baseUrl = apiResourceUrl(taxonomyApi);

const { fetchAndResolve } = httpFunctions;

interface ResourceTypesGetParams extends WithTaxonomyVersion {
  language: string;
}
/* Option items */
const fetchResourceTypes = ({
  language,
  taxonomyVersion,
}: ResourceTypesGetParams): Promise<ResourceType[]> => {
  return fetchAndResolve({
    url: `${baseUrl}/resource-types`,
    taxonomyVersion,
    queryParams: { language },
  });
};

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

export const updateTax = async (
  { node, originalNode }: UpdateTaxParams,
  taxonomyVersion: string,
) => {
  const resourceTypesDiff = doDiff(
    sortBy(originalNode.resourceTypes, (rt) => rt.id),
    sortBy(node.resourceTypes, (rt) => rt.id),
    { connectionId: true, supportedLanguages: true, translations: true },
  );
  const placementDiff = doDiff(
    sortBy(originalNode.placements, (p) => p.id),
    sortBy(node.placements, (p) => p.id),
    { path: true },
  );

  if (placementDiff.changed.diffType !== 'NONE' || node.path !== originalNode.path) {
    await Promise.all(
      placementDiff.diff.map((diff) => {
        if (diff.changed.diffType === 'ADDED') {
          return postNodeConnection({
            body: {
              parentId: diff.id.other!,
              childId: node.id,
              primary: node.path === diff.path.other,
              relevanceId: diff.relevanceId?.other!,
            },
            taxonomyVersion,
          });
        } else if (diff.changed.diffType === 'DELETED') {
          return deleteNodeConnection({ id: diff.id.original!, taxonomyVersion });
        } else if (diff.changed.diffType === 'MODIFIED' || diff.path.other === node.path) {
          return putNodeConnection({
            id: diff.id.original!,
            body: {
              relevanceId: diff.relevanceId?.other!,
              primary: node.path === diff.path.other,
            },
            taxonomyVersion,
          });
        } else return Promise.resolve();
      }),
    );
  }

  if (node.metadata.visible !== originalNode.metadata.visible) {
    await putNodeMetadata({
      id: node.id,
      meta: { visible: node.metadata.visible },
      taxonomyVersion,
    });
  }

  if (resourceTypesDiff.changed.diffType !== 'NONE') {
    const rtPromises = resourceTypesDiff.diff.map((rt) => {
      if (rt.changed.diffType === 'DELETED') {
        return deleteResourceResourceType({ id: rt.connectionId.original!, taxonomyVersion });
      } else if (rt.changed.diffType === 'ADDED') {
        return createResourceResourceType({
          body: { resourceId: node.id, resourceTypeId: rt.id.other! },
          taxonomyVersion,
        });
      } else return Promise.resolve();
    });

    await Promise.all(rtPromises);
  }
};

export { fetchResourceTypes, resolveUrls };
