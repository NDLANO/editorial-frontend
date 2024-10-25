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
  Dispatch,
  forwardRef,
  isValidElement,
  memo,
  MouseEvent,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { BaseRange, Editor, Range } from "slate";
import { useSlate, useSlateSelection } from "slate-react";
import styled from "@emotion/styled";
import { Portal } from "@radix-ui/react-portal";
import { ToggleGroup, Toolbar, ToolbarSeparator } from "@radix-ui/react-toolbar";
import { colors, spacing, misc, stackOrder } from "@ndla/core";
import { ToolbarBlockOptions } from "./ToolbarBlockOptions";
import { ToolbarInlineOptions } from "./ToolbarInlineOptions";
import { ToolbarLanguageOptions } from "./ToolbarLanguageOptions";
import { ToolbarLLMOptions } from "./ToolbarLLMOptions";
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

const ToolbarContainer = styled(Toolbar)`
  position: absolute;
  align-self: center;
  opacity: 0;
  transition: opacity 0.75s;
  border: 1px solid ${colors.brand.tertiary};
  border-radius: ${misc.borderRadius};
  background-color: ${colors.white};
  padding: ${spacing.xsmall};
  overflow: visible;
  display: flex;
  flex-direction: column;
  gap: ${spacing.xsmall};
  pointer-events: auto !important;
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

const showToolbar = (toolbar: HTMLElement, modalRef: HTMLElement | null) => {
  toolbar.style.display = "flex";
  const native = window.getSelection();
  if (!native) {
    return;
  }
  const range = native.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  toolbar.style.opacity = "1";
  toolbar.style.zIndex = `${modalRef ? stackOrder.modal + stackOrder.popover : stackOrder.popover}`;

  const left = rect.left < toolbar.offsetWidth / 2 ? 10 : rect.left + rect.width / 2 - toolbar.offsetWidth / 2;

  toolbar.style.top = `${rect.top + window.scrollY - toolbar.offsetHeight}px`;
  toolbar.style.left = `${left}px`;
};

export interface ToolbarCategoryProps<T extends ToolbarValues> {
  options: ToolbarValue<T>[];
}

interface Props {
  options: CategoryFilters;
  areaOptions: AreaFilters;
  hideToolbar?: boolean;
  selectors?: { [key: string]: Dispatch<SetStateAction<BaseRange | null>> };
}

const SlateToolbar = ({ options: toolbarOptions, areaOptions, hideToolbar: hideToolbarProp, selectors }: Props) => {
  const portalRef = useRef<HTMLDivElement | null>(null);
  const selection = useSlateSelection();
  const editor = useSlate();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const hasCheckedForModal = useRef(false);

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
    const portal = portalRef.current;
    if (!portal) return;
    if (!hasCheckedForModal.current) {
      modalRef.current = document.querySelector('[role="dialog"]') as HTMLDivElement;
      hasCheckedForModal.current = true;
    }
    showToolbar(portal, modalRef.current);
    return () => {
      if (portal && modalRef.current) {
        portal.removeAttribute("style");
        hasCheckedForModal.current = false;
      }
    };
  });

  // This effect only affects the toolbar when it exists inside a modal. It handles placing the toolbar when
  // a modal is scrollable.
  useEffect(() => {
    if (hideToolbar) return;
    const initialScroll = modalRef.current?.scrollTop ?? 0;
    const onModalScroll = () => {
      if (!modalRef.current || !portalRef.current) return;
      const scroll = initialScroll - modalRef.current.scrollTop;
      portalRef.current.style.transform = `translateY(${scroll}px)`;
    };
    modalRef.current?.addEventListener("scroll", onModalScroll);
    return () => {
      modalRef.current?.removeEventListener("scroll", onModalScroll);
    };
  }, [hideToolbar]);

  const onMouseDown = useCallback((e: MouseEvent) => e.preventDefault(), []);

  const options = useMemo(() => {
    if (hideToolbar) return;
    return toolbarState({
      editorAncestors: getSelectionElements(editor, selection),
      options: toolbarOptions,
      areaOptions,
    });
  }, [areaOptions, editor, hideToolbar, toolbarOptions, selection]);

  if (hideToolbar) {
    return null;
  }

  return (
    <Portal asChild>
      <ToolbarContainer data-toolbar="" ref={portalRef} onMouseDown={onMouseDown}>
        <ToolbarRow>
          <ToolbarTextOptions options={options?.text ?? []} />
          <ToolbarLanguageOptions options={options?.languages ?? []} />
          <ToolbarMarkOptions options={options?.mark ?? []} />
          <ToolbarBlockOptions options={options?.block ?? []} />
          <ToolbarInlineOptions options={options?.inline ?? []} />
          <ToolbarTableOptions options={options?.table ?? []} />
          {selectors && <ToolbarLLMOptions options={options?.llm ?? []} selectors={selectors} />}
        </ToolbarRow>
      </ToolbarContainer>
    </Portal>
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
