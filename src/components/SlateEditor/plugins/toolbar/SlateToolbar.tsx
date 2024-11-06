/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  Children,
  ComponentPropsWithRef,
  forwardRef,
  isValidElement,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Editor, Range } from "slate";
import { useFocused, useSlate, useSlateSelection } from "slate-react";
import { usePopoverContext } from "@ark-ui/react";
import { PopoverContent, PopoverRoot } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ToolbarBlockOptions } from "./ToolbarBlockOptions";
import { ToolbarInlineOptions } from "./ToolbarInlineOptions";
import { ToolbarLanguageOptions } from "./ToolbarLanguageOptions";
import { ToolbarMarkOptions } from "./ToolbarMarkOptions";
import {
  getSelectionElements,
  toolbarState,
  CategoryFilters,
  AreaFilters,
  ToolbarValue,
  ToolbarValues,
} from "./toolbarState";
import { ToolbarTableOptions } from "./ToolbarTableOptions";
import { ToolbarTextOptions } from "./ToolbarTextOptions";

const ToolbarContainer = styled(PopoverContent, {
  base: {
    border: "1px solid",
    isolation: "isolate",
    borderColor: "stroke.subtle",
    padding: "4xsmall",
    textStyle: "body.medium",
    userSelect: "none",
    zIndex: "dropdown",
    rowGap: "xsmall",
    display: "grid",
    "& > *": {
      paddingInline: "3xsmall",
    },
    wide: {
      gridTemplateColumns: "repeat(6, auto)",
      "& > :not(:last-child)": {
        borderRight: "1px solid",
      },
    },
    tabletWideToWide: {
      gridTemplateColumns: "repeat(3, auto)",
      "& > :not(:last-child):not(:nth-child(3n))": {
        borderRight: "1px solid",
      },
    },
    tabletWideDown: {
      gridTemplateColumns: "repeat(2, auto)",
      "& > :not(:last-child):not(:nth-child(2n))": {
        borderRight: "1px solid",
      },
    },
  },
});

export interface ToolbarCategoryProps<T extends ToolbarValues> {
  options: ToolbarValue<T>[];
}

interface Props {
  options: CategoryFilters;
  areaOptions: AreaFilters;
  hideToolbar?: boolean;
}
const checkHasSelectionWithin = (el?: Element | null) => {
  if (!el) return false;

  const selection = el.ownerDocument.getSelection();
  if (!selection?.rangeCount) return false;

  const range = selection.getRangeAt(0);
  return !range.collapsed && el.contains(range.commonAncestorContainer);
};

const SlateToolbar = ({ options: toolbarOptions, areaOptions, hideToolbar: hideToolbarProp }: Props) => {
  const selection = useSlateSelection();
  const editor = useSlate();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const editorWrapperRef = useRef<HTMLDivElement | null>(null);
  const editorFocused = useFocused();
  const [open, setOpen] = useState(false);
  const [hasSelectionWithin, setHasSelectionWithin] = useState(false);
  const [hasMouseDown, setHasMouseDown] = useState(false);

  useEffect(() => {
    if (toolbarRef.current) {
      editorWrapperRef.current = toolbarRef.current.closest("[data-slate-wrapper]") as HTMLDivElement;
    }
  }, []);

  useEffect(() => {
    const onSelect = () => {
      setHasSelectionWithin(!!checkHasSelectionWithin(editorWrapperRef.current));
    };

    document.addEventListener("selectionchange", onSelect);
    return () => {
      document.removeEventListener("selectionchange", onSelect);
    };
  }, []);

  useEffect(() => {
    const element = editorWrapperRef.current?.querySelector("[data-slate-editor]");
    if (!element) return;
    const onMouseDown = () => {
      setHasMouseDown(true);
    };

    const onMouseUp = () => {
      setHasMouseDown(false);
    };

    element.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      element.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  useEffect(() => {
    const nonCollapsed = selection && !Range.isCollapsed(selection);
    if (nonCollapsed && hasSelectionWithin && !hasMouseDown) {
      setOpen(true);
    } else if (!document.activeElement?.closest('[role="dialog"]')) {
      setOpen(false);
    }
  }, [editor, editor.selection, editorFocused, hasMouseDown, hasSelectionWithin, selection]);

  const hideToolbar = useMemo(() => {
    return (
      hasMouseDown ||
      !open ||
      !selection ||
      !hasSelectionWithin ||
      hideToolbarProp ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === "" ||
      !editor.shouldShowToolbar()
    );
  }, [hasMouseDown, open, selection, hasSelectionWithin, hideToolbarProp, editor]);

  const options = useMemo(() => {
    if (hideToolbar) return;
    return toolbarState({
      editorAncestors: getSelectionElements(editor, selection),
      options: toolbarOptions,
      areaOptions,
    });
  }, [hideToolbar, editor, selection, toolbarOptions, areaOptions]);

  return (
    <PopoverRoot
      open={open}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={false}
      positioning={{
        strategy: "fixed",
        placement: "top",
        getAnchorRect() {
          const selection = editorWrapperRef.current?.ownerDocument.getSelection();
          if (!selection?.rangeCount) return null;
          const range = selection.getRangeAt(0);
          return range.getBoundingClientRect();
        },
      }}
    >
      <ToolbarRepositioner ref={toolbarRef} />
      <ToolbarContainer data-toolbar="" hidden={hideToolbar}>
        <ToolbarRow>
          <ToolbarTextOptions options={options?.text ?? []} />
          <ToolbarLanguageOptions options={options?.languages ?? []} />
          <ToolbarMarkOptions options={options?.mark ?? []} />
          <ToolbarBlockOptions options={options?.block ?? []} />
          <ToolbarInlineOptions options={options?.inline ?? []} />
          <ToolbarTableOptions options={options?.table ?? []} />
        </ToolbarRow>
      </ToolbarContainer>
    </PopoverRoot>
  );
};

const ToolbarRepositioner = forwardRef<HTMLDivElement, ComponentPropsWithRef<"div">>((props, ref) => {
  const { open, reposition } = usePopoverContext();
  const selection = useSlateSelection();

  useEffect(() => {
    if (open) {
      reposition();
    }
  }, [open, reposition, selection]);

  return <div ref={ref} {...props} />;
});

const ToolbarRow = ({ children }: { children: ReactNode }) => {
  // Do not render categories with only disabled and hidden options
  const validChildren = Children.toArray(children).filter(
    (child) =>
      isValidElement<ToolbarCategoryProps<ToolbarValues>>(child) &&
      !child.props.options?.every((el) => el.hidden === true),
  );

  return validChildren;
};

export default SlateToolbar;
