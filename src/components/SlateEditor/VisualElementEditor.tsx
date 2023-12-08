/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormikHandlers } from 'formik';
import isEqual from 'lodash/isEqual';
import { useEffect, useMemo } from 'react';
import { Descendant, createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Slate, Editable, withReact, RenderElementProps } from 'slate-react';
import { SlatePlugin } from './interfaces';
import { SlateProvider } from './SlateContext';
import withPlugins from './utils/withPlugins';
import { VisualElementType } from '../../containers/VisualElement/VisualElementMenu';
import VisualElementPicker from '../../containers/VisualElement/VisualElementPicker';

interface Props {
  name: string;
  value: Descendant[];
  plugins: SlatePlugin[];
  onChange: FormikHandlers['handleChange'];
  language: string;
  selectedResource: string;
  resetSelectedResource: () => void;
  types?: VisualElementType[];
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

  useEffect(() => {
    if (!isEqual(editor.children, value)) {
      editor.children = value;
      editor.history = { undos: [], redos: [] };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <SlateProvider>
      <Slate
        editor={editor}
        initialValue={value}
        onChange={(val: Descendant[]) => {
          onChange({
            target: {
              name,
              value: val,
            },
          });
        }}
      >
        <VisualElementPicker editor={editor} types={types} language={language} />
        <Editable
          readOnly={true}
          renderElement={renderElement}
          onDragStart={(e) => {
            e.stopPropagation();
          }}
        />
      </Slate>
    </SlateProvider>
  );
};

export default VisualElementEditor;
