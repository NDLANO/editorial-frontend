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
  memo,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Editor, Range } from "slate";
import { useSlate, useSlateSelection } from "slate-react";
import styled from "@emotion/styled";
import { ToggleGroup, Toolbar, ToolbarSeparator } from "@radix-ui/react-toolbar";
import { colors, spacing, misc, stackOrder } from "@ndla/core";
import { ToolbarBlockOptions } from "./ToolbarBlockOptions";
import { ToolbarInlineOptions } from "./ToolbarInlineOptions";
import { ToolbarLanguageOptions } from "./ToolbarLanguageOptions";
import { ToolbarMarkOptions } from "./ToolbarMarkOptions";
import {
  getEditorAncestors,
  toolbarState,
  CategoryFilters,
  AreaFilters,
  ToolbarValue,
  ToolbarValues,
} from "./toolbarState";
import { ToolbarTableOptions } from "./ToolbarTableOptions";
import { ToolbarTextOptions } from "./ToolbarTextOptions";

const ToolbarContainer = styled(Toolbar)`
  position: absolute;
  align-self: center;
  opacity: 0;
  transition: opacity 0.75s;
  z-index: ${stackOrder.modal - stackOrder.offsetSingle};
  border: 1px solid ${colors.brand.tertiary};
  border-radius: ${misc.borderRadius};
  background-color: ${colors.white};
  padding: ${spacing.xsmall};
  overflow: visible;
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
`;

const StyledToolbarRow = styled.div`
  display: flex;
`;

const StyledToolbarSeparator = styled(ToolbarSeparator)`
  margin: 0 ${spacing.xxsmall};
  width: 1px;
  background-color: ${colors.brand.greyLight};
  &:last-child {
    display: none;
  }
`;

export const StyledToggleGroup = styled(ToggleGroup)`
  display: flex;
  gap: ${spacing.xxsmall};
`;

const showToolbar = (toolbar: HTMLElement, editorWrapper: HTMLElement) => {
  toolbar.style.display = "flex";
  const native = window.getSelection();
  if (!native) {
    return;
  }
  const range = native.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  const editorRect = editorWrapper.getBoundingClientRect();
  toolbar.style.opacity = "1";

  const left =
    rect.left < toolbar.offsetWidth / 2
      ? 10 - editorRect.left
      : +-editorRect.left + rect.left + rect.width / 2 - toolbar.offsetWidth / 2;

  toolbar.style.top = `${rect.top - editorRect.top - toolbar.offsetHeight}px`;
  toolbar.style.left = `${left}px`;
};

interface Props {
  options: CategoryFilters;
  areaOptions: AreaFilters;
  hideToolbar?: boolean;
}

export interface ToolbarCategoryProps<T extends ToolbarValues> {
  options: ToolbarValue<T>[];
}

const SlateToolbar = ({ options: toolbarOptions, areaOptions, hideToolbar: hideToolbarProp }: Props) => {
  const portalRef = useRef<HTMLDivElement | null>(null);
  const selection = useSlateSelection();
  const editor = useSlate();
  const editorWrapper = useRef<HTMLDivElement | null>(null);

  const hideToolbar = useMemo(() => {
    return (
      !selection ||
      hideToolbarProp ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === "" ||
      !editor.shouldShowToolbar()
    );
  }, [hideToolbarProp, editor, selection]);

  useEffect(() => {
    if (!portalRef.current) return;
    if (!editorWrapper.current) {
      editorWrapper.current = portalRef.current.closest("[data-editor]") as HTMLDivElement;
    }
    if (hideToolbar) {
      portalRef.current.removeAttribute("style");
    } else {
      showToolbar(portalRef.current, editorWrapper.current!);
    }
  });

  const onMouseDown = useCallback((e: MouseEvent) => e.preventDefault(), []);

  const options = useMemo(() => {
    if (hideToolbar) return;
    return toolbarState({
      editorAncestors: getEditorAncestors(editor),
      options: toolbarOptions,
      areaOptions,
    });
  }, [areaOptions, editor, hideToolbar, toolbarOptions]);

  if (hideToolbar) {
    return null;
  }

  return (
    <ToolbarContainer data-toolbar="" ref={portalRef} onMouseDown={onMouseDown}>
      <ToolbarRow>
        <ToolbarTextOptions options={options?.text ?? []} />
        <ToolbarLanguageOptions options={options?.languages ?? []} />
        <ToolbarMarkOptions options={options?.mark ?? []} />
        <ToolbarBlockOptions options={options?.block ?? []} />
        <ToolbarInlineOptions options={options?.inline ?? []} />
        <ToolbarTableOptions options={options?.table ?? []} />
      </ToolbarRow>
    </ToolbarContainer>
  );
};

const ToolbarRow = forwardRef<HTMLDivElement, ComponentPropsWithRef<"div">>(({ children, ...rest }, ref) => {
  const count = Children.count(children);

  // Do not draw separators for categories with only disabled and hidden options
  const validChildren = Children.toArray(children).filter(
    (child) =>
      isValidElement<ToolbarCategoryProps<ToolbarValues>>(child) &&
      !child.props.options?.every((el) => el.hidden === true),
  );

  return (
    <StyledToolbarRow ref={ref} {...rest}>
      {Children.map(validChildren, (child, i) => (
        <>
          {child}
          {i < count && <StyledToolbarSeparator />}
        </>
      ))}
    </StyledToolbarRow>
  );
});

export default memo(SlateToolbar);
