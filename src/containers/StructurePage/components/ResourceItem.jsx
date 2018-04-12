/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { ResourceShape } from '../../../shapes';

const classes = new BEMHelper({
  name: 'topic-resource',
  prefix: 'c-',
});

const Resource = ({ icon, resource }) => (
  <li {...classes('item')}>
    <div {...classes('text o-flag o-flag--top')}>
      <div key="img" {...classes('icon o-flag__img')}>
        {icon}
      </div>
      <div key="body" {...classes('body o-flag__body')}>
        <h1 {...classes('title')}>{resource.name}</h1>
      </div>
    </div>
  </li>
);

Resource.propTypes = {
  icon: PropTypes.node.isRequired,
  resource: PropTypes.shape(ResourceShape),
};

const ResourceItem = ({ icon, resources }) => (
  <ul {...classes('list')}>
    {resources.map(resource => (
      <Resource key={resource.id} {...{ icon, resource }} />
    ))}
  </ul>
);

ResourceItem.propTypes = {
  icon: PropTypes.node.isRequired,
  resources: PropTypes.arrayOf(ResourceShape),
};

export default ResourceItem;
