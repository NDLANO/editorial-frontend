import { Editor, Element, Path, Transforms, Node, Point } from 'slate';
import { TYPE_DEFINTION_TERM, TYPE_DEFINTION_DESCRIPTION } from '../types';
import { definitionTerm, definitionDescription } from '../utils';

const nodeContainsText = (node: Node) =>
  Element.isElement(node) && node.children.length === 1 && Node.string(node.children[0]) !== '';

const onEnter = (
  editor: Editor,
  e: KeyboardEvent,
  nextOnKeyDown: ((e: KeyboardEvent) => void) | undefined,
) => {
  if (e.shiftKey && nextOnKeyDown) return nextOnKeyDown(e);
  if (!editor.selection && nextOnKeyDown) return nextOnKeyDown(e);
  else if (!editor.selection) return undefined;
  const [, selectedPath] = editor.selection && Editor.node(editor, editor.selection.focus);
  const [definitionItem, definitionItemPath] = Editor.parent(editor, selectedPath);

  if (Element.isElement(definitionItem) && definitionItem.type === TYPE_DEFINTION_TERM) {
    e.preventDefault();

    if (Path.hasPrevious(definitionItemPath)) {
      const previous = Editor.previous(editor, { at: definitionItemPath });
      if (previous) {
        const [previousDefinitionDescription, previousDefinitionDescriptionPath] = previous;

        if (!nodeContainsText(previousDefinitionDescription)) {
          Editor.withoutNormalizing(editor, () => {
            // Remove empty definition node pair
            Transforms.removeNodes(editor, { at: Path.next(definitionItemPath) });
            Transforms.removeNodes(editor, { at: definitionItemPath });
            // Move selection out of definition list
            Transforms.liftNodes(editor, { at: previousDefinitionDescriptionPath });
          });
          return;
        }
      }
    }
    Transforms.select(editor, Editor.point(editor, Path.next(definitionItemPath)));
    return;
  } else if (
    Element.isElement(definitionItem) &&
    definitionItem.type === TYPE_DEFINTION_DESCRIPTION
  ) {
    const [definitionTermNode, definitionTermNodePath] = Editor.node(
      editor,
      Path.previous(definitionItemPath),
    );

    const definitionDescriptionContainsText = nodeContainsText(definitionItem);
    const definitionTermContainsText = nodeContainsText(definitionTermNode);

    //If empty move selection out of list
    if (!definitionDescriptionContainsText && !definitionTermContainsText) {
      Editor.withoutNormalizing(editor, () => {
        // Move selection out of definition list
        Transforms.liftNodes(editor, { at: definitionItemPath });
      });
      // Potential if, if empty description and empty term remove row and move out selection
      Editor.withoutNormalizing(editor, () => {
        // Remove empty definition node pair
        Transforms.removeNodes(editor, { at: definitionItemPath });
        Transforms.removeNodes(editor, { at: definitionTermNodePath });
      });
      e.preventDefault();
      return;
    } else {
      // If not empty insert new definition pair
      Editor.withoutNormalizing(editor, () => {
        Transforms.insertNodes(editor, [definitionDescription], {
          at: Path.next(definitionItemPath),
        });
        Transforms.insertNodes(editor, [definitionTerm], {
          at: Path.next(definitionItemPath),
        });
        Transforms.select(editor, Editor.point(editor, Path.next(definitionItemPath)));
      });

      e.preventDefault();

      return;
    }
  }
  return nextOnKeyDown && nextOnKeyDown(e);
};

export default onEnter;
