import { Editor, Transforms, Element, Range } from 'slate';
import { jsx } from 'slate-hyperscript';
import { ListElement, ListTextElement } from '..';
import hasNodeOfType from '../../../utils/hasNodeOfType';
import hasNodeWithProps from '../../../utils/hasNodeWithProps';

export const toggleList = (editor: Editor, type: string) => {
  const listType = type ? type : 'numbered-list';
  const newListProps: Partial<ListElement> = { type: 'list_item', listType };
  const newListItemProps: Partial<ListTextElement> = { type: 'list_text' };

  const isIdentical = hasNodeWithProps(editor, newListProps);
  const isList = hasNodeOfType(editor, 'list_item');
  if (!Range.isRange(editor.selection)) {
    return;
  }

  if (isIdentical) {
    console.log(1);
    Editor.withoutNormalizing(editor, () => {
      if (!Range.isRange(editor.selection)) {
        return;
      }
      Transforms.unsetNodes(editor, ['level'], {
        match: node => Element.isElement(node) && node.type === 'list_item',
        at: Editor.unhangRange(editor, editor.selection),
      });
      Transforms.setNodes(
        editor,
        { type: 'paragraph' },
        {
          match: node => Element.isElement(node) && node.type === 'list_item',
          at: Editor.unhangRange(editor, editor.selection),
        },
      );
    });
  } else if (isList) {
    console.log(2);
    Transforms.setNodes(editor, newListProps, {
      match: node => Element.isElement(node) && node.type === 'list_item',
      hanging: false,
    });
  } else {
    console.log(3);
    Transforms.setNodes(editor, jsx('element', newListItemProps, []), {
      match: node => Element.isElement(node) && node.type === 'paragraph',
    });
    Transforms.wrapNodes(editor, jsx('element', newListProps, []), {
      match: node => Element.isElement(node) && node.type === 'paragraph',
    });
  }
};
