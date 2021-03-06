/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';
import { spacing, colors } from '@ndla/core';

import 'monaco-editor/esm/vs/editor/browser/controller/coreCommands';
import 'monaco-editor/esm/vs/editor/browser/widget/codeEditorWidget';
import 'monaco-editor/esm/vs/editor/contrib/bracketMatching/bracketMatching';
import 'monaco-editor/esm/vs/editor/contrib/find/findController';
import 'monaco-editor/esm/vs/editor/contrib/links/links';
import 'monaco-editor/esm/vs/editor/contrib/suggest/suggestController';
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess';
import 'monaco-editor/esm/vs/editor/contrib/wordHighlighter/wordHighlighter';
import 'monaco-editor/esm/vs/editor/contrib/multicursor/multicursor';
import 'monaco-editor/esm/vs/editor/contrib/linesOperations/linesOperations';
import 'monaco-editor/esm/vs/editor/contrib/fontZoom/fontZoom';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

// Uncomment the following line to test all monaco-editor features
// import * as monaco from 'monaco-editor';

import './html.contribution';
import { createFormatAction, createSaveAction } from './editorActions';

monaco.editor.defineTheme('myCustomTheme', {
  base: 'vs',
  inherit: false,
  rules: [
    { token: 'tag', foreground: 'CC342B' },
    {
      token: 'invalidtag',
      foreground: 'ff0000',
      fontStyle: 'underline bold',
    },
    { token: 'attribute.name', foreground: '3971ED' },
    { token: 'attribute.value', foreground: '178844' },
  ],
});

export function MonacoEditor({ value, onChange, onSave }) {
  const divRef = useRef(null);

  useEffect(() => {
    let editor = monaco.editor.create(divRef.current, {
      value,
      scrollBeyondLastLine: false,
      theme: 'myCustomTheme',
      wordWrap: 'on',
      fontSize: 15,
      minimap: false,
      language: 'html',
    });

    editor.onDidChangeModelContent(event => {
      const value = editor.getValue();
      onChange(value, event);
    });

    editor.addAction(createFormatAction(monaco));
    editor.addAction(createSaveAction(monaco, onSave));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      css={css`
        height: 75vh;
        margin: ${spacing.normal};
        border: 1px solid ${colors.brand.greyLight};
      `}
      ref={divRef}
    />
  );
}

MonacoEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default MonacoEditor;
