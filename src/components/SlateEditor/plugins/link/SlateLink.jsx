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
import { setActiveNode } from '../../createSlateStore';
import { EditorShape } from '../../../../shapes';

const SlateLink = props => {
  const { attributes, editor: { props: { slateStore } }, node } = props;
  const data = node.data.toJS();

  const href =
    data.resource === 'content-link'
      ? `${window.config.editorialFrontendDomain}/article/${data['content-id']}`
      : data.href;

  return (
    <a
      href={href}
      {...attributes}
      onClick={() => slateStore.dispatch(setActiveNode(node))}>
      {props.children}
    </a>
  );
};

SlateLink.propTypes = {
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  editor: EditorShape,
  node: Types.node.isRequired,
};

export default SlateLink;
