import { DragEventHandler } from 'react';
import { Editor, Element, Path, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { getTopNode } from './utils';

const onDrop = (editor: Editor): DragEventHandler<HTMLDivElement> => event => {
  event.preventDefault();
  // NEW
  const data = event.dataTransfer;

  const originPath = JSON.parse(data.getData('application/slate-node-path') || '[]');

  if (Array.isArray(originPath) && originPath.length > 0) {
    const targetNode = ReactEditor.toSlateNode(editor, event.target as Node);
    const targetPath = ReactEditor.findPath(editor, targetNode);

    if (Path.equals(originPath, targetPath) || Path.isDescendant(targetPath, originPath)) {
      return;
    }

    if (Element.isElement(targetNode) && targetNode.type === 'section') {
      // We need to manually calculate the correct posistion to move the node
      const children = event.target.children as HTMLElement['children'];
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
      Transforms.moveNodes(editor, { at: originPath, to: insertBeforeNode });
    } else {
      if (Path.equals(originPath, targetPath) || Path.isDescendant(targetPath, originPath)) {
        return;
      }
      Transforms.moveNodes(editor, { at: originPath, to: targetPath });
    }
  } else {
    const draggedRange = editor.selection;
    Transforms.select(editor, ReactEditor.findEventRange(editor, event));
    if (draggedRange) {
      Transforms.delete(editor, { at: draggedRange });
    }
    ReactEditor.insertData(editor, data);
  }
  if (!ReactEditor.isFocused(editor)) {
    ReactEditor.focus(editor);
  }
  return;

  const targetNode = ReactEditor.toSlateNode(editor, event.target as Node);
  const targetPath = ReactEditor.findPath(editor, targetNode);
  console.log('targetNode', targetNode);

  const range = Editor.range(editor, targetPath);

  const targetRange = ReactEditor.findEventRange(editor, event);
  //Transforms.select(editor, targetRange);
  // ReactEditor.insertData(editor, data);
  // Transforms.removeNodes(editor, { at: range });

  // const fragment = Node.fragment(editor, range);
  // Transforms.removeNodes(editor, {at: range});

  // OLD
  // const target = editor.findNode(event.target);
  // const topLevelTarget = getTopNode(target, editor);
  // const nodeKey = event.dataTransfer.getData('text/nodeKey');
  // const sourceNode = editor.value.document.getNode(nodeKey);
  // if (!sourceNode) {
  //   return next();
  // }
  // const topLevelSource = getTopNode(sourceNode, editor);
  // if (!topLevelSource || !topLevelTarget || topLevelTarget.key === topLevelSource.key) {
  //   return;
  // }

  // const { key: topLevelSourceKey } = topLevelSource;

  // if (topLevelTarget.type === 'paragraph' && topLevelTarget.text === '') {
  //   editor.withoutNormalizing(() => {
  //     editor
  //       .moveNodeByKey(topLevelSourceKey, topLevelTarget.key, 0)
  //    });
  // } else if (topLevelTarget.type === 'section') {
  //   // We need to manually calculate the correct posistion to move the node
  //   const children = event.target.children;
  //   let prevElementTop = 0;
  //   let insertAtNode;
  //   for (let i = 0; i < children.length; i++) {
  //     const elementTop = children[i].getBoundingClientRect().top;
  //     if (elementTop > event.clientY) {
  //       // check if it should be inserted before or after this element
  //       const elementOvershoot = event.clientY - prevElementTop;
  //       const goUp = elementOvershoot > (elementTop - prevElementTop) / 2;
  //       if (goUp && children.length > i + 1) {
  //         insertAtNode = children[i + 1];
  //       }
  //       insertAtNode = children[i];
  //       break;
  //     }
  //     prevElementTop = children[i].top;
  //   }
  //   const insertBeforeNode = editor.findNode(insertAtNode, editor);
  //   if (insertBeforeNode.key === sourceNode.key) {
  //     return;
  //   }
  //   editor.withoutNormalizing(() => {
  //     editor
  //       .moveNodeByKey(topLevelSourceKey, insertBeforeNode.key, 0)
  //       .unwrapNodeByKey(topLevelSourceKey);
  //   });
  // } else {
  //   // it is dropped over another element, move it to either before or after it
  //   const { height, top } = event.target.getBoundingClientRect();
  //   const goUp = top + height / 2 > event.clientY;

  //   editor.withoutNormalizing(() => {
  //     editor
  //       .moveNodeByKey(topLevelSourceKey, topLevelTarget.key, goUp ? 0 : topLevelTarget.nodes.size)
  //       .unwrapNodeByKey(topLevelSourceKey);
  //   });
  // }
};

export default onDrop;
