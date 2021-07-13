/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Editor, Element, Transforms } from 'slate';
import SlateVisualElementPicker from '../../components/SlateEditor/plugins/blockPicker/SlateVisualElementPicker';
import VisualElementMenu from './VisualElementMenu';

interface Props {
  editor: Editor;
  language: string;
  onSelect: (visualElement: string) => void;
  types: string[];
  selectedResource: string;
  resetSelectedResource: () => void;
}

const VisualElementPicker = ({
  editor,
  language,
  onSelect,
  types,
  selectedResource,
  resetSelectedResource,
}: Props) => {
  const onInsertBlock = (block: Element) => {
    Transforms.insertNodes(editor, block, { at: [0] });
  };

  return (
    <>
      {selectedResource && (
        <SlateVisualElementPicker
          articleLanguage={language}
          resource={selectedResource}
          onVisualElementClose={resetSelectedResource}
          onInsertBlock={onInsertBlock}
        />
      )}
      <VisualElementMenu onSelect={onSelect} types={types} />
    </>
  );
};

export default VisualElementPicker;
