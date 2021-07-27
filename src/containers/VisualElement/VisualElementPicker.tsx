/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { Editor, Element, Transforms } from 'slate';
import SlateVisualElementPicker from '../../components/SlateEditor/plugins/blockPicker/SlateVisualElementPicker';
import VisualElementMenu from './VisualElementMenu';

interface Props {
  editor: Editor;
  language: string;
  types?: string[];
  children: React.ReactNode;
}

const VisualElementPicker = ({ editor, language, types, children }: Props) => {
  const onInsertBlock = (block: Element) => {
    Editor.withoutNormalizing(editor, () => {
      Transforms.removeNodes(editor, { at: [0] });
      Transforms.insertNodes(editor, block, { at: [0] });
    });
  };

  const [selectedResource, setSelectedResource] = useState<string | undefined>(undefined);

  const resetSelectedResource = () => {
    setSelectedResource(undefined);
  };

  const onSelect = (visualElement: string) => {
    setSelectedResource(visualElement);
  };

  return (
    <div contentEditable={false}>
      {selectedResource && (
        <SlateVisualElementPicker
          articleLanguage={language}
          resource={selectedResource}
          onVisualElementClose={resetSelectedResource}
          onInsertBlock={onInsertBlock}
        />
      )}
      <VisualElementMenu onSelect={onSelect} types={types} />
      {children}
    </div>
  );
};

export default VisualElementPicker;
