/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { RemoveCircle } from 'ndla-icons/action';
import { Button, ContentTypeBadge } from 'ndla-ui';
import { ResourceShape } from '../../../shapes';
import { classes } from './ResourceGroup';
import ToggleSwitch from './ToggleSwitch';
import { RESOURCE_FILTER_CORE } from '../../../constants';

const Resource = ({
  contentType,
  resource,
  onDelete,
  toggleRelevance,
  relevance,
}) => (
  <li {...classes('item')}>
    <div {...classes('text o-flag o-flag--top')}>
      <div key="img" {...classes('icon o-flag__img')}>
        <ContentTypeBadge background type={contentType} />
      </div>
      <div key="body" {...classes('body o-flag__body')}>
        <h1 {...classes('title')}>{resource.name}</h1>
      </div>
      {toggleRelevance && (
        <ToggleSwitch
          on={relevance === RESOURCE_FILTER_CORE}
          onClick={toggleRelevance}
          large
          testId={`toggleRelevance-${resource.id}`}
        />
      )}
      <Button onClick={onDelete} stripped>
        <RemoveCircle {...classes('deleteIcon')} />
      </Button>
    </div>
  </li>
);

Resource.propTypes = {
  contentType: PropTypes.string.isRequired,
  resource: ResourceShape,
  classes: PropTypes.func,
  onDelete: PropTypes.func,
  toggleRelevance: PropTypes.func,
  relevance: PropTypes.string,
};

export default Resource;
