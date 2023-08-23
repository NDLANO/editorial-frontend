/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { apiResourceUrl, httpFunctions } from '../../../util/apiHelpers';
import { taxonomyApi } from '../../../config';
import { Topic } from '../taxonomyApiInterfaces';
import { WithTaxonomyVersion } from '../../../interfaces';

const baseUrl = apiResourceUrl(`${taxonomyApi}/topics`);

const { fetchAndResolve } = httpFunctions;

interface TopicGetParams extends WithTaxonomyVersion {
  id: string;
  language?: string;
}

const fetchTopic = ({ id, language, taxonomyVersion }: TopicGetParams): Promise<Topic> => {
  return fetchAndResolve({
    url: `${baseUrl}/${id}`,
    taxonomyVersion,
    queryParams: { language },
  });
};

export { fetchTopic };
