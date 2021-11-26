import { Editor, Element, Transforms, Path } from 'slate';
import { ReactEditor } from 'slate-react';

import hasNodeOfType from '../../../utils/hasNodeOfType';
import { TYPE_LIST, TYPE_LIST_ITEM } from '../types';

import { defaultListBlock } from '../utils/defaultBlocks';
import getCurrentBlock from '../../../utils/getCurrentBlock';
import { firstTextBlockElement } from '../../../utils/normalizationHelpers';

const onTab = (event: KeyboardEvent, editor: Editor, next?: (event: KeyboardEvent) => void) => {
  if (!editor.selection) return next && next(event);
  const isList = hasNodeOfType(editor, TYPE_LIST);

  if (!isList) {
    return next && next(event);
  }

  const listEntry = getCurrentBlock(editor, TYPE_LIST);
  const listItemEntry = getCurrentBlock(editor, TYPE_LIST_ITEM);

  if (!listEntry || !listItemEntry) {
    return next && next(event);
  }

  const [currentListNode, currentListPath] = listItemEntry;
  const [currentItemNode, currentItemPath] = listEntry;
  const [[currentTextBlockNode, currentTextBlockPath]] = Editor.nodes(editor, {
    match: n => Element.isElement(n) && firstTextBlockElement.includes(n.type),
    mode: 'lowest',
  });

  if (
    currentItemNode &&
    Element.isElement(currentItemNode) &&
    currentItemNode.type === TYPE_LIST_ITEM &&
    currentListNode &&
    Element.isElement(currentListNode) &&
    currentListNode.type === TYPE_LIST &&
    // selected text block node must be a direct child of list item.
    currentTextBlockNode &&
    Path.isChild(currentTextBlockPath, currentItemPath)
  ) {
    event.preventDefault();
    if (!editor.selection) {
      return next && next(event);
    }
    if (
      Path.isDescendant(editor.selection.anchor.path, currentItemPath) &&
      Path.isDescendant(editor.selection.focus.path, currentItemPath)
    ) {
      Editor.withoutNormalizing(editor, () => {
        // Move list-elements up (left)
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
          // Otherwise: It should exist a list item (targetPath) outside of the current list.
          // Try to move current list item there.
          const targetPath = Path.parent(Path.parent(currentItemPath));
          if (Editor.hasPath(editor, targetPath)) {
            const [targetItemNode] = Editor.node(editor, targetPath);
            if (Element.isElement(targetItemNode) && targetItemNode.type === TYPE_LIST_ITEM) {
              // If current item contains more than one block, they should be moved as well
              if (Editor.hasPath(editor, Path.next(currentItemPath))) {
                const anchor = Editor.start(editor, Path.next(currentItemPath));
                const focus = Editor.end(editor, [
                  ...currentListPath,
                  currentListNode.children.length - 1,
                ]);
                if (anchor && focus) {
                  const childList = currentItemNode.children[currentItemNode.children.length - 1];
                  if (Element.isElement(childList) && childList.type === TYPE_LIST) {
                    // Child list will be changed to match current list type
                    if (childList.listType !== currentListNode.listType) {
                      Transforms.setNodes(
                        editor,
                        {
                          listType: currentListNode.listType,
                        },
                        {
                          at: [...currentItemPath, currentItemNode.children.length - 1],
                        },
                      );
                    }
                    // move any following list-items of selected list to the child list.
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
                  }
                }
              }
              // If current list is followed by more blocks, move the blocks to the selected list item
              if (Editor.hasPath(editor, Path.next(currentListPath))) {
                Transforms.moveNodes(editor, {
                  match: node => Element.isElement(node) && node.type === TYPE_LIST,
                  at: {
                    anchor: Editor.start(editor, Path.next(currentListPath)),
                    focus: Editor.end(editor, [...parentPath, parentNode.children.length - 1]),
                  },
                  to: [...currentItemPath, currentItemNode.children.length],
                });
              }

              // Move selected list item to correct index in upper list.
              Transforms.moveNodes(editor, {
                at: currentItemPath,
                to: Path.next(targetPath),
              });
              // Clean up old list node if it initally had one item only
              if (currentListNode.children.length === 1 || !Path.hasPrevious(currentItemPath)) {
                Transforms.removeNodes(editor, { at: currentListPath });
              }
              return;
            }
          }

          // Move list item down
        } else {
          // Only if it is not the first sibling.
          if (Path.hasPrevious(currentItemPath)) {
            const previousPath = Path.previous(currentItemPath);
            const [previousNode] = Editor.node(editor, previousPath);

            if (Element.isElement(previousNode) && previousNode.type === TYPE_LIST_ITEM) {
              const [lastNode, lastNodePath] = Editor.node(editor, [
                ...previousPath,
                previousNode.children.length - 1,
              ]);
              // If previous list item has a sublist, move current item inside it.
              if (Element.isElement(lastNode) && lastNode.type === TYPE_LIST) {
                return Transforms.moveNodes(editor, {
                  at: currentItemPath,
                  to: [...lastNodePath, lastNode.children.length],
                });
                // Wrap current item inside a new list and move the new list to the previous list item.
              } else {
                Transforms.wrapNodes(editor, defaultListBlock(currentListNode.listType), {
                  at: currentItemPath,
                });
                Transforms.moveNodes(editor, {
                  at: currentItemPath,
                  to: [...previousPath, previousNode.children.length],
                });
              }
            }
          }
        }
      });
    }
  } else {
    return next && next(event);
  }
};

export default onTab;
