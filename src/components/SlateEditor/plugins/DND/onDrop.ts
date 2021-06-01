import { DragEventHandler } from 'react';
import { Editor, Element, Path, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

const onDrop = (editor: Editor): DragEventHandler<HTMLDivElement> => event => {
  const data = event.dataTransfer;

  const originPath = JSON.parse(data.getData('application/slate-node-path') || '[]');

  if (Array.isArray(originPath) && originPath.length > 0) {
    event.preventDefault();
    event.stopPropagation();
    const targetNode = ReactEditor.toSlateNode(editor, event.target as Node);
    const targetPath = ReactEditor.findPath(editor, targetNode);

    if (Path.equals(originPath, targetPath) || Path.isDescendant(targetPath, originPath)) {
      return;
    }

    // Handle case where root section is detected as the target.
    if (Element.isElement(targetNode) && targetNode.type === 'section') {
      // We need to manually calculate the correct posistion to move the node
      // @ts-ignore EventTarget interface does not include children, but the property does exist on target in this case.
      const children = event.target.children as HTMLCollection;
      let prevElementTop = 0;
      let insertAtNode;
      for (let i = 0; i < children.length; i++) {
        const elementTop = children[i].getBoundingClientRect().top;
        if (elementTop > event.clientY) {
          // check if it should be inserted before or after this element
          const elementOvershoot = event.clientY - prevElementTop;
          const goUp = elementOvershoot > (elementTop - prevElementTop) / 2;
          if (goUp && children.length > i + 1) {
            insertAtNode = children[i + 1];
          }
          insertAtNode = children[i];
          break;
        }
        prevElementTop = elementTop;
      }

      if (!insertAtNode) {
        return;
      }
      const insertBeforeNode = ReactEditor.findPath(
        editor,
        ReactEditor.toSlateNode(editor, insertAtNode),
      );
      if (Path.equals(insertBeforeNode, originPath)) {
        return;
      }

      HistoryEditor.withoutMerging(editor, () => {
        Transforms.moveNodes(editor, {
          at: originPath,
          to: insertBeforeNode,
        });
      });
    } else {
      if (Path.equals(originPath, targetPath) || Path.isDescendant(targetPath, originPath)) {
        return;
      }

      HistoryEditor.withoutMerging(editor, () => {
        Transforms.moveNodes(editor, { at: originPath, to: targetPath });
      });
    }
    if (!ReactEditor.isFocused(editor)) {
      ReactEditor.focus(editor);
    }
  }
};

export default onDrop;
