import React from 'react';
import { Descendant, Editor } from 'slate';
import { jsx } from 'slate-hyperscript';
import VisualElementPicker from '../../../../containers/VisualElement/VisualElementPicker';

export const TYPE_VISUAL_ELEMENT_PICKER = 'visualElementPicker';

export interface VisualElementPickerElement {
  type: 'visualElementPicker';
  children: Descendant[];
}

export const defaultVisualElementPickerBlock = () => {
  return jsx('element', { type: TYPE_VISUAL_ELEMENT_PICKER }, { text: '' });
};

export const visualElementPickerPlugin = (language: string, types?: string[]) => (
  editor: Editor,
) => {
  const { isVoid, renderElement } = editor;

  editor.renderElement = ({ attributes, children, element }) => {
    if (element.type === TYPE_VISUAL_ELEMENT_PICKER) {
      return (
        <div {...attributes} contentEditable="false">
          <VisualElementPicker editor={editor} language={language} types={types} />
          {children}
        </div>
      );
    }
    return renderElement && renderElement({ attributes, children, element });
  };

  editor.isVoid = element => {
    if (element.type === TYPE_VISUAL_ELEMENT_PICKER) {
      return true;
    }
    return isVoid(element);
  };

  return editor;
};
