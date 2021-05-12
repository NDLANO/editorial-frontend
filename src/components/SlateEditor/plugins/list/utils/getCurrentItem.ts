import { Editor, Element, Node } from 'new-slate';

/**
 * Return the current list item, from current selection or from a node.
 */
// unction getCurrentItem(editor: Editor, element?: Element): Element | null {
//    const {
//        value: { document, selection, startBlock }
//    } = editor;
// 
//    if (!block) {
//        if (!selection.start.key) return null;
//        block = startBlock;
//    }
// 
//    const parent = document.getParent(block.key);
//    return parent && parent.type === opts.typeItem ? parent : null;
// 
// 
// xport default getCurrentItem;
// 


const getCurrentItem = (editor: Editor) => {
    if (!editor.selection?.anchor) return null;
    const start = Node.parent(editor, editor.selection?.anchor.path);
    if (!Element.isElement(start)) {
        return null;
    }
    return start;
}

export default getCurrentItem;