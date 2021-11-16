/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createEditor, Descendant, Editor, NodeEntry, Range, Transforms } from 'slate';
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
import { onDragOver, onDragStart, onDrop } from './plugins/DND';
import withPlugins from './utils/withPlugins';
import Spinner from '../Spinner';

export const classes = new BEMHelper({
  name: 'editor',
  prefix: 'c-',
});

const slateEditorDivStyle = css`
  position: relative;
`;

interface Props {
  value: Descendant[];
  onChange: (descendant: Descendant[]) => void;
  className?: string;
  placeholder?: string;
  plugins?: SlatePlugin[];
  submitted: boolean;
}

const RichTextEditor = ({ className, placeholder, plugins, value, onChange, submitted }: Props) => {
  const editor = useMemo(
    () => withReact(withHistory(withPlugins(createEditor(), plugins))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const [isFirstNormalize, setIsFirstNormalize] = useState(true);

  const prevSubmitted = useRef(submitted);

  useEffect(() => {
    Editor.normalize(editor, { force: true });
    setIsFirstNormalize(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!submitted && prevSubmitted.current) {
      // Editor will be normalized. Remove history
      ReactEditor.deselect(editor);
      editor.children = value;
      editor.history = { redos: [], undos: [] };
      Editor.normalize(editor, { force: true });
      ReactEditor.focus(editor);
      // Try to select previous selection if it exists
      if (editor.lastSelection) {
        const edges = Range.edges(editor.lastSelection);
        if (Editor.hasPath(editor, edges[0].path) && Editor.hasPath(editor, edges[1].path)) {
          const start = Editor.start(editor, edges[0].path);
          const end = Editor.end(editor, edges[1].path);

          const existingRange = { anchor: start, focus: end };

          if (Range.includes(existingRange, edges[0]) && Range.includes(existingRange, edges[1])) {
            Transforms.select(editor, editor.lastSelection);
            editor.lastSelection = undefined;
            editor.lastSelectedBlock = undefined;
            prevSubmitted.current = submitted;
            return;
          }
        }
        // Else: Try to find previous block element and select it.
      }
      if (editor.lastSelectedBlock) {
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
      editor.lastSelection = undefined;
      editor.lastSelectedBlock = undefined;
    } else if (submitted && !prevSubmitted.current) {
      ReactEditor.deselect(editor);
    }
    prevSubmitted.current = submitted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  const renderElement = useCallback((renderProps: RenderElementProps) => {
    const { attributes, children } = renderProps;
    if (editor.renderElement) {
      const ret = editor.renderElement(renderProps);
      if (ret) {
        return ret;
      }
    }
    return <p {...attributes}>{children}</p>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderLeaf = useCallback((renderProps: RenderLeafProps) => {
    const { attributes, children } = renderProps;
    if (editor.renderLeaf) {
      const ret = editor.renderLeaf(renderProps);
      if (ret) {
        return ret;
      }
    }
    return <span {...attributes}>{children}</span>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const decorations = useCallback((entry: NodeEntry) => {
    if (editor.decorations) {
      return editor.decorations(editor, entry);
    }
    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onDragStartCallback = useCallback(onDragStart(editor), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onDragOverCallback = useCallback(onDragOver(editor), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onDropCallback = useCallback(onDrop(editor), []);

  return (
    <article>
      <SlateProvider isSubmitted={submitted}>
        <div data-cy="slate-editor" css={slateEditorDivStyle}>
          <Slate editor={editor} value={value} onChange={onChange}>
            {isFirstNormalize ? (
              <Spinner />
            ) : (
              <>
                <SlateToolbar editor={editor} />
                <Editable
                  decorate={decorations}
                  // @ts-ignore is-hotkey and editor.onKeyDown does not have matching types
                  onKeyDown={editor.onKeyDown}
                  placeholder={placeholder}
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                  readOnly={submitted}
                  onDragStart={onDragStartCallback}
                  onDragOver={onDragOverCallback}
                  onDrop={onDropCallback}
                  {...classes('content', undefined, className)}
                />
              </>
            )}
          </Slate>
        </div>
      </SlateProvider>
    </article>
  );
};

export default RichTextEditor;
