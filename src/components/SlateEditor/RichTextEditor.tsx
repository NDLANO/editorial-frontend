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
import { useFormikContext } from 'formik';
import isEqual from 'lodash/isEqual';
import styled from '@emotion/styled';
import { fonts } from '@ndla/core';
import { SlatePlugin } from './interfaces';
import { SlateProvider } from './SlateContext';
import { SlateToolbar } from './plugins/toolbar';
import { onDragOver, onDragStart, onDrop } from './plugins/DND';
import withPlugins from './utils/withPlugins';
import Spinner from '../Spinner';
import { ArticleFormType } from '../../containers/FormikForm/articleFormHooks';
import { FormikStatus } from '../../interfaces';
import SlateBlockPicker from './plugins/blockPicker/SlateBlockPicker';
import { BlockPickerOptions, createBlockpickerOptions } from './plugins/blockPicker/options';
import { Action, commonActions } from './plugins/blockPicker/actions';

const StyledSlateWrapper = styled.div`
  position: relative;
`;

const StyledEditable = styled(Editable)`
  font-family: ${fonts.serif};
`;

interface Props {
  value: Descendant[];
  onChange: (descendant: Descendant[]) => void;
  placeholder?: string;
  plugins?: SlatePlugin[];
  submitted: boolean;
  language: string;
  actions?: Action[];
  blockpickerOptions?: Partial<BlockPickerOptions>;
}

const RichTextEditor = ({
  placeholder,
  plugins,
  value,
  onChange,
  actions = commonActions,
  submitted,
  language,
  blockpickerOptions = {},
}: Props) => {
  const editor = useMemo(
    () => withReact(withHistory(withPlugins(createEditor(), plugins))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const [isFirstNormalize, setIsFirstNormalize] = useState(true);
  const prevSubmitted = useRef(submitted);

  const { status, setStatus } = useFormikContext<ArticleFormType>();

  useEffect(() => {
    Editor.normalize(editor, { force: true });
    editor.history = { redos: [], undos: [] };
    setIsFirstNormalize(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { MathJax } = window;
    if (MathJax && !isFirstNormalize && !editor.mathjaxInitialized) {
      MathJax.typesetPromise();
      editor.mathjaxInitialized = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor.mathjaxInitialized, isFirstNormalize]);

  useEffect(() => {
    // When form is submitted or form content has been revert to a previous version, the editor has to be reinitialized.
    if ((!submitted && prevSubmitted.current) || status === 'revertVersion') {
      if (isFirstNormalize) {
        return;
      }
      ReactEditor.deselect(editor);
      editor.children = value;
      editor.history = { redos: [], undos: [] };
      editor.mathjaxInitialized = false;
      window.MathJax?.typesetClear();
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
          match: (node) => {
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
      if (status?.status === 'revertVersion') {
        setStatus((prevStatus: FormikStatus) => ({ ...prevStatus, status: undefined }));
      }
    } else if (submitted && !prevSubmitted.current) {
      ReactEditor.deselect(editor);
    }
    prevSubmitted.current = submitted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, submitted]);

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
        <StyledSlateWrapper data-cy="slate-editor">
          <Slate editor={editor} value={value} onChange={onChange}>
            {isFirstNormalize ? (
              <Spinner />
            ) : (
              <>
                <SlateToolbar />
                <SlateBlockPicker
                  editor={editor}
                  actions={actions}
                  articleLanguage={language}
                  {...createBlockpickerOptions(blockpickerOptions)}
                />
                <StyledEditable
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
                />
              </>
            )}
          </Slate>
        </StyledSlateWrapper>
      </SlateProvider>
    </article>
  );
};

export default RichTextEditor;
