/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from 'react';

import { Editor, Element, Transforms } from 'slate';
import SlateVisualElementPicker from '../../components/SlateEditor/plugins/blockPicker/SlateVisualElementPicker';
import { isEmpty } from '../../components/validators';
import VisualElementMenu from './VisualElementMenu';

interface Props {
  editor: Editor;
  language: string;
  types?: string[];
}

const VisualElementPicker = ({ editor, language, types }: Props) => {
  const onInsertBlock = (block: Element) => {
    Editor.withoutNormalizing(editor, () => {
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

  if (!isEmpty(editor.children)) {
    return null;
  }

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
    </div>
  );
};

export default VisualElementPicker;
