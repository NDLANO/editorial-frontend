/* eslint-disable react/prop-types */
/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useMemo, KeyboardEventHandler, FocusEventHandler } from 'react';
import { BaseEditor, createEditor, Descendant } from 'new-slate';
import { Slate, ReactEditor, Editable, withReact } from 'new-slate-react';
import { HistoryEditor, withHistory } from 'new-slate-history';
import isHotkey from 'is-hotkey';

type CustomElement = { type: 'paragraph'; children: CustomText[] };
type CustomText = { text: string };

declare module 'new-slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

const isSaveHotkey = isHotkey('mod+s');

interface SlateEditorProps {
  id?: string;
  autoCorrect?: string;
  autoFocus?: boolean;
  className?: string;
  onChange: (value: Descendant[]) => void;
  placeholder?: string;
  plugins?: any; // TODO: Replace type: any
  readOnly?: boolean;
  role?: string;
  spellCheck?: boolean;
  taxIndex?: number;
  value: Descendant[];
}

interface Props extends Omit<SlateEditorProps, 'onChange'> {
  handleSubmit: () => void;
  onChange: Function;
  onBlur: FocusEventHandler<HTMLDivElement>;
}

const PlainTextEditor: React.FC<Props> = props => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const { onChange, value, handleSubmit, id, className, placeholder, onBlur, ...rest } = props;

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = (e: any) => {
    if (isSaveHotkey(e)) {
      e.preventDefault();
      handleSubmit();
    }
  };

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
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        className={className}
        placeholder={placeholder}
        {...rest}
      />
    </Slate>
  );
};

export default PlainTextEditor;
