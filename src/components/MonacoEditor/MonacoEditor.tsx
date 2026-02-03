/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { styled } from "@ndla/styled-system/jsx";
import "monaco-editor/esm/vs/editor/browser/coreCommands";
import "monaco-editor/esm/vs/editor/contrib/find/browser/findController";
import "monaco-editor/esm/vs/language/html/monaco.contribution";
import "monaco-editor/esm/vs/basic-languages/html/html.contribution";
import "monaco-editor/esm/vs/editor/contrib/bracketMatching/browser/bracketMatching";
import "monaco-editor/esm/vs/editor/contrib/links/browser/links";
import "monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestController";
import "monaco-editor/esm/vs/editor/contrib/wordHighlighter/browser/wordHighlighter";
import "monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess";
import "monaco-editor/esm/vs/editor/contrib/fontZoom/browser/fontZoom";
import "monaco-editor/esm/vs/editor/contrib/linesOperations/browser/linesOperations";
import "monaco-editor/esm/vs/editor/contrib/multicursor/browser/multicursor";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
// Uncomment the following line to test all monaco-editor features
// import * as monaco from "monaco-editor";
import { useEffect, useRef, useState } from "react";
import { createFormatAction, createSaveAction } from "./editorActions";

const StyledDiv = styled("div", {
  base: {
    border: "1px solid",
    borderColor: "stroke.subtle",
  },
  defaultVariants: {
    size: "small",
  },
  variants: {
    size: {
      small: {
        height: "50vh",
      },
      large: {
        height: "75vh",
      },
    },
  },
});

monaco.editor.defineTheme("myCustomTheme", {
  base: "vs",
  inherit: false,
  rules: [
    { token: "tag", foreground: "CC342B" },
    {
      token: "invalidtag",
      foreground: "ff0000",
      fontStyle: "underline bold",
    },
    { token: "attribute.name", foreground: "3971ED" },
    { token: "attribute.value", foreground: "178844" },
  ],
  colors: {},
});

self.MonacoEnvironment = {
  getWorker() {
    return new htmlWorker();
  },
};

interface Props {
  value: string;
  onChange: (value: string, event: monaco.editor.IModelContentChangedEvent) => void;
  onSave: (value: string) => void;
  size?: "small" | "large";
}

export const MonacoEditor = ({ value, onChange, onSave, size }: Props) => {
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!divRef.current) return;
    setEditor((editor) => {
      if (editor) return editor;
      return monaco.editor.create(divRef.current!, {
        value,
        scrollBeyondLastLine: false,
        theme: "myCustomTheme",
        wordWrap: "on",
        fontSize: 15,
        minimap: {
          enabled: false,
        },
        language: "html",
      });
    });
    return () => editor?.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!editor) return;
    editor.onDidChangeModelContent((event) => {
      const value = editor.getValue();
      onChange(value, event);
    });

    editor.addAction(createFormatAction());
    editor.addAction(createSaveAction(onSave));
  }, [editor, onChange, onSave]);

  return <StyledDiv size={size} ref={divRef} />;
};

export default MonacoEditor;
