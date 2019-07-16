/*
 * Copyright (c) 2019-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Types from 'slate-prop-types';
import Details from './Details';
import { EditorShape } from '../../../../shapes';
const SlateBlueprint = ({ attributes, children, editor, node }) => (
  <div draggable {...attributes}>
    <Details isBlueprint editor={editor} node={node}>
      {children}
    </Details>
  </div>
);

SlateBlueprint.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  node: Types.node.isRequired,
  editor: EditorShape,
};

export default SlateBlueprint;
