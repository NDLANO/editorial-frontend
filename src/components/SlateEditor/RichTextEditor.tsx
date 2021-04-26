/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useEffect, useMemo } from 'react';
import { createEditor, Descendant, Editor } from 'new-slate';
import { Slate, Editable, withReact, RenderElementProps, RenderLeafProps } from 'new-slate-react';
import { withHistory } from 'new-slate-history';
import BEMHelper from 'react-bem-helper';
import { css } from '@emotion/core';
import { SlatePlugin } from './interfaces';
import { SlateProvider } from './SlateContext';
import { SlateToolbar } from './plugins/toolbar';

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
  children: any;
}

const withPlugins = (editor: Editor, plugins?: SlatePlugin[]) => {
  if (plugins) {
    return plugins.reduce((editor, plugin) => plugin(editor), editor);
  }
  return editor;
};

const RichTextEditor = ({
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
}: Props) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const editor = useMemo(() => withHistory(withReact(withPlugins(createEditor(), plugins))), []);

  // TODO: Can normalization be done after deserialization in articleContentConverter?
  useEffect(() => {
    Editor.normalize(editor, { force: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO: add functionality to sectionPlugin
  // const onKeyDown = (e, editor, next) => {
  //   const { value } = editor;
  //   if (e.key === 'Backspace') {
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

  const renderElement = (props: RenderElementProps) => {
    const { attributes, children } = props;
    if (editor.renderElement) {
      const ret = editor.renderElement(props);
      if (ret) {
        return ret;
      }
    }
    return <div {...attributes}>{children}</div>;
  };

  const renderLeaf = (props: RenderLeafProps) => {
    const { attributes, children } = props;
    if (editor.renderLeaf) {
      const ret = editor.renderLeaf(props);
      if (ret) {
        return ret;
      }
    }
    return <span {...attributes}>{children}</span>;
  };

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
            <SlateToolbar editor={editor} />
            <Editable
              onBlur={(event: React.FocusEvent<HTMLDivElement>) => onBlur(event, editor)}
              onKeyDown={editor.onKeyDown}
              className={className}
              placeholder={placeholder}
              renderElement={renderElement}
              renderLeaf={renderLeaf}
            />
          </Slate>
          {children}
        </div>
      </SlateProvider>
    </article>
  );
};

export default RichTextEditor;
