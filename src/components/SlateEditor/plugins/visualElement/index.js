/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import DisplayVisualElement from '../../../../containers/VisualElement/DisplayVisualElement';
import SlateFigure from '../embed/SlateFigure';
import { getSchemaEmbed } from '../../editorSchema';
export default function visualElementPlugin(options = {}) {
  const schema = {
    blocks: {
      embed: {
        isVoid: true,
      },
    },
  };

  /* eslint-disable react/prop-types */
  const renderBlock = (props, editor, next) => {
    const { node, attributes, isSelected } = props;
    const { language } = options;


    switch (node.type) {
      case 'embed':
        return (
          <SlateFigure
            attributes={attributes}
            editor={props.editor}
            isSelected={isSelected}
            language={language}
            node={node}
          />
        );
      default:
        return next();
    }
  };

  return {
    schema,
    renderBlock,
  };
}
