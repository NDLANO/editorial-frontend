/* eslint-disable react/prop-types */
/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useMemo, FocusEvent } from 'react';
import { createEditor, Descendant, Editor } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { SlatePlugin } from './interfaces';

interface SlateEditorProps {
  id?: string;
  autoCorrect?: string;
  autoFocus?: boolean;
  className?: string;
  onChange: (value: Descendant[]) => void;
  placeholder?: string;
  plugins?: SlatePlugin[];
  readOnly?: boolean;
  role?: string;
  spellCheck?: boolean;
  taxIndex?: number;
  value: Descendant[];
}

interface Props extends Omit<SlateEditorProps, 'onChange'> {
  handleSubmit: () => void;
  onChange: Function;
  onBlur: (event: FocusEvent<HTMLDivElement>, editor: Editor) => void;
}

const withPlugins = (editor: Editor, plugins?: SlatePlugin[]) => {
  if (plugins) {
    return plugins.reduce((editor, plugin) => plugin(editor), editor);
  }
  return editor;
};

const PlainTextEditor: React.FC<Props> = props => {
  const {
    onChange,
    value,
    handleSubmit,
    id,
    className,
    placeholder,
    onBlur,
    plugins,
    ...rest
  } = props;
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
        onBlur={(event: FocusEvent<HTMLDivElement>) => onBlur(event, editor)}
        onKeyDown={(editor.onKeyDown as unknown) as React.KeyboardEventHandler<HTMLDivElement>}
        className={className}
        placeholder={placeholder}
        {...rest}
      />
    </Slate>
  );
};

export default PlainTextEditor;
