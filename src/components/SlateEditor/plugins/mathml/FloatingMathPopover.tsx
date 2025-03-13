/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, useCallback, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Path, Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { Portal } from "@ark-ui/react";
import { getClosestEditor } from "@ndla/editor-components";
import { DeleteBinLine, PencilLine } from "@ndla/icons";
import { IconButton, PopoverContent, PopoverRootProvider, PopoverTitle } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useMathDialog } from "./FloathingMathDialog";
import { MathmlElement } from "./mathTypes";
import { isMathElement } from "./queries/mathQueries";
import { useFloatingSlatePopover, UseFloatingSlatePopover } from "../../FloatingSlatePopover";

const MathEditorContext = createContext<UseFloatingSlatePopover<MathmlElement> | null>(null);

export const FloatingMathEditorProvider = ({ children }: { children: React.ReactNode }) => {
  const condition = useCallback((editor: Editor) => {
    return editor.nodes({ match: isMathElement }).next().value;
  }, []);
  const popover = useFloatingSlatePopover({ condition });
  return <MathEditorContext.Provider value={popover}>{children}</MathEditorContext.Provider>;
};

export const useFloatingMathPopover = () => {
  const context = useContext(MathEditorContext);
  if (!context) {
    throw new Error("useFloatingMathPopover must be used within a FloatingMathEditorProvider");
  }
  return context;
};

const StyledPopoverContent = styled(PopoverContent, {
  base: {
    padding: "xsmall",
  },
});

const ActionsWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
  },
});

export const FloatingMathEditor = () => {
  const { t } = useTranslation();
  const { popover, triggerEl, nodeEntry } = useFloatingMathPopover();
  const mathDialog = useMathDialog();
  const editor = useSlate();
  const contentRef = useRef<HTMLDivElement>(null);

  const handleRemove = useCallback(() => {
    if (!nodeEntry) return;
    Transforms.select(editor, editor.start(Path.next(nodeEntry[1])));
    Transforms.unwrapNodes(editor, { at: nodeEntry[1], match: isMathElement, voids: true });
    setTimeout(() => ReactEditor.focus(editor), 0);
  }, [editor, nodeEntry]);

  return (
    <PopoverRootProvider
      lazyMount
      unmountOnExit
      value={popover}
      onExitComplete={() => {
        const closestEditor = getClosestEditor(triggerEl);
        closestEditor?.focus();
        setTimeout(() => ReactEditor.focus(editor), 0);
      }}
    >
      <Portal>
        <StyledPopoverContent ref={contentRef} tabIndex={0}>
          <PopoverTitle srOnly>{t("richTextEditor.plugin.math.popoverTitle")}</PopoverTitle>
          <ActionsWrapper>
            <IconButton
              size="small"
              aria-label={t("form.edit")}
              title={t("form.edit")}
              onClick={() => {
                popover.setOpen(false);
                mathDialog.toggleDialog(true, nodeEntry?.[0]);
              }}
            >
              <PencilLine />
            </IconButton>
            <IconButton
              size="small"
              variant="danger"
              aria-label={t("form.remove")}
              title={t("form.remove")}
              onClick={handleRemove}
            >
              <DeleteBinLine />
            </IconButton>
          </ActionsWrapper>
        </StyledPopoverContent>
      </Portal>
    </PopoverRootProvider>
  );
};
