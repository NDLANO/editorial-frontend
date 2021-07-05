/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useMemo } from 'react';
import { FormikHandlers } from 'formik';
import { Descendant, Editor, createEditor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';

import { SlateProvider } from './SlateContext';
import { renderBlock } from './slateRendering';
import { VisualElement } from '../../interfaces';
import { SlatePlugin } from './interfaces';

interface Props {
  name: string;
  value: Descendant[];
  plugins: SlatePlugin[];
  onChange: FormikHandlers['handleChange'];
}

//TODO: Move to util
const withPlugins = (editor: Editor, plugins?: SlatePlugin[]) => {
  if (plugins) {
    return plugins.reduce((editor, plugin) => plugin(editor), editor);
  }
  return editor;
};

const VisualElementEditor = ({
  name,
  value,
  plugins,
  onChange,
}: Props) => {
  const editor = useMemo(
    () => withHistory(withReact(createEditor())),
    [],
  );

  return (
    <SlateProvider>
      <Slate
        editor={editor}
        value={value}
        onChange={(val: Descendant[]) => {
          onChange({
            target: {
              value: val,
              type: 'SlateEditorValue',
            },
          });
        }}>
      </Slate>

    </SlateProvider>
  );
}

export default VisualElementEditor;
