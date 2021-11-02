/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useMemo } from 'react';
import { FormikHandlers } from 'formik';
import { Descendant, createEditor, Transforms } from 'slate';
import { Slate, Editable, withReact, RenderElementProps } from 'slate-react';
import { withHistory } from 'slate-history';
import { jsx } from 'slate-hyperscript';

import { SlateProvider } from './SlateContext';
import { SlatePlugin } from './interfaces';
import { TYPE_VISUAL_ELEMENT_PICKER } from './plugins/visualElementPicker';
import withPlugins from './utils/withPlugins';

interface Props {
  name: string;
  value: Descendant[];
  plugins: SlatePlugin[];
  onChange: FormikHandlers['handleChange'];
  changeVisualElement: (visualElement: string) => void;
  language: string;
  selectedResource: string;
  resetSelectedResource: () => void;
}

const VisualElementEditor = ({ name, value, plugins, onChange }: Props) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const editor = useMemo(() => withHistory(withReact(withPlugins(createEditor(), plugins))), []);

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

  useEffect(() => {
    if (editor.children.length === 0) {
      Transforms.insertNodes(
        editor,
        jsx('element', { type: TYPE_VISUAL_ELEMENT_PICKER }, { text: '' }),
        { at: [0] },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor.children]);

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
        <Editable
          renderElement={renderElement}
          onDragStart={e => {
            e.stopPropagation();
          }}
        />
      </Slate>
    </SlateProvider>
  );
};

export default VisualElementEditor;
