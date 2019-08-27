/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import SlateToolbar from './SlateToolbar';

export default function toolbarPlugin() {
  const schema = {};
  const renderEditor = (props, editor, next) => {
    // eslint-disable-next-line react/prop-types
    const { onChange, name, index } = props;
    const children = next();
    return (
      <>
        {children}
        <SlateToolbar
          editor={editor}
          onChange={change =>
            onChange(
              {
                target: {
                  name,
                  value: change.value,
                  type: 'SlateEditorValue',
                },
              },
              index,
            )
          }
          name={name}
        />
      </>
    );
  };

  return {
    schema,
    renderEditor,
  };
}
