/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useMemo } from 'react';
import { FormikHandlers } from 'formik';
import { Descendant, createEditor } from 'slate';
import { Slate, Editable, withReact, RenderElementProps } from 'slate-react';
import { withHistory } from 'slate-history';

import { SlateProvider } from './SlateContext';
import { SlatePlugin } from './interfaces';
import withPlugins from './utils/withPlugins';
import VisualElementPicker from '../../containers/VisualElement/VisualElementPicker';

interface Props {
  name: string;
  value: Descendant[];
  plugins: SlatePlugin[];
  onChange: FormikHandlers['handleChange'];
  changeVisualElement: (visualElement: string) => void;
  language: string;
  selectedResource: string;
  resetSelectedResource: () => void;
  types?: string[];
}

const VisualElementEditor = ({ name, value, plugins, onChange, types, language }: Props) => {
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
        <VisualElementPicker editor={editor} types={types} language={language} />
        <Editable
          readOnly={true}
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
