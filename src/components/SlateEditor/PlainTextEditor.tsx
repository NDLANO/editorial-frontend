/* eslint-disable react/prop-types */
/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useMemo } from 'react';
import { BaseEditor, createEditor, Descendant, Editor } from 'new-slate';
import { Slate, ReactEditor, Editable, withReact } from 'new-slate-react';
import { HistoryEditor, withHistory } from 'new-slate-history';
import { CustomEditor, CustomText, SlatePlugin } from './interfaces';
import { ParagraphElement } from './plugins/paragraph';
import { SectionElement } from './plugins/blocks';

// TODO: Move to interface file or something
declare module 'new-slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor & CustomEditor;
    Element: ParagraphElement | SectionElement;
    Text: CustomText;
  }
}

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
  onBlur: (event: React.FocusEvent<HTMLDivElement>, editor: Editor) => void;
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
        onBlur={(event: React.FocusEvent<HTMLDivElement>) => onBlur(event, editor)}
        onKeyDown={editor.onKeyDown}
        className={className}
        placeholder={placeholder}
        {...rest}
      />
    </Slate>
  );
};

export default PlainTextEditor;
