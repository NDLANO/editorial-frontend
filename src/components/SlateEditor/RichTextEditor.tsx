/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { isEqual } from "lodash-es";
import { useCallback, useEffect, useRef, JSX, DragEvent, ReactNode } from "react";
import { Descendant, Editor, Range, Transforms } from "slate";
import { Slate, RenderElementProps, RenderLeafProps, ReactEditor } from "slate-react";
import { EditableProps } from "slate-react/dist/components/editable";
import { LoggerManager, SlatePlugin, useCreateSlate } from "@ndla/editor";
import { styled } from "@ndla/styled-system/jsx";
import "../DisplayEmbed/helpers/h5pResizer";
import { ArticleLanguageProvider } from "./ArticleLanguageProvider";
import { FieldEditable } from "./FieldEditable";
import { FormikStatus } from "../../interfaces";
import { nativeOnDragOver, nativeOnDragStart, nativeOnDrop } from "./plugins/DND/nativeDnd";
import { SlateDndContext } from "./plugins/DND/SlateDndContext";
import { SlateToolbar } from "./plugins/toolbar";
import { ArticleFormType } from "../../containers/FormikForm/articleFormHooks";

const StyledSlateWrapper = styled("div", {
  base: {
    position: "relative",
    "& [data-slate-editor]": {
      outline: "none",
    },
  },
});

const StyledEditable = styled(FieldEditable, {}, { baseComponent: true });

export interface RichTextEditorProps extends Omit<EditableProps, "value" | "onChange" | "onKeyDown"> {
  value: Descendant[];
  onChange: (descendant: Descendant[]) => void;
  placeholder?: string;
  plugins?: SlatePlugin[];
  submitted: boolean;
  language?: string;
  blockPicker?: ReactNode;
  testId?: string;
  hideToolbar?: boolean;
  receiveInitialFocus?: boolean;
  noArticleStyling?: boolean;
  onInitialNormalized?: (value: Descendant[]) => void;
  renderInvalidElement?: (props: RenderElementProps & { editor: Editor }) => JSX.Element;
  editorId?: string;
}

const RichTextEditor = ({
  placeholder,
  plugins,
  value,
  onChange,
  submitted,
  language,
  blockPicker,
  testId = "slate-editor",
  hideToolbar,
  receiveInitialFocus,
  noArticleStyling,
  editorId,
  onInitialNormalized,
  renderInvalidElement,
  ...rest
}: RichTextEditorProps) => {
  const editor = useCreateSlate({
    plugins: plugins,
    value,
    logger: new LoggerManager({ debug: true }),
    shouldNormalize: true,
    onInitialNormalized,
  });
  const prevSubmitted = useRef(submitted);

  const { status, setStatus } = useFormikContext<ArticleFormType>();

  useEffect(() => {
    if (receiveInitialFocus) {
      ReactEditor.focus(editor);
    }
  }, [editor, receiveInitialFocus]);

  useEffect(() => {
    // TODO: Add better logic for refreshing editors when values are changed/set outside of editor scope
    // When form is submitted or form content has been revert to a previous version, the editor has to be reinitialized.
    if (
      (!submitted && prevSubmitted.current) ||
      status?.status === "revertVersion" ||
      (editorId && status?.status === editorId)
    ) {
      ReactEditor.deselect(editor);
      editor.reinitialize({ value, shouldNormalize: true, onInitialNormalized });
      if (editor.lastSelection || editor.lastSelectedBlock) {
        ReactEditor.focus(editor);
      }
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
          Transforms.collapse(editor, { edge: "end" });
        }
      }
      editor.lastSelection = undefined;
      editor.lastSelectedBlock = undefined;
      if (status?.status === "revertVersion") {
        setStatus((prevStatus: FormikStatus) => ({
          ...prevStatus,
          status: undefined,
        }));
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
    return renderInvalidElement?.({ ...renderProps, editor }) ?? <p {...attributes}>{children}</p>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderLeaf = useCallback((renderProps: RenderLeafProps) => {
    const { attributes, children } = renderProps;
    if (editor.renderLeaf) {
      const ret = editor.renderLeaf?.(renderProps);
      if (ret) {
        return ret;
      }
    }
    return <span {...attributes}>{children}</span>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDragStart = useCallback((e: DragEvent<HTMLDivElement>) => nativeOnDragStart(editor, e), [editor]);
  const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => nativeOnDrop(editor, e), [editor]);

  return (
    <article className={noArticleStyling ? undefined : "ndla-article"}>
      <ArticleLanguageProvider language={language}>
        <StyledSlateWrapper data-testid={testId} data-slate-wrapper="">
          <Slate editor={editor} initialValue={editor.children} onChange={onChange}>
            <SlateToolbar hideToolbar={hideToolbar} />
            {blockPicker}
            <SlateDndContext editor={editor}>
              <StyledEditable
                {...rest}
                onKeyDown={editor.onKeyDown}
                placeholder={placeholder}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                readOnly={submitted}
                onDragStart={onDragStart}
                onDragOver={nativeOnDragOver}
                onDrop={onDrop}
              />
            </SlateDndContext>
          </Slate>
        </StyledSlateWrapper>
      </ArticleLanguageProvider>
    </article>
  );
};

export default RichTextEditor;
