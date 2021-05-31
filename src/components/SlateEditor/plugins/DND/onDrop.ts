import { DragEventHandler } from 'react';
import { Editor, Element, Path, Range, Transforms } from 'slate';
import { HistoryEditor } from 'slate-history';
import { jsx } from 'slate-hyperscript';
import { ReactEditor } from 'slate-react';

const onDrop = (editor: Editor): DragEventHandler<HTMLDivElement> => event => {
  const data = event.dataTransfer;

  const originPath = JSON.parse(data.getData('application/slate-node-path') || '[]');
  const headingRange = JSON.parse(data.getData('application/slate-heading-range') || '{}');
  const headingPath = JSON.parse(data.getData('application/slate-heading-path') || '[]');

  const targetNode = ReactEditor.toSlateNode(editor, event.target as Node);
  const targetPath = ReactEditor.findPath(editor, targetNode);

  if (Range.isRange(headingRange) && Path.isPath(headingPath)) {
    if (Range.includes(headingRange, targetPath)) {
      return;
    }
    const [headingNode] = Editor.node(editor, headingPath);
    if (Element.isElement(headingNode) && headingNode.type === 'heading') {
      console.log(targetPath);
      event.preventDefault();
      event.stopPropagation();
      const text = Editor.string(editor, headingRange);
      console.log(headingRange);
      console.log(text);
      Transforms.delete(editor, { at: headingRange });
      Transforms.insertNodes(
        editor,
        jsx('element', { type: 'heading', level: headingNode.level }, [{ text }]),
        { at: Path.parent(targetPath) },
      );
      if (!ReactEditor.isFocused(editor)) {
        ReactEditor.focus(editor);
      }
      data.clearData();
      return;
    }
  }

  if (Array.isArray(originPath) && originPath.length > 0) {
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
      // Prevent default Editable function from executing.
      event.preventDefault();
      event.stopPropagation();
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
      // Prevent default Editable function from executing.
      event.preventDefault();
      event.stopPropagation();
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
