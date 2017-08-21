/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { getSchemaEmbedTag } from './schema';

const SlateLink = props => {
  const {
    attributes,
    node,
  } = props;
  const embedTag = getSchemaEmbedTag(node);

  if (!embedTag || !embedTag.id) {
    return null;
  }

  const href = `${window.config.editorialFrontendDomain}/article/${embedTag.id}`
  return (
    <a href={href} {...attributes} >
      {props.children}
    </a>
  );
};

SlateLink.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  node: PropTypes.shape({
    get: PropTypes.func.isRequired,
  })
};

export default SlateLink;
