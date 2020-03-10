/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useEffect, useMemo, useState } from 'react';
import { isKeyHotkey } from 'is-hotkey';
import BEMHelper from 'react-bem-helper';
import { css } from '@emotion/core';
import { Editable, withReact, useSlate, Slate, RenderElementProps, RenderLeafProps } from 'slate-react';
import { Editor, Node, createEditor } from 'slate';

interface Props {
  onChange: Function;
  submitted: boolean;
  value: Node[];
  removeSection: Function;
  plugins: Array<Object>;
  renderElement: (props: RenderElementProps) => JSX.Element;
  renderLeaf: (props: RenderLeafProps) => JSX.Element;
  placeholder: string;
  onBlur: () => void;
}

const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');

export const classes = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

const slateEditorDivStyle = css`
  position: relative;
`;

const RichTextEditor = (props: Props): JSX.Element => {
  const { submitted, value, onChange, plugins, removeSection, renderElement, renderLeaf, placeholder, onBlur, } = props;
  const [state, setState] = useState({ submitted: false, activeNode: undefined});
  const editor = useMemo(() => withReact(createEditor()), []);

  useEffect(() => {
    setState( { submitted, ...state })
  }, [submitted])

  return (
    <article>
      <div data-cy="slate-editor" css={slateEditorDivStyle}>
        <Slate 
          editor={editor} 
          value={value} 
          onChange={onChange(value)} 
          plugins={plugins}
          slateStore={state}
        >
          <Editable 
            onKeyDown={event => onKeyDown(event, editor, removeSection)}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder={placeholder}
            onBlur={onBlur}
          />
        </Slate>
      </div>
    </article>
  )
}

const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, editor: Editor, removeSection: Function): void => {
  let mark = '';
  const e = event.nativeEvent
  if(isBoldHotkey(e)) {
    mark = 'bold';
  } else if (isItalicHotkey(e)) {
    mark = 'italic';
  } else if (isUnderlinedHotkey(e)) {
    mark = 'underlined';
  } else if (e.key === 'Backspace') {
    if (removeSection) {
      const selection = editor.selection;
      const numberOfNodesInSection = editor.children[0].nodes.size;
      if (
        numberOfNodesInSection === 1 &&
        // value.document.text.length === 0 &&
        // selection.isCollapsed &&
        selection?.anchor.offset === 0
      ) {
        removeSection(editor.index);
        return;
      }
      // Unsure if this is correct, probably not.
      // next();
      return;
    }
  }

  if (mark) {
    e.preventDefault();
    toggleMark(editor, mark)
  } else {
    // Unsure if this is correct, probably not.
    // next()
    return;
  }
}

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

export default RichTextEditor;
