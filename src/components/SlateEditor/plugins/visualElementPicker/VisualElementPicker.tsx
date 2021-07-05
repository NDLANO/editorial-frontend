/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { Editor, Element } from 'slate';

import SlateVisualElementPicker from '../blockPicker/SlateVisualElementPicker';
import VisualElementMenu from '../../../../containers/VisualElement/VisualElementMenu';

interface Props {
  editor: Editor;
  language: string;
  onSelect: (visualElement: string) => void;
  types: string[];
}

interface VisualElementSelect {
  isOpen: boolean;
  type: string;
}

const VisualElementPicker = ({ editor, language, onSelect, types }: Props) => {
  const [visualElementSelect, setVisualElementSelect] = useState<VisualElementSelect>({
    isOpen: false,
    type: '',
  });

  const onVisualElementClose = () => {
    setVisualElementSelect({
      isOpen: false,
      type: '',
    });
  };

  const onInsertBlock = (block: Element) => {
    Editor.insertNode(editor, block);
  };

  return (
    <>
      {visualElementSelect.isOpen && (
        <SlateVisualElementPicker
          articleLanguage={language}
          resource={visualElementSelect.type}
          onVisualElementClose={onVisualElementClose}
          onInsertBlock={onInsertBlock}
        />
      )}
      <VisualElementMenu onSelect={onSelect} types={types} />
    </>
  );
};

export default VisualElementPicker;
