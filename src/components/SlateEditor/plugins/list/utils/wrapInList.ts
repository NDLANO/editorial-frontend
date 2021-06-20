import { Editor, Element, Range, Transforms } from "new-slate"
import { ListElement, LIST_TYPES } from ".."

export const wrapInList = (editor: Editor, type: string) => {

    const listType = type ? type : LIST_TYPES[0];
    const listElement: ListElement = {
        type: 'list_item',
        listType: listType,
        children: null,
    }
    Editor.withoutNormalizing(editor, () => {
        if (!Range.isRange(editor.selection)) {
            return;
        }
        Transforms.wrapNodes(editor, listElement)
    })
}