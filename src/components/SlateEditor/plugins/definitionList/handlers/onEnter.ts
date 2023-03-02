import { Editor, Element, Path, Transforms, Node, Point } from 'slate';
import { TYPE_DEFINTION_TERM, TYPE_DEFINTION_DESCRIPTION } from '../types';
import {
  definitionTerm,
  definitionDescription,
  nodeContainsText,
  removeDefinitionPair,
  moveSelectionOutOfDefinitionList,
} from '../utils';

const onEnter = (
  editor: Editor,
  e: KeyboardEvent,
  nextOnKeyDown: ((e: KeyboardEvent) => void) | undefined,
) => {
  if (e.shiftKey && nextOnKeyDown) return nextOnKeyDown(e);
  if (!editor.selection && nextOnKeyDown) return nextOnKeyDown(e);
  else if (!editor.selection) return undefined;

  const [, selectedPath] = editor.selection && Editor.node(editor, editor.selection.focus);
  const [selectedDefinitionItem, selectedDefinitionItemPath] = Editor.parent(editor, selectedPath);

  if (
    Element.isElement(selectedDefinitionItem) &&
    selectedDefinitionItem.type === TYPE_DEFINTION_TERM
  ) {
    const [, selectedTermPath] = [selectedDefinitionItem, selectedDefinitionItemPath];
    e.preventDefault();

    if (Path.hasPrevious(selectedTermPath)) {
      const previous = Editor.previous(editor, { at: selectedTermPath });
      if (previous) {
        const [previousDefinitionDescription, previousDefinitionDescriptionPath] = previous;

        if (!nodeContainsText(previousDefinitionDescription)) {
          Editor.withoutNormalizing(editor, () => {
            removeDefinitionPair(editor, Path.next(selectedTermPath), selectedTermPath);
            moveSelectionOutOfDefinitionList(editor, previousDefinitionDescriptionPath);
          });
          return;
        }
      }
    }
    Transforms.select(editor, Editor.point(editor, Path.next(selectedTermPath)));
    return;
  } else if (
    Element.isElement(selectedDefinitionItem) &&
    selectedDefinitionItem.type === TYPE_DEFINTION_DESCRIPTION
  ) {
    const [selectedDescription, selectedDescriptionPath] = [
      selectedDefinitionItem,
      selectedDefinitionItemPath,
    ];

    const [selectedTerm, selectedTermPath] = Editor.node(
      editor,
      Path.previous(selectedDescriptionPath),
    );

    //If empty move selection out of list
    if (!nodeContainsText(selectedDescription) && !nodeContainsText(selectedTerm)) {
      Editor.withoutNormalizing(editor, () =>
        moveSelectionOutOfDefinitionList(editor, selectedDescriptionPath),
      );
      // Potential if, if empty description and empty term remove row and move out selection
      Editor.withoutNormalizing(editor, () =>
        removeDefinitionPair(editor, selectedDescriptionPath, selectedTermPath),
      );
      e.preventDefault();
      return;
    } else {
      // If not empty insert new definition pair
      Editor.withoutNormalizing(editor, () => {
        Transforms.insertNodes(editor, [definitionDescription], {
          at: Path.next(selectedDescriptionPath),
        });
        Transforms.insertNodes(editor, [definitionTerm], {
          at: Path.next(selectedDescriptionPath),
        });
        Transforms.select(editor, Editor.point(editor, Path.next(selectedDescriptionPath)));
      });

      e.preventDefault();

      return;
    }
  }
  return nextOnKeyDown && nextOnKeyDown(e);
};

export default onEnter;
