/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useMemo, FocusEvent } from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate, Editable, ReactEditor, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { FormikHandlers } from 'formik';
import { SlatePlugin } from './interfaces';
import withPlugins from './utils/withPlugins';

interface Props {
  id: string;
  value: Descendant[];
  onChange: FormikHandlers['handleChange'];
  className?: string;
  placeholder?: string;
  plugins?: SlatePlugin[];
  cy?: string;
}

const PlainTextEditor = ({ onChange, value, id, className, placeholder, plugins, cy }: Props) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const editor = useMemo(() => withHistory(withReact(withPlugins(createEditor(), plugins))), []);

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(val: Descendant[]) => {
        onChange({
          target: {
            name: id,
            value: val,
            type: 'SlateEditorValue',
          },
        });
      }}>
      <Editable
        onBlur={(event: FocusEvent<HTMLDivElement>) => {
          // Forcing slate field to be deselected before selecting new field.
          // Fixes a problem where slate field is not properly focused on click.
          ReactEditor.deselect(editor);
        }}
        // @ts-ignore is-hotkey and editor.onKeyDown does not have matching types
        onKeyDown={editor.onKeyDown}
        className={className}
        placeholder={placeholder}
        data-cy={cy}
      />
    </Slate>
  );
};

export default PlainTextEditor;
