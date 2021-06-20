import { Editor, Transforms, Element, Range } from 'new-slate';
import { jsx } from 'new-slate-hyperscript';
import { ListElement, ListText } from '..';
import { hasNodeOfType, hasNodeWithProps } from '../../../utils';

export const toggleList = (editor: Editor, type: string) => {
    const listType = type ? type : 'numbered-list';
    const newListProps: Partial<ListElement> = { type: 'list_item', listType};
    const newListItemProps: Partial<ListText> =  { type: 'list_text' };

    const isIdentical = hasNodeWithProps(editor, newListProps);
    const isList = hasNodeOfType(editor, 'list_item');
    if (!Range.isRange(editor.selection)) {
        return;
    }

    if (isIdentical) {
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
        Transforms.setNodes(editor, newListProps, {
            match: node => Element.isElement(node) && node.type === 'list_item',
            hanging: false,
        });
    } else {
        Transforms.setNodes(editor, jsx('element', newListItemProps, []), {
            match: node => Element.isElement(node) && node.type === 'paragraph'
        })
        Transforms.wrapNodes(editor, jsx('element', newListProps, []), {
            match: node => Element.isElement(node) && node.type === 'paragraph',
        });
    }
}
