/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { ReactElement } from 'react';
import { Editor } from 'slate';
import VisualElementPicker from './VisualElementPicker';

interface Options {
  changeVisualElement: (visualElement: string) => void;
  empty: boolean;
  language: string;
  types: string[];
}

const visualElementPickerPlugin = (options: Options) => {
  const schema = {};
  const renderEditor = (
    props: any,
    editor: Editor,
    next: () => void,
  ): ReactElement | void => {
    const children = next();
    const { changeVisualElement, empty, language, types } = options;
    return empty ? (
      <VisualElementPicker
        editor={editor}
        language={language}
        onSelect={changeVisualElement}
        types={types}
      />
    ) : (
      children
    );
  };

  return {
    schema,
    renderEditor,
  };
};

export default visualElementPickerPlugin;
