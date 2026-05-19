/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Portal } from "@ark-ui/react";
import { DeleteBinLine, PencilLine } from "@ndla/icons";
import {
  Button,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  IconButton,
  PopoverContent,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import he from "he";
import { useCallback, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Node, Transforms } from "slate";
import { ReactEditor, RenderElementProps, useSlateStatic } from "slate-react";
import { AlertDialog } from "../../../AlertDialog/AlertDialog";
import { DialogCloseButton } from "../../../DialogCloseButton";
import { FormActionsContainer } from "../../../FormikForm";
import { SelectableSlateElement } from "../../common/SelectableSlateEmbed";
import { useEditableElement } from "../../utils/useEditableElement";
import EditMath from "./EditMath";
import MathML, { type MathMLHandle } from "./MathML";
import { MathmlElement } from "./mathTypes";

const getInfoFromNode = (node: MathmlElement) => {
  const data = node.data ? node.data : {};
  const innerHTML = data.innerHTML || `<mn>${he.encode(Node.string(node))}</mn>`;
  return {
    model: {
      innerHTML: innerHTML.startsWith("<math")
        ? innerHTML
        : `<math xmlns="http://www.w3.org/1998/Math/MathML">${innerHTML}</math>`,
      xlmns: data.xlmns || 'xmlns="http://www.w3.org/1998/Math/MathML',
    },
  };
};

const StyledPopoverContent = styled(PopoverContent, {
  base: {
    gap: "xsmall",
    zIndex: "dropdown",
  },
});

const StyledFormActionsContainer = styled(FormActionsContainer, {
  base: {
    justifyContent: "flex-start",
  },
});

const StyledSelectableSlateElement = styled(SelectableSlateElement, {
  base: {
    display: "inline-block",
    outlineOffset: "4xsmall",
    "& mjx-container": {
      pointerEvents: "none",
    },
  },
});

interface Props extends RenderElementProps {
  element: MathmlElement;
}

const MathEditor = ({ element, children, attributes }: Props) => {
  const { t } = useTranslation();
  const editor = useSlateStatic();
  const nodeInfo = useMemo(() => getInfoFromNode(element), [element]);
  const [shouldShowWarning, setShouldShowWarning] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const previewMathRef = useRef<MathMLHandle>(null);
  const {
    handleEditingChange,
    handleSave,
    handleRemove,
    isBlocked,
    confirmClose,
    cancelClose,
    handleUnwrap,
    dialogProps,
  } = useEditableElement(element, editor, { unwrapOnAutoRemove: true });

  const onSave = useCallback(
    (mathML: string) => {
      const parsedMath = new DOMParser().parseFromString(mathML, "text/html").querySelector("math");
      if (!parsedMath) return;
      const path = ReactEditor.findPath(editor, element);
      editor.withoutNormalizing(() => {
        if (element.isFirstEdit) {
          Transforms.insertText(editor, parsedMath.textContent || "", { at: path, voids: true });
        }
        handleSave({ data: { xmlns: "http://www.w3.org/1998/Math/MathML", innerHTML: parsedMath.innerHTML } });
      });
    },
    [editor, element, handleSave],
  );

  return (
    <>
      <DialogRoot
        {...dialogProps}
        onOpenChange={(details) => {
          if (details.open) setPopoverOpen(false);
          handleEditingChange(details.open, !details.open && shouldShowWarning);
        }}
        onRequestDismiss={(e) => {
          if (previewMathRef.current?.isTypesetting) e.preventDefault();
        }}
        size="large"
      >
        <span {...attributes} contentEditable={false}>
          <PopoverRoot
            open={popoverOpen}
            onOpenChange={(details) => setPopoverOpen(details.open)}
            onExitComplete={dialogProps.onExitComplete}
          >
            <PopoverTrigger asChild ref={triggerRef} onMouseDown={(e) => e.preventDefault()} data-trigger="">
              <StyledSelectableSlateElement role="button" tabIndex={0} contentEditable={false} asChild consumeCss>
                <span>
                  <MathML
                    innerHTML={nodeInfo.model.innerHTML}
                    onDoubleClick={() => {
                      setPopoverOpen(false);
                      handleEditingChange(true);
                    }}
                  />
                </span>
              </StyledSelectableSlateElement>
            </PopoverTrigger>
            <Portal>
              <StyledPopoverContent>
                <PopoverTitle textStyle="label.medium" fontWeight="bold">
                  {t("math")}
                </PopoverTitle>
                <StyledFormActionsContainer>
                  <DialogTrigger asChild>
                    <IconButton size="small" aria-label={t("form.edit")} title={t("form.edit")}>
                      <PencilLine />
                    </IconButton>
                  </DialogTrigger>
                  <IconButton
                    size="small"
                    variant="danger"
                    aria-label={t("form.edit")}
                    title={t("form.edit")}
                    onClick={handleUnwrap}
                  >
                    <DeleteBinLine />
                  </IconButton>
                </StyledFormActionsContainer>
              </StyledPopoverContent>
            </Portal>
          </PopoverRoot>
          {children}
        </span>

        <Portal>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("mathEditor.editMath")}</DialogTitle>
              <DialogCloseButton />
            </DialogHeader>
            <DialogBody>
              <EditMath
                onSave={onSave}
                onRemove={handleRemove}
                model={nodeInfo.model}
                previewMathRef={previewMathRef}
                setShouldShowWarning={setShouldShowWarning}
              />
            </DialogBody>
          </DialogContent>
        </Portal>
      </DialogRoot>
      <AlertDialog
        title={t("unsavedChanges")}
        label={t("unsavedChanges")}
        show={isBlocked}
        text={t("mathEditor.continue")}
        onCancel={cancelClose}
      >
        <FormActionsContainer>
          <Button variant="secondary" onClick={cancelClose}>
            {t("form.abort")}
          </Button>
          <Button variant="danger" onClick={confirmClose}>
            {t("alertDialog.continue")}
          </Button>
        </FormActionsContainer>
      </AlertDialog>
    </>
  );
};

export default MathEditor;
