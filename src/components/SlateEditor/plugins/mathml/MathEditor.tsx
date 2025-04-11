/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import he from "he";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Node, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps, useSelected, useSlateStatic } from "slate-react";
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
import EditMath, { MathMLType } from "./EditMath";
import MathML from "./MathML";
import { MathmlElement } from "./mathTypes";
import { isMathElement } from "./queries/mathQueries";
import { AlertDialog } from "../../../AlertDialog/AlertDialog";
import { DialogCloseButton } from "../../../DialogCloseButton";
import { FormActionsContainer } from "../../../FormikForm";
import mergeLastUndos from "../../utils/mergeLastUndos";

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
  },
});

const StyledFormActionsContainer = styled(FormActionsContainer, {
  base: {
    justifyContent: "flex-start",
  },
});

const StyledSpan = styled("span", {
  base: {
    display: "inline-block",
    _open: {
      outline: "1px solid",
      outlineColor: "stroke.default",
      outlineOffset: "4xsmall",
      borderRadius: "xsmall",
    },
  },
  variants: {
    selected: {
      true: {
        outline: "1px solid",
        outlineColor: "stroke.default",
        outlineOffset: "4xsmall",
        borderRadius: "xsmall",
      },
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
  const [mathEditor, setMathEditor] = useState<MathMLType | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [discardDialogOpen, setDiscardDialogOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selected = useSelected();

  useEffect(() => {
    setDialogOpen(!!element.isFirstEdit);
  }, [element.isFirstEdit]);

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        setDialogOpen(open);
        setPopoverOpen(false);
        return;
      }
      if (
        !element.data.innerHTML ||
        (mathEditor && he.decode(nodeInfo.model.innerHTML) !== he.decode(mathEditor.getMathML()))
      ) {
        setDiscardDialogOpen(true);
      } else {
        setDialogOpen(false);
      }
    },
    [element.data.innerHTML, mathEditor, nodeInfo.model.innerHTML],
  );

  const handleSave = useCallback(
    (mathML: string) => {
      const properties = {
        data: { innerHTML: mathML },
        isFirstEdit: false,
      };
      const path = ReactEditor.findPath(editor, element);
      const nextPath = Path.next(path);

      setDialogOpen(false);
      editor.withoutNormalizing(() => {
        Transforms.setNodes(editor, properties, { at: path, voids: true, match: isMathElement });
        if (element.isFirstEdit) {
          const mathAsString = new DOMParser().parseFromString(mathML, "text/xml").firstChild?.textContent;
          Transforms.insertText(editor, mathAsString || "", { at: path, voids: true });
          // Insertion consists of insert an empty mathml and then updating it with content. By merging the events we can consider them as one action and undo both with ctrl+z.
          mergeLastUndos(editor);
        }
        Transforms.select(editor, { anchor: { path: nextPath, offset: 0 }, focus: { path: nextPath, offset: 0 } });
      });

      setTimeout(() => ReactEditor.focus(editor), 0);
    },
    [editor, element],
  );

  const handleRemove = useCallback(() => {
    const path = ReactEditor.findPath(editor, element);
    setDialogOpen(false);
    Transforms.select(editor, editor.start(Path.next(path)));
    Transforms.unwrapNodes(editor, { at: path, match: isMathElement, voids: true });
    setTimeout(() => ReactEditor.focus(editor), 0);
  }, [editor, element]);

  const onExit = useCallback(() => {
    setDiscardDialogOpen(false);
    if (element.isFirstEdit) {
      handleRemove();
    } else {
      setDialogOpen(false);
      setPopoverOpen(false);
    }
  }, [element, handleRemove]);

  const onExitDialog = useCallback(() => {
    Transforms.select(editor, Path.next(ReactEditor.findPath(editor, element)));
    Transforms.collapse(editor, { edge: "start" });
    setTimeout(() => ReactEditor.focus(editor), 0);
  }, [editor, element]);

  const onExitPopover = useCallback(() => {
    if (dialogOpen) return;
    if (triggerRef.current === document.activeElement) {
      Transforms.select(editor, Path.next(ReactEditor.findPath(editor, element)));
      Transforms.collapse(editor, { edge: "start" });
      setTimeout(() => ReactEditor.focus(editor), 0);
    }
  }, [dialogOpen, editor, element]);

  return (
    <>
      <DialogRoot
        open={dialogOpen}
        onOpenChange={(details) => onOpenChange(details.open)}
        size="large"
        onExitComplete={onExitDialog}
      >
        <span {...attributes} contentEditable={false}>
          <PopoverRoot
            open={popoverOpen}
            onOpenChange={(details) => setPopoverOpen(details.open)}
            onExitComplete={onExitPopover}
          >
            <PopoverTrigger asChild ref={triggerRef} onMouseDown={(e) => e.preventDefault()} data-trigger="">
              <StyledSpan role="button" tabIndex={0} selected={selected}>
                <MathML innerHTML={nodeInfo.model.innerHTML} onDoubleClick={() => setDialogOpen(true)}></MathML>
              </StyledSpan>
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
                    onClick={handleRemove}
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
        show={discardDialogOpen}
        text={t("mathEditor.continue")}
        onCancel={() => setDiscardDialogOpen(false)}
      >
        <FormActionsContainer>
          <Button variant="secondary" onClick={() => setDiscardDialogOpen(false)}>
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

export default MathEditor;
