/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const transformQuery = ({
  'resource-types': resourceTypes,
  ...rest
}) => {
  const query = { ...rest };

  if (resourceTypes === 'topic-article') {
    query['context-types'] = resourceTypes;
  } else if (resourceTypes) {
    query['resource-types'] = resourceTypes;
  }

  return query;
};
