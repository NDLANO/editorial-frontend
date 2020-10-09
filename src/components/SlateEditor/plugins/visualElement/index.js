/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import DisplayVisualElement from '../../../../containers/VisualElement/DisplayVisualElement';
import { getSchemaEmbed } from '../../editorSchema';
export default function visualElementPlugin(options = {}) {
  const schema = {};
  
  /* eslint-disable react/prop-types */
  const renderBlock = (props, editor, next) => {
    const { node } = props;
    const onRemoveClick = e => {
      e.stopPropagation();
      editor.removeNodeByKey(node.key);
      
      const { onChange, name, resetSelectedResource } = options;
      onChange({ target: { name, value: {} } });
      resetSelectedResource();
    };

    const embed = getSchemaEmbed(node);

    switch (node.type) {
      case 'embed':
        return (
          <DisplayVisualElement
            embed={embed}
            onRemoveClick={onRemoveClick}
            changeVisualElement={options.onSelect}
            language={options.language}
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