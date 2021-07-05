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
import { Slate, Editable, withReact, RenderElementProps } from 'slate-react';
import { withHistory } from 'slate-history';

import { SlateProvider } from './SlateContext';
import { SlatePlugin } from './interfaces';
import VisualElementPicker from './plugins/visualElementPicker/VisualElementPicker';

interface Props {
  name: string;
  value: Descendant[];
  plugins: SlatePlugin[];
  onChange: FormikHandlers['handleChange'];
  changeVisualElement: (visualElement: string) => void;
  language: string;
  types: string[];
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
  changeVisualElement,
  language,
  types,
}: Props) => {
  const editor = useMemo(() => withHistory(withReact(withPlugins(createEditor(), plugins))), [
    plugins,
  ]);

  const renderElement = (elementProps: RenderElementProps) => {
    const { attributes, children } = elementProps;
    if (editor.renderElement) {
      const ret = editor.renderElement(elementProps);
      if (ret) {
        return ret;
      }
    }
    return <div {...attributes}>{children}</div>;
  };

  return (
    <SlateProvider>
      <Slate
        editor={editor}
        value={value}
        onChange={(val: Descendant[]) => {
          onChange({
            target: {
              name,
              value: val,
              type: 'SlateEditorValue',
            },
          });
        }}>
        {!value.length && (
          <VisualElementPicker
            editor={editor}
            language={language}
            onSelect={changeVisualElement}
            types={types}
          />
        )}
        <Editable renderElement={renderElement} />
      </Slate>
    </SlateProvider>
  );
};

export default VisualElementEditor;
