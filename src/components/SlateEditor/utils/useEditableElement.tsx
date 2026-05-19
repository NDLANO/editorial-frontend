/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PopoverInteractOutsideEvent } from "@ark-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BaseSelection, Editor, Element, Path, Range, Transforms } from "slate";
import { ReactEditor } from "slate-react";

export type FinalFocusElementFunction = (element: Element, path: Path) => Path;

interface UseEditableElementOptions {
  finalFocusEl?: (element: Element, path: Path) => Path;
  unwrapOnAutoRemove?: boolean;
  collapse?: "start" | "end";
}

export const useEditableElement = <T extends Element>(
  element: T,
  editor: Editor,
  options?: UseEditableElementOptions,
) => {
  const [isEditing, setIsEditing] = useState("isFirstEdit" in element ? !!element.isFirstEdit : false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState<VoidFunction | undefined>(undefined);
  const [hasExited, setHasExited] = useState<"true" | "false" | "indeterminate">("indeterminate");
  const pendingFocusPath = useRef<BaseSelection | Path | null>(null);
  const outsideInteractionRange = useRef<Path | null>(null);

  useEffect(() => {
    if (hasExited === "true" && typeof pendingRemoval !== "undefined") {
      pendingRemoval();
      setPendingRemoval(undefined);
    }
  }, [editor, hasExited, pendingRemoval]);

  const _handleRemove = useCallback(
    (unwrap?: boolean) => {
      setIsEditing(false);
      ReactEditor.focus(editor);
      const path = ReactEditor.findPath(editor, element);
      if (!pendingFocusPath.current) {
        if (editor.selection) {
          pendingFocusPath.current = editor.selection;
        }
      }
      const func = unwrap ? Transforms.unwrapNodes : Transforms.removeNodes;
      const voidFunc = () => func(editor, { at: path, voids: true });
      if (isEditing) {
        setPendingRemoval(() => {
          return voidFunc;
        });
      } else voidFunc();
    },
    [editor, element, isEditing],
  );

  const handleRemove = useCallback(() => _handleRemove(), [_handleRemove]);
  const handleUnwrap = useCallback(() => _handleRemove(true), [_handleRemove]);

  const handleSave = useCallback(
    (properties: Partial<T>) => {
      setIsEditing(false);
      const path = ReactEditor.findPath(editor, element);
      const finalFocusEl = options?.finalFocusEl?.(element, path);
      // This usually happens when we're inserting an element from the block picker.
      if (!pendingFocusPath.current) {
        pendingFocusPath.current = finalFocusEl ?? path;
      }
      const data = "isFirstEdit" in element && element.isFirstEdit ? { ...properties, isFirstEdit: false } : properties;
      Transforms.setNodes(editor, data, { at: path });
    },
    [element, editor, options],
  );

  /**
   * Event handler for when the editing state of a dialog or popover changes. It attempts to restore focus to the element that was being edited.
   * If the editor had a selection when the editing started, it will attempt to restore that selection.
   *
   * If the element has `isFirstEdit` set to true when the editing state is set to false, it will automatically remove the element from the editor.
   */
  const handleEditingChange = useCallback(
    (editing: boolean, shouldBlock?: boolean) => {
      if (!editing && shouldBlock) {
        setIsBlocked(true);
        return;
      }
      const path = ReactEditor.findPath(editor, element);
      if (editing) {
        setHasExited("false");
        if (editor.selection && Range.includes(editor.selection, path)) {
          pendingFocusPath.current = editor.selection;
        } else {
          pendingFocusPath.current = path;
        }
      }

      if (!editing && !pendingFocusPath.current) {
        if (editor.selection && Range.includes(editor.selection, path)) {
          pendingFocusPath.current = editor.selection;
        } else {
          pendingFocusPath.current = path;
        }
      }

      setIsEditing(editing);
      if ("isFirstEdit" in element && element.isFirstEdit && !editing) {
        const func = options?.unwrapOnAutoRemove ? Transforms.unwrapNodes : Transforms.removeNodes;
        const voidFunc = () => func(editor, { at: path, voids: true });
        setPendingRemoval(() => {
          return voidFunc;
        });
      }
    },
    [element, editor, options],
  );

  const confirmClose = useCallback(() => {
    setIsBlocked(false);
    handleEditingChange(false);
  }, [handleEditingChange]);

  const cancelClose = useCallback(() => {
    setIsBlocked(false);
  }, []);

  const onEditingExit = useCallback(() => {
    // This is a case that can happen when a user clicks outside of an active popover. If outsideInteractionRange is set,
    // it means that the user clicked something in the editor that we managed to convert to a range. We should therefore let
    // the editor handle it.
    setHasExited("true");
    if (outsideInteractionRange.current) {
      outsideInteractionRange.current = null;
      return;
    }

    // I don't know why this works, but it does.
    // See https://github.com/ianstormtaylor/slate/issues/5810#issuecomment-2676971341
    // Apparently, we need to sync the editor state with the DOM before we can focus it, even though we haven't made any changes.
    editor.onChange();
    ReactEditor.focus(editor);
    if (pendingFocusPath.current) {
      Transforms.select(editor, pendingFocusPath.current);
    }
    return;
  }, [editor]);

  const onMoveOutside = useCallback(
    (event: PopoverInteractOutsideEvent) => {
      try {
        const range = ReactEditor.findEventRange(editor, event.detail.originalEvent);
        outsideInteractionRange.current = range.anchor.path;
      } catch (_) {
        return;
      }
    },
    [editor],
  );

  return {
    isEditing,
    handleRemove,
    handleUnwrap,
    handleSave,
    handleEditingChange,
    onEditingExit,
    onMoveOutside,
    isBlocked,
    confirmClose,
    cancelClose,
    dialogProps: {
      open: isEditing,
      onOpenChange: (details: { open: boolean }) => handleEditingChange(details.open),
      onExitComplete: onEditingExit,
    },
    popoverProps: {
      open: isEditing,
      onOpenChange: (details: { open: boolean }) => handleEditingChange(details.open),
      onExitComplete: onEditingExit,
      onInteractOutside: onMoveOutside,
    },
  };
};
