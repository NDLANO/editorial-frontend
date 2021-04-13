/* eslint-disable react/prop-types */
/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useMemo, KeyboardEventHandler, FocusEventHandler } from 'react';
import { BaseEditor, createEditor, Descendant, Editor } from 'new-slate';
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

interface Hotkey {
  isKey: (e: KeyboardEvent) => boolean;
  action: (e: KeyboardEvent, editor: Editor) => void;
}

const isSaveHotkey = isHotkey('mod+s');

interface SlateEditorProps {
  id?: string;
  autoCorrect?: string;
  autoFocus?: boolean;
  className?: string;
  onChange: (value: Descendant[]) => void;
  placeholder?: string;
  hotkeys?: Hotkey[]; // TODO: Replace type: any
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
  const {
    onChange,
    value,
    handleSubmit,
    id,
    className,
    placeholder,
    onBlur,
    hotkeys,
    ...rest
  } = props;

  const saveHotkey: Hotkey = {
    isKey: e => isSaveHotkey(e),
    action: e => {
      e.preventDefault();
      handleSubmit();
    },
  };

  const hotkeyList: Hotkey[] = [...(hotkeys ? hotkeys : []), saveHotkey];

  const onKeyDown: KeyboardEventHandler<HTMLDivElement> = (e: any) => {
    hotkeyList.forEach(hotkey => {
      if (hotkey.isKey(e)) {
        hotkey.action(e, editor);
      }
    });
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
