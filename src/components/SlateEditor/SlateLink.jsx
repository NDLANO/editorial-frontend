/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Types from 'slate-prop-types';
import { getSchemaEmbed } from './schema';

const SlateLink = props => {
  const { attributes, node } = props;
  const embed = getSchemaEmbed(node);

  const href = `${window.config.editorialFrontendDomain}/article/${embed.id}`;
  return (
    <a href={href} {...attributes}>
      {props.children}
    </a>
  );
};

SlateLink.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  node: Types.node.isRequired,
};

export default SlateLink;
