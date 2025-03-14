/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useFormikContext } from "formik";
import { isEqual } from "lodash-es";
import { FocusEvent, KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Descendant, Editor, Element, Range, Transforms } from "slate";
import { Slate, Editable, RenderElementProps, RenderLeafProps, ReactEditor } from "slate-react";
import { EditableProps } from "slate-react/dist/components/editable";
import { useFieldContext } from "@ark-ui/react";
import { createSlate, LoggerManager } from "@ndla/editor";
import { Spinner } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import "../DisplayEmbed/helpers/h5pResizer";
import { ArticleLanguageProvider } from "./ArticleLanguageProvider";
import { SlatePlugin } from "./interfaces";
import { Action, commonActions } from "./plugins/blockPicker/actions";
import { BlockPickerOptions, createBlockpickerOptions } from "./plugins/blockPicker/options";
import SlateBlockPicker from "./plugins/blockPicker/SlateBlockPicker";
import { onDragOver, onDragStart, onDrop } from "./plugins/DND";
import { SlateToolbar } from "./plugins/toolbar";
import { AreaFilters, CategoryFilters } from "./plugins/toolbar/toolbarState";
import { SlateProvider } from "./SlateContext";
import { BLOCK_PICKER_TRIGGER_ID } from "../../constants";
import { ArticleFormType } from "../../containers/FormikForm/articleFormHooks";
import { FormikStatus } from "../../interfaces";

const StyledSlateWrapper = styled("div", {
  base: {
    position: "relative",
    "& [data-slate-editor]": {
      outline: "none",
    },
  },
});

const StyledEditable = styled(Editable, {}, { baseComponent: true });

export interface RichTextEditorProps extends Omit<EditableProps, "value" | "onChange" | "onKeyDown"> {
  value: Descendant[];
  onChange: (descendant: Descendant[]) => void;
  placeholder?: string;
  plugins?: SlatePlugin[];
  submitted: boolean;
  language?: string;
  actions?: Action[];
  blockpickerOptions?: Partial<BlockPickerOptions>;
  toolbarOptions: CategoryFilters;
  toolbarAreaFilters: AreaFilters;
  additionalOnKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => boolean;
  hideBlockPicker?: boolean;
  testId?: string;
  hideToolbar?: boolean;
  receiveInitialFocus?: boolean;
  hideSpinner?: boolean;
  noArticleStyling?: boolean;
}

const RichTextEditor = ({
  placeholder,
  plugins,
  value,
  onChange,
  actions = commonActions,
  submitted,
  language,
  testId = "slate-editor",
  blockpickerOptions = {},
  toolbarOptions,
  toolbarAreaFilters,
  hideBlockPicker,
  additionalOnKeyDown,
  hideToolbar,
  receiveInitialFocus,
  hideSpinner,
  onBlur: onBlurProp,
  noArticleStyling,
  ...rest
}: RichTextEditorProps) => {
  const [editor] = useState(() => createSlate({ plugins, logger: new LoggerManager({ debug: true }) }));
  const [isFirstNormalize, setIsFirstNormalize] = useState(true);
  const [labelledBy, setLabelledBy] = useState<string | undefined>(undefined);
  const prevSubmitted = useRef(submitted);
  const field = useFieldContext();
  // Including ID somehow crashes the editor.
  const {
    "aria-labelledby": fieldLabelledBy,
    //@ts-expect-error - it exists, but not according to the type
    "data-part": _,
    ...fieldProps
  } = useMemo(() => (field?.getTextareaProps() as EditableProps | undefined) ?? {}, [field]);

  useEffect(() => {
    const labelEl = document.getElementById(field.ids.label);
    if (labelEl) {
      setLabelledBy(labelEl.id);
    }
  }, [field.ids.label]);

  const { status, setStatus } = useFormikContext<ArticleFormType>();

  useEffect(() => {
    if (receiveInitialFocus && !isFirstNormalize) {
      ReactEditor.focus(editor);
    }
  }, [editor, isFirstNormalize, receiveInitialFocus]);

  useEffect(() => {
    Editor.normalize(editor, { force: true });
    editor.history = { redos: [], undos: [] };
    setIsFirstNormalize(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const { MathJax } = window;
    if (!MathJax || isFirstNormalize || editor.mathjaxInitialized) return;
    if (editor.nodes({ match: (n) => Element.isElement(n) && n.type === "mathml", at: [] }).next().value) {
      MathJax.typesetPromise();
      editor.mathjaxInitialized = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor.mathjaxInitialized, isFirstNormalize]);

  useEffect(() => {
    // When form is submitted or form content has been revert to a previous version, the editor has to be reinitialized.
    if ((!submitted && prevSubmitted.current) || status === "revertVersion") {
      if (isFirstNormalize) {
        return;
      }
      ReactEditor.deselect(editor);
      editor.children = value;
      editor.history = { redos: [], undos: [] };
      editor.mathjaxInitialized = false;
      window.MathJax?.typesetClear();
      Editor.normalize(editor, { force: true });
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onDragStartCallback = useCallback(onDragStart(editor), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onDragOverCallback = useCallback(onDragOver(), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onDropCallback = useCallback(onDrop(editor), []);

  // Deselect selection if focus is moved to any other element than the toolbar
  const onBlur = useCallback(
    (e: FocusEvent<HTMLDivElement>) => {
      if (e.relatedTarget?.id === BLOCK_PICKER_TRIGGER_ID) return;
      if (e.relatedTarget?.closest("[data-toolbar]")) return;
      if (onBlurProp) onBlurProp(e);
    },
    [onBlurProp],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      let allowEditorKeyDown = true;
      if (additionalOnKeyDown) {
        allowEditorKeyDown = additionalOnKeyDown(e);
      }
      if (allowEditorKeyDown) {
        editor.onKeyDown(e);
      }
    },
    [additionalOnKeyDown, editor],
  );

  return (
    <article className={noArticleStyling ? undefined : "ndla-article"}>
      <ArticleLanguageProvider language={language}>
        <SlateProvider isSubmitted={submitted}>
          <StyledSlateWrapper data-testid={testId} data-slate-wrapper="">
            <Slate editor={editor} initialValue={value} onChange={onChange}>
              {isFirstNormalize && !hideSpinner ? (
                <Spinner />
              ) : (
                <>
                  <SlateToolbar options={toolbarOptions} areaOptions={toolbarAreaFilters} hideToolbar={hideToolbar} />
                  {!hideBlockPicker && (
                    <SlateBlockPicker
                      actions={actions}
                      articleLanguage={language}
                      {...createBlockpickerOptions(blockpickerOptions)}
                    />
                  )}
                  <StyledEditable
                    {...fieldProps}
                    aria-labelledby={labelledBy}
                    {...rest}
                    onBlur={onBlur}
                    onKeyDown={handleKeyDown}
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
      </ArticleLanguageProvider>
    </article>
  );
};

export default RichTextEditor;
