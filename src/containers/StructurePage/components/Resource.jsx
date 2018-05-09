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
import { classes } from './ResourceGroup';

const Resource = ({ contentType, name, onDelete }) => (
  <div {...classes('text o-flag o-flag--top')}>
    {contentType && (
      <div key="img" {...classes('icon o-flag__img')}>
        <ContentTypeBadge background type={contentType} />
      </div>
    )}
    <div key="body" {...classes('body o-flag__body')}>
      <h1 {...classes('title')}>{name}</h1>
    </div>
    {onDelete && (
      <Button onClick={onDelete} stripped>
        <RemoveCircle {...classes('deleteIcon')} />
      </Button>
    )}
  </div>
);

Resource.propTypes = {
  contentType: PropTypes.string.isRequired,
  name: PropTypes.string,
  onDelete: PropTypes.func,
};

export default Resource;
