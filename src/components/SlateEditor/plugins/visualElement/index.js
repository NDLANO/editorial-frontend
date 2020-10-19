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
  const schema = {
    blocks: {
      embed: {
        isVoid: true,
      },
    },
  };

  /* eslint-disable react/prop-types */
  const renderBlock = (props, editor, next) => {
    const { node } = props;
    const { onRemove, onChange, changeVisualElement, language } = options;

    const onRemoveClick = e => {
      e.stopPropagation();
      editor.removeNodeByKey(node.key);
      onRemove();
    };

    const embed = getSchemaEmbed(node);

    switch (node.type) {
      case 'embed':
        return (
          <DisplayVisualElement
            embed={embed}
            onRemoveClick={onRemoveClick}
            onChange={onChange}
            changeVisualElement={changeVisualElement}
            language={language}
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
