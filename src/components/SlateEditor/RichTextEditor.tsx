/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useEffect, useMemo, useRef, FocusEvent, KeyboardEventHandler } from 'react';
import { createEditor, Descendant, Editor, NodeEntry } from 'slate';
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
  ReactEditor,
} from 'slate-react';
import { withHistory } from 'slate-history';
import BEMHelper from 'react-bem-helper';
import { css } from '@emotion/core';
import { SlatePlugin } from './interfaces';
import { SlateProvider } from './SlateContext';
import { SlateToolbar } from './plugins/toolbar';
import SlateBlockPicker from './plugins/blockPicker/SlateBlockPicker';
import options from './plugins/blockPicker/options';
import { onDragOver, onDragStart, onDrop } from './plugins/DND';

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
  language: string;
  actionsToShowInAreas: { [key: string]: string[] };
  taxIndex?: number;
  value: Descendant[];
  submitted: boolean;
  removeSection: (index: number) => void;
}

interface Props extends Omit<SlateEditorProps, 'onChange'> {
  handleSubmit: () => void;
  onChange: Function;
  onBlur: (event: FocusEvent<HTMLDivElement>, editor: Editor) => void;
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
  language,
  actionsToShowInAreas,
  index,
  removeSection,
  ...rest
}: Props) => {
  const editor = useMemo(
    () => withHistory(withReact(withPlugins(createEditor(), plugins))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  editor.removeSection = () => {
    removeSection(index);
  };

  const prevSubmitted = useRef(submitted);

  useEffect(() => {
    Editor.normalize(editor, { force: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!submitted && prevSubmitted.current) {
      Editor.normalize(editor, { force: true });
    } else if (submitted && !prevSubmitted.current) {
      ReactEditor.deselect(editor);
    }
    prevSubmitted.current = submitted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  const renderElement = (props: RenderElementProps) => {
    const { attributes, children } = props;
    if (editor.renderElement) {
      const ret = editor.renderElement(props);
      if (ret) {
        return ret;
      }
    }
    return <p {...attributes}>{children}</p>;
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

  const decorations = (entry: NodeEntry) => {
    if (editor.decorations) {
      return editor.decorations(editor, entry);
    }
    return [];
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
            <SlateBlockPicker
              editor={editor}
              onChange={editor.onChange}
              {...options({
                articleLanguage: language,
                actionsToShowInAreas,
              })}
            />
            <Editable
              decorate={entry => decorations(entry)}
              onBlur={(event: FocusEvent<HTMLDivElement>) => onBlur(event, editor)}
              onKeyDown={(editor.onKeyDown as unknown) as KeyboardEventHandler<HTMLDivElement>}
              placeholder={placeholder}
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              readOnly={submitted}
              onDragStart={onDragStart(editor)}
              onDragOver={onDragOver(editor)}
              onDrop={onDrop(editor)}
              {...classes('content', undefined, className)}
            />
          </Slate>
          {children}
        </div>
      </SlateProvider>
    </article>
  );
};

export default RichTextEditor;
