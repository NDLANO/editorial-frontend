/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import he from "he";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Node, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps, useSelected, useSlate } from "slate-react";
import { Portal, DialogOpenChangeDetails } from "@ark-ui/react";
import { getClosestEditor, useEditorPopover } from "@ndla/editor-components";
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
  PopoverRootProvider,
  PopoverTitle,
  PopoverTrigger,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import EditMath, { emptyMathTag, MathMLType } from "./EditMath";
import MathML from "./MathML";
import { MathmlElement } from "./mathTypes";
import { isMathElement } from "./queries/mathQueries";
import { AlertDialog } from "../../../AlertDialog/AlertDialog";
import { DialogCloseButton } from "../../../DialogCloseButton";
import { FormActionsContainer } from "../../../FormikForm";
import mergeLastUndos from "../../utils/mergeLastUndos";

const ActionsWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
  },
});

const StyledPopoverContent = styled(PopoverContent, {
  base: {
    padding: "xsmall",
  },
});

const StyledSpan = styled("span", {
  base: {
    _selected: {
      outline: "1px solid",
      outlineColor: "stroke.default",
      outlineOffset: "4xsmall",
      borderRadius: "xsmall",
    },
  },
});

interface Props extends RenderElementProps {
  element: MathmlElement;
}

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

const upsertMath = (mathML: string, editor: Editor, element: MathmlElement) => {
  const properties = {
    data: { innerHTML: mathML },
    isFirstEdit: false,
  };

  const { selection } = editor;
  if (!selection) return;
  const [mathEntry] = editor.nodes({ match: isMathElement });
  if (!mathEntry) return;

  if (element.isFirstEdit) {
    const mathAsString = new DOMParser().parseFromString(mathML, "text/xml").firstChild?.textContent;

    Transforms.insertText(editor, mathAsString ?? "", { at: mathEntry[1], voids: true });
    Transforms.setNodes(editor, properties, { at: [...mathEntry[1], 0], voids: true, match: isMathElement });
    // Insertion of math consists of insert an empty mathml and then updating it with content. By merging the events we can consider them as one action and undo both with ctrl+z.
    mergeLastUndos(editor);
  } else {
    Transforms.setNodes(editor, properties, { at: mathEntry[1], voids: true, match: isMathElement });
  }

  const nextPath = Path.next(mathEntry[1]);
  if (editor.hasPath(nextPath)) {
    Transforms.select(editor, {
      anchor: { path: nextPath, offset: 0 },
      focus: { path: nextPath, offset: 0 },
    });
    ReactEditor.focus(editor);
  }
};

export const MathEditor = ({ element, children, attributes }: Props) => {
  const [mathEditor, setMathEditor] = useState<MathMLType | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { t } = useTranslation();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const editor = useSlate();
  const popover = useEditorPopover({ initialFocusEl: () => ref.current, triggerRef });

  useEffect(() => {
    setOpen(!!element.isFirstEdit);
  }, [element.isFirstEdit]);

  const isSelected = useSelected();

  const nodeInfo = useMemo(() => getInfoFromNode(element), [element]);

  const handleRemove = useCallback(() => {
    const path = ReactEditor.findPath(editor, element);
    setOpen(false);
    Transforms.select(editor, editor.start(Path.next(path)));
    Transforms.unwrapNodes(editor, { at: path, match: isMathElement, voids: true });
    setTimeout(() => ReactEditor.focus(editor), 0);
  }, [editor, element]);

  const onOpenChange = useCallback(
    (details: DialogOpenChangeDetails) => {
      if (details.open) {
        setOpen(details.open);
        popover.setOpen(false);
        return;
      }
      const editorContent = mathEditor?.getMathML();
      if (editorContent !== nodeInfo.model.innerHTML || element.isFirstEdit) {
        setShowAlert(true);
      } else {
        setOpen(details.open);
        Transforms.move(editor, { unit: "offset" });
        getClosestEditor(triggerRef.current)?.focus();
        setTimeout(() => ReactEditor.focus(editor), 0);
      }
    },
    [editor, element.isFirstEdit, mathEditor, nodeInfo.model.innerHTML, popover],
  );

  const handleSave = useCallback(
    (mathML: string) => {
      setOpen(false);
      setTimeout(() => upsertMath(mathML, editor, element), 0);
    },
    [editor, element],
  );

  const onExit = useCallback(() => {
    if ((nodeInfo.model.innerHTML ?? emptyMathTag !== mathEditor?.getMathML()) && !showAlert) {
      setShowAlert(true);
      return;
    }
    setShowAlert(false);
    const elementPath = ReactEditor.findPath(editor, element);

    if (element.isFirstEdit) {
      handleRemove();
    } else {
      const nextPath = Path.next(elementPath);
      setTimeout(() => {
        ReactEditor.focus(editor);
        Transforms.select(editor, {
          anchor: { path: nextPath, offset: 0 },
          focus: { path: nextPath, offset: 0 },
        });
      }, 0);
      setOpen(false);
    }
  }, [editor, element, handleRemove, mathEditor, nodeInfo.model.innerHTML, showAlert]);

  return (
    <>
      <DialogRoot
        open={open}
        onOpenChange={onOpenChange}
        onExitComplete={() => {
          getClosestEditor(triggerRef.current)?.focus();
          setTimeout(() => ReactEditor.focus(editor), 0);
        }}
      >
        <PopoverRootProvider
          value={popover}
          onExitComplete={() => {
            if (open) return;
            getClosestEditor(triggerRef.current)?.focus();
            setTimeout(() => ReactEditor.focus(editor), 0);
          }}
        >
          <PopoverTrigger asChild consumeCss ref={triggerRef}>
            <span {...attributes} contentEditable={false}>
              <StyledSpan role="button" tabIndex={0} data-selected={isSelected ? "" : undefined}>
                <MathML model={nodeInfo.model} editor={editor} element={element} />
              </StyledSpan>
              {children}
            </span>
          </PopoverTrigger>
          <Portal>
            <StyledPopoverContent ref={ref}>
              <PopoverTitle srOnly>{t("richTextEditor.plugin.math.popoverTitle")}</PopoverTitle>
              <ActionsWrapper>
                <DialogTrigger asChild>
                  <IconButton size="small" aria-label={t("form.edit")} title={t("form.edit")}>
                    <PencilLine />
                  </IconButton>
                </DialogTrigger>
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
        <Portal>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("richTextEditor.plugin.math.dialogTitle")}</DialogTitle>
              <DialogCloseButton />
            </DialogHeader>
            <DialogBody>
              <EditMath
                onSave={handleSave}
                onRemove={handleRemove}
                model={nodeInfo.model}
                mathEditor={mathEditor}
                setMathEditor={setMathEditor}
              />
            </DialogBody>
          </DialogContent>
        </Portal>
      </DialogRoot>
      <AlertDialog
        title={t("unsavedChanges")}
        label={t("unsavedChanges")}
        show={showAlert}
        text={t("mathEditor.continue")}
        onCancel={() => setShowAlert(false)}
      >
        <FormActionsContainer>
          <Button variant="secondary" onClick={() => setShowAlert(false)}>
            {t("form.abort")}
          </Button>
          <Button variant="danger" onClick={onExit}>
            {t("alertDialog.continue")}
          </Button>
        </FormActionsContainer>
      </AlertDialog>
    </>
  );
};
