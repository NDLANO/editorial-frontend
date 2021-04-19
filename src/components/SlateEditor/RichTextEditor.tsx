/* eslint-disable react/prop-types */
/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useMemo } from 'react';
import { BaseEditor, createEditor, Descendant, Editor } from 'new-slate';
import { Slate, ReactEditor, Editable, withReact } from 'new-slate-react';
import { HistoryEditor, withHistory } from 'new-slate-history';
import { CustomEditor, SlatePlugin } from './interfaces';

import isHotkey from 'is-hotkey';
import BEMHelper from 'react-bem-helper';
import { css } from '@emotion/core';
import { SlateProvider } from './SlateContext';
import { PluginShape } from '../../shapes';

export const classes = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

const slateEditorDivStyle = css`
  position: relative;
`;

interface SlateEditorProps {
  id?: string;
  index: number;
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
  submitted: boolean;
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

const RichTextEditor: React.FC<Props> = props => {
  const {
    children,
    className,
    id,
    onBlur,
    placeholder,
    plugins,
    value,
    onChange,
    handleSubmit,
    submitted,
    index,
    ...rest
  } = props;
  const editor = useMemo(() => withHistory(withReact(withPlugins(createEditor(), plugins))), []);

  // TODO: Add as plugin
  // const onKeyDown = (e, editor, next) => {
  //   const { value } = editor;
  //   if (isHotkey('mod+s', e)) {
  //     e.preventDefault();
  //     this.props.handleSubmit();
  //   } else if (e.key === 'Backspace') {
  //     const { removeSection, index } = this.props;
  //     if (removeSection) {
  //       const { selection } = value;
  //       const numberOfNodesInSection = value.document.nodes.first().nodes.size;
  //       if (
  //         numberOfNodesInSection === 1 &&
  //         value.document.text.length === 0 &&
  //         selection.isCollapsed &&
  //         selection.anchor.isAtStartOfNode(value.document)
  //       ) {
  //         removeSection(index);
  //         return;
  //       }
  //       next();
  //     }
  //   }
  //   next();
  // };

  return (
    <article>
      <SlateProvider isSubmitted={submitted}>
        <div data-cy="slate-editor" css={slateEditorDivStyle}>
          <Slate
            editor={editor}
            value={value}
            onChange={(val: Descendant[]) => {
              onChange(val, index);
            }}>
            <Editable
              onBlur={(event: React.FocusEvent<HTMLDivElement>) => onBlur(event, editor)}
              onKeyDown={editor.onKeyDown}
              className={className}
              placeholder={placeholder}
              {...rest}
            />
          </Slate>
          {children}
        </div>
      </SlateProvider>
    </article>
  );
};

export default RichTextEditor;
