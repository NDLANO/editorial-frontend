import { KeyboardEvent, KeyboardEventHandler } from 'react';
import { Editor, Element, Transforms, Path, Node, Range } from 'slate';
import { ReactEditor } from 'slate-react';

import hasNodeOfType from '../../../utils/hasNodeOfType';
import { TYPE_LIST, TYPE_LIST_ITEM } from '..';

import { getListItemType, isListItemSelected } from '../utils/isSelectionOnlyOfType';
import { defaultListBlock, defaultListItemBlock } from '../utils/defaultBlocks';
import getCurrentBlock from '../../../utils/getCurrentBlock';

const onTab = (
  event: KeyboardEvent<HTMLDivElement>,
  editor: Editor,
  next?: KeyboardEventHandler<HTMLDivElement>,
) => {
  // If no selection use default behaviour.
  if (!editor.selection) return next && next(event);
  const isList = hasNodeOfType(editor, TYPE_LIST);

  if (!isList) {
    return next && next(event);
  }

  const [currentItemNode, currentItemPath] = getCurrentBlock(editor, TYPE_LIST_ITEM);
  const [currentListNode, currentListPath] = getCurrentBlock(editor, TYPE_LIST);

  if (
    currentItemNode &&
    Element.isElement(currentItemNode) &&
    currentItemNode.type === TYPE_LIST_ITEM &&
    currentListNode &&
    Element.isElement(currentListNode) &&
    currentListNode.type === TYPE_LIST
  ) {
    event.preventDefault();
    if (!editor.selection) {
      return;
    }
    if (
      Path.isDescendant(editor.selection.anchor.path, currentItemPath) &&
      Path.isDescendant(editor.selection.focus.path, currentItemPath)
    ) {
      // Move list-elements up
      if (event.shiftKey) {
        const [parentNode, parentPath] = Editor.node(editor, Path.parent(currentListPath));
        // If item at highest level in list => Lift entire list element out of current list.
        // The list element will be unwrapped in list normalizer.
        if (!Element.isElement(parentNode) || parentNode.type !== TYPE_LIST_ITEM) {
          const childList = currentItemNode.children[currentItemNode.children.length - 1];
          if (Element.isElement(childList) && childList.type === TYPE_LIST) {
            if (childList.listType !== currentListNode.listType) {
              Transforms.setNodes(
                editor,
                { listType: currentListNode.listType },
                { at: [...currentItemPath, currentItemNode.children.length - 1] },
              );
            }
          }
          return Transforms.liftNodes(editor, { at: currentItemPath });
        }

        const targetPath = Path.parent(Path.parent(currentItemPath));
        if (Editor.hasPath(editor, targetPath)) {
          const [targetItemNode] = Editor.node(editor, targetPath);
          if (Element.isElement(targetItemNode) && targetItemNode.type === TYPE_LIST_ITEM) {
            if (Editor.hasPath(editor, Path.next(currentItemPath))) {
              const anchor = Editor.start(editor, Path.next(currentItemPath));
              const focus = Editor.end(editor, [
                ...currentListPath,
                currentListNode.children.length - 1,
              ]);
              if (anchor && focus) {
                const childList = currentItemNode.children[currentItemNode.children.length - 1];
                if (Element.isElement(childList) && childList.type === TYPE_LIST) {
                  // Change child list if necessary and move any following list-elements of selected list to the child list.
                  if (childList.listType !== currentListNode.listType) {
                    Transforms.setNodes(
                      editor,
                      { listType: currentListNode.listType },
                      { at: [...currentItemPath, currentItemNode.children.length - 1] },
                    );
                  }
                  Transforms.moveNodes(editor, {
                    match: node => Element.isElement(node) && node.type === TYPE_LIST_ITEM,
                    mode: 'lowest',
                    at: {
                      anchor,
                      focus,
                    },
                    to: [
                      ...currentItemPath,
                      currentItemNode.children.length - 1,
                      childList.children.length,
                    ],
                  });
                } else {
                  // If a child list does not exist and following items exist, wrap following items in list and move it
                  // inside selected item
                  Editor.withoutNormalizing(editor, () => {
                    Transforms.wrapNodes(editor, defaultListBlock(currentListNode.listType), {
                      match: node => {
                        if (!(Element.isElement(node) && node.type === TYPE_LIST_ITEM)) {
                          return false;
                        }
                        const nodePath = ReactEditor.findPath(editor, node);
                        if (Path.equals(Path.parent(nodePath), Path.parent(currentItemPath))) {
                          return true;
                        }
                        return false;
                      },
                      at: {
                        anchor,
                        focus,
                      },
                    });
                    Transforms.moveNodes(editor, {
                      at: Path.next(currentItemPath),
                      to: [...currentItemPath, currentItemNode.children.length],
                    });
                  });
                }
              }
            }

            // Move selected item to correct index in upper list.
            Transforms.moveNodes(editor, {
              at: currentItemPath,
              to: Path.next(targetPath),
            });
            // Clean up old list node if it initally had one item only
            if (currentListNode.children.length === 1 || !Path.hasPrevious(currentItemPath)) {
              Transforms.removeNodes(editor, { at: currentListPath });
            }
          }
        }
      }
    }
  } else {
    return next && next(event);
  }
};

export default onTab;
