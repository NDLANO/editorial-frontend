/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Element, Transforms } from "slate";
import VisualElementMenu, { VisualElementType } from "./VisualElementMenu";
import SlateVisualElementPicker from "../../components/SlateEditor/plugins/blockPicker/SlateVisualElementPicker";
import { defaultExternalBlock } from "../../components/SlateEditor/plugins/external/utils";
import { defaultH5pBlock } from "../../components/SlateEditor/plugins/h5p/utils";
import { isEmpty } from "../../components/validators";

interface Props {
  editor: Editor;
  language: string;
  types?: VisualElementType[];
}

const VisualElementPicker = ({ editor, language, types }: Props) => {
  const { t } = useTranslation();
  const onInsertBlock = (block: Element) => {
    Editor.withoutNormalizing(editor, () => {
      Transforms.insertNodes(editor, block);
    });
  };

  const [selectedResource, setSelectedResource] = useState<string | undefined>(undefined);

  const resetSelectedResource = () => {
    setSelectedResource(undefined);
  };

  const onSelect = (visualElement: string) => {
    if (visualElement === "h5p") {
      onInsertBlock(defaultH5pBlock());
      return;
    } else if (visualElement === "external" || visualElement === "url") {
      onInsertBlock(defaultExternalBlock());
      return;
    }
    setSelectedResource(visualElement);
  };

  if (!isEmpty(editor.children)) {
    return null;
  }

  return (
    <div contentEditable={false}>
      {!!selectedResource && (
        <SlateVisualElementPicker
          isOpen
          label={t(`form.visualElementPicker.${selectedResource}`)}
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
