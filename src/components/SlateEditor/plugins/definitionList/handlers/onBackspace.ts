import { Editor, Element, Transforms, Node, Path, Text } from 'slate';
import hasNodeOfType from '../../../utils/hasNodeOfType';
import { TYPE_DEFINTION_DESCRIPTION, TYPE_DEFINTION_LIST, TYPE_DEFINTION_TERM } from '../types';

const nodeContainsText = (node: Node) =>
  Element.isElement(node) && node?.children?.length === 1 && Node.string(node.children[0]) !== '';

const onBackspace = (
  e: KeyboardEvent,
  editor: Editor,
  nextOnKeyDown: ((e: KeyboardEvent) => void) | undefined,
) => {
  if (!editor.selection) return nextOnKeyDown && nextOnKeyDown(e);
  const isDefinition = hasNodeOfType(editor, TYPE_DEFINTION_LIST);

  if (!isDefinition) {
    return nextOnKeyDown && nextOnKeyDown(e);
  }

  const [, selectedPath] = editor.selection && Editor.node(editor, editor.selection.focus);
  const [definitionItem, definitionItemPath] = Editor.parent(editor, selectedPath);
  if (Element.isElement(definitionItem) && definitionItem.type === TYPE_DEFINTION_TERM) {
    const [definitionDescription, definitionDescriptionPath] = Editor.node(
      editor,
      Path.next(definitionItemPath),
    );

    if (!nodeContainsText(definitionItem)) {
      // Remove text in description pair in order to remove pair
      if (nodeContainsText(definitionDescription)) {
        Transforms.delete(editor, { at: definitionDescriptionPath });
      }

      const previous = Editor.previous(editor, { at: definitionItemPath });

      Editor.withoutNormalizing(editor, () => {
        Transforms.removeNodes(editor, { at: definitionDescriptionPath });
        Transforms.removeNodes(editor, { at: definitionItemPath });
        const [parentNode, parentNodePath] = Editor.parent(editor, definitionItemPath);

        if (
          Element.isElement(parentNode) &&
          parentNode.type === 'definition-list' &&
          parentNode.children.length === 0
        ) {
          Transforms.removeNodes(editor, { at: parentNodePath });
        }
      });

      if (previous) {
        const [, previousDefinitionDescriptionPath] = previous;
        Transforms.select(editor, previousDefinitionDescriptionPath);
      }

      e.preventDefault();
      return nextOnKeyDown && nextOnKeyDown(e);
    }
  } else if (
    Element.isElement(definitionItem) &&
    definitionItem.type === TYPE_DEFINTION_DESCRIPTION
  ) {
    const previous = Editor.previous(editor, {
      at: definitionItemPath,
    });

    if (!nodeContainsText(definitionItem) && previous) {
      const [, definitionTermPath] = previous;

      Transforms.select(editor, definitionTermPath);
      e.preventDefault();

      return;
    } else if (
      Node.string(Node.child(definitionItem, 0)) !== '' &&
      editor.selection.anchor.offset === 0
    ) {
      e.preventDefault();
    }
  }

  return nextOnKeyDown && nextOnKeyDown(e);
};

export default onBackspace;
