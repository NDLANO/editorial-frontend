/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useMemo } from 'react';
import { Editor } from 'slate-react';

import createSlateStore from './createSlateStore';
import { renderBlock } from './slateRendering'

interface Props {
  value: any,
  plugins: any[],
  onChange: Function,
}

const slateStore = createSlateStore();

const VisualElementEditor = ({
  value,
  plugins,
  onChange
}: Props) => {

  const onVisualElementChange = useMemo(() => 
    (change: any) => {
      return onChange({
        target: {
          name,
          value: change.value,
          type: 'VisualElementValue'
        }
      })
    }, []);

  return (
    <Editor
      value={value}
      plugins={plugins}
      slateStore={slateStore}
      renderBlock={renderBlock}
      onChange={onVisualElementChange}
    />
  );
};

export default VisualElementEditor;
