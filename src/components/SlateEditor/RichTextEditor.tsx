/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable jsx-a11y/no-static-element-interactions */

import React, { useEffect, useMemo, useRef } from 'react';
import { createEditor, Descendant, Editor, NodeEntry, Transforms } from 'slate';
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
  ReactEditor,
} from 'slate-react';
import { withHistory } from 'slate-history';
import { isEqual } from 'lodash';
import BEMHelper from 'react-bem-helper';
import { css } from '@emotion/core';
import { SlatePlugin } from './interfaces';
import { SlateProvider } from './SlateContext';
import { SlateToolbar } from './plugins/toolbar';
import SlateBlockPicker from './plugins/blockPicker/SlateBlockPicker';
import options from './plugins/blockPicker/options';
import { onDragOver, onDragStart, onDrop } from './plugins/DND';
import withPlugins from './utils/withPlugins';

export const classes = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

const slateEditorDivStyle = css`
  position: relative;
`;

interface Props {
  value: Descendant[];
  onChange: (descendant: Descendant[], index: number) => void;
  className?: string;
  placeholder?: string;
  plugins?: SlatePlugin[];
  submitted: boolean;
  language: string;
  actionsToShowInAreas: { [key: string]: string[] };
  index?: number;
  removeSection?: (index: number) => void;
}

const RichTextEditor = ({
  className,
  placeholder,
  plugins,
  value,
  onChange,
  submitted,
  language,
  actionsToShowInAreas,
  index,
  removeSection,
}: Props) => {
  const editor = useMemo(
    () => withReact(withHistory(withPlugins(createEditor(), plugins))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const prevSubmitted = useRef(submitted);

  useEffect(() => {
    Editor.normalize(editor, { force: true });
    if (removeSection && index) {
      editor.removeSection = () => {
        removeSection(index);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!submitted && prevSubmitted.current) {
      // Editor will be normalized. Remove history
      editor.history = { redos: [], undos: [] };
      Editor.normalize(editor, { force: true });
      ReactEditor.focus(editor);
      // Try to select previous selection if it exists
      if (editor.lastSelection && ReactEditor.hasRange(editor, editor.lastSelection)) {
        Transforms.select(editor, editor.lastSelection);
        // Else: Try to find previous block element and select it.
      } else if (editor.lastSelectedBlock) {
        const [target] = Editor.nodes(editor, {
          at: Editor.range(editor, [0]),
          match: node => {
            return isEqual(node, editor.lastSelectedBlock);
          },
        });
        if (target) {
          Transforms.select(editor, target[1]);
          Transforms.collapse(editor, { edge: 'end' });
        }
      }
    }
    prevSubmitted.current = submitted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  const renderElement = (renderProps: RenderElementProps) => {
    const { attributes, children } = renderProps;
    if (editor.renderElement) {
      const ret = editor.renderElement(renderProps);
      if (ret) {
        return ret;
      }
    }
    return <p {...attributes}>{children}</p>;
  };

  const renderLeaf = (renderProps: RenderLeafProps) => {
    const { attributes, children } = renderProps;
    if (editor.renderLeaf) {
      const ret = editor.renderLeaf(renderProps);
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
              onChange(val, index ?? 0);
            }}>
            <SlateToolbar editor={editor} />
            <SlateBlockPicker
              editor={editor}
              onChange={editor.onChange}
              articleLanguage={language}
              {...options({
                actionsToShowInAreas,
              })}
            />
            <Editable
              decorate={entry => decorations(entry)}
              // @ts-ignore is-hotkey and editor.onKeyDown does not have matching types
              onKeyDown={editor.onKeyDown}
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
        </div>
      </SlateProvider>
    </article>
  );
};

export default RichTextEditor;
