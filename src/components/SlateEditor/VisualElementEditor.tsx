/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isEqual } from "lodash-es";
import { useEffect, useState } from "react";
import { Descendant } from "slate";
import { Slate, Editable, RenderElementProps } from "slate-react";
import { createSlate } from "@ndla/editor";
import { ArticleLanguageProvider } from "./ArticleLanguageProvider";
import { SlatePlugin } from "./interfaces";
import VisualElementPicker, { VisualElementType } from "../../containers/VisualElement/VisualElementPicker";

interface Props {
  value: Descendant[];
  plugins: SlatePlugin[];
  onChange: (value: Descendant[]) => void;
  language: string;
  types?: VisualElementType[];
}

const VisualElementEditor = ({ value, plugins, onChange, types, language }: Props) => {
  const [editor] = useState(() => createSlate({ plugins }));

  const renderElement = (elementProps: RenderElementProps) => {
    const { attributes, children } = elementProps;
    if (editor.renderElement) {
      const ret = editor.renderElement(elementProps);
      if (ret) {
        return ret;
      }
    }
    return <div {...attributes}>{children}</div>;
  };

  useEffect(() => {
    if (!isEqual(editor.children, value)) {
      editor.reinitialize({ value });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <ArticleLanguageProvider language={language}>
      <Slate editor={editor} initialValue={value} onChange={onChange}>
        <VisualElementPicker editor={editor} types={types} language={language} />
        <Editable
          readOnly={true}
          renderElement={renderElement}
          onDragStart={(e) => {
            e.stopPropagation();
          }}
        />
      </Slate>
    </ArticleLanguageProvider>
  );
};

export default VisualElementEditor;
