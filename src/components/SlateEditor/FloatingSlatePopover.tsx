/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useState } from "react";
import { Editor, Element, NodeEntry, Range } from "slate";
import { ReactEditor, useFocused, useSlate } from "slate-react";
import { UsePopoverProps, UsePopoverReturn } from "@ark-ui/react";
import { usePopover } from "@ndla/primitives";

interface FloatingSlatePopoverParams<T extends Element> extends UsePopoverProps {
  triggerKey?: string;
  condition?: (editor: Editor, event: KeyboardEvent) => NodeEntry<T> | null | void;
}

export interface UseFloatingSlatePopover<T extends Element> {
  popover: UsePopoverReturn;
  togglePopover: (open: boolean, nodeEntry?: NodeEntry<T> | null) => void;
  triggerEl: HTMLElement | null;
  nodeEntry: NodeEntry<T> | null | undefined;
}

export const useFloatingSlatePopover = <T extends Element>({
  triggerKey = "Enter",
  condition = () => null,
  positioning,
  ...rest
}: FloatingSlatePopoverParams<T> = {}): UseFloatingSlatePopover<T> => {
  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null);
  const [nodeEntry, setNodeEntry] = useState<NodeEntry<T> | null | undefined>(null);
  const [open, setOpen] = useState(false);
  const editor = useSlate();
  const isFocused = useFocused();

  const getAnchorRect = useCallback(() => {
    return triggerEl?.getBoundingClientRect() ?? null;
  }, [triggerEl]);

  const popover = usePopover({
    open,
    // autoFocus: false,
    onOpenChange: (details) => setOpen(details.open),
    positioning: {
      getAnchorRect,
      ...positioning,
    },
    ...rest,
  });

  const togglePopover = useCallback(
    (open: boolean, nodeEntry?: NodeEntry<T> | null) => {
      const domElement = nodeEntry ? ReactEditor.toDOMNode(editor, nodeEntry[0]) : null;
      setTriggerEl(open ? domElement ?? null : null);
      setNodeEntry(nodeEntry);
      setOpen(open);
    },
    [editor],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { selection } = editor;
      if (event.key !== triggerKey || !isFocused || !selection) return;
      const nodeEntry = condition(editor, event);
      if (!nodeEntry) return;
      if (Range.isCollapsed(selection)) {
        event.preventDefault();
        togglePopover(true, nodeEntry);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [condition, editor, isFocused, togglePopover, triggerKey]);

  return {
    triggerEl,
    popover,
    togglePopover,
    nodeEntry,
  };
};
