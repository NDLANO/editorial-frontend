/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import he from "he";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Node, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
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
import { MathmlElement } from ".";
import EditMath, { MathMLType, emptyMathTag } from "./EditMath";
import MathML from "./MathML";
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
    zIndex: "dropdown",
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
    _open: {
      outline: "1px solid",
      outlineColor: "stroke.default",
      outlineOffset: "4xsmall",
      borderRadius: "xsmall",
    },
  },
});

interface Props {
  editor: Editor;
  element: MathmlElement;
}

const MathEditor = ({ element, children, attributes, editor }: Props & RenderElementProps) => {
  const { t } = useTranslation();
  const nodeInfo = useMemo(() => getInfoFromNode(element), [element]);
  const [mathEditor, setMathEditor] = useState<MathMLType | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [openDiscardModal, setOpenDiscardModal] = useState(false);

  useEffect(() => {
    setEditMode(!!element.isFirstEdit);
  }, [element.isFirstEdit]);

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        setEditMode(open);
      } else if ((nodeInfo.model.innerHTML ?? emptyMathTag) !== mathEditor?.getMathML()) {
        setOpenDiscardModal(true);
      } else {
        setEditMode(false);
      }
    },
    [mathEditor, nodeInfo.model.innerHTML],
  );

  const handleSave = useCallback(
    (mathML: string) => {
      const properties = {
        data: { innerHTML: mathML },
        isFirstEdit: false,
      };
      const path = ReactEditor.findPath(editor, element);

      const nextPath = Path.next(path);

      setEditMode(false);
      setShowMenu(false);

      setTimeout(() => {
        ReactEditor.focus(editor);
        if (element.isFirstEdit) {
          Transforms.setNodes(editor, properties, {
            at: path,
            voids: true,
            match: (node) => node === element,
          });

          const mathAsString = new DOMParser().parseFromString(mathML, "text/xml").firstChild?.textContent;

          Transforms.insertText(editor, mathAsString || "", {
            at: path,
            voids: true,
          });

          // Insertion of concept consists of insert an empty mathml and then updating it with content. By merging the events we can consider them as one action and undo both with ctrl+z.
          mergeLastUndos(editor);
        } else {
          Transforms.setNodes(editor, properties, {
            at: path,
            voids: true,
            match: (node) => node === element,
          });
        }
        Transforms.select(editor, {
          anchor: { path: nextPath, offset: 0 },
          focus: { path: nextPath, offset: 0 },
        });
      }, 0);
    },
    [editor, element],
  );

  const handleRemove = useCallback(() => {
    const path = ReactEditor.findPath(editor, element);
    ReactEditor.focus(editor);
    Transforms.select(editor, Editor.start(editor, Path.next(path)));

    Transforms.unwrapNodes(editor, {
      at: path,
      match: (node) => node === element,
      voids: true,
    });
  }, [editor, element]);

  const onExit = useCallback(() => {
    if ((nodeInfo.model.innerHTML ?? emptyMathTag !== mathEditor?.getMathML()) && !openDiscardModal) {
      setOpenDiscardModal(true);
      return;
    }
    setOpenDiscardModal(false);
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
      setEditMode(false);
      setShowMenu(false);
    }
  }, [editor, element, handleRemove, mathEditor, nodeInfo.model.innerHTML, openDiscardModal]);

  return (
    <>
      <DialogRoot open={editMode} onOpenChange={(details) => onOpenChange(details.open)} size="large">
        <span {...attributes} contentEditable={false}>
          <PopoverRoot
            open={showMenu}
            onOpenChange={(details) => setShowMenu(details.open)}
            modal={false}
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={false}
          >
            <PopoverTrigger asChild>
              <StyledSpan role="button" tabIndex={0}>
                <MathML
                  model={nodeInfo.model}
                  onDoubleClick={() => setEditMode(true)}
                  editor={editor}
                  element={element}
                />
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
        show={openDiscardModal}
        text={t("mathEditor.continue")}
        onCancel={() => setOpenDiscardModal(false)}
      >
        <FormActionsContainer>
          <Button variant="secondary" onClick={() => setOpenDiscardModal(false)}>
            {t("form.abort")}
          </Button>
          <Button variant="danger" onClick={onExit}>
            {t("alertModal.continue")}
          </Button>
        </FormActionsContainer>
      </AlertDialog>
    </>
  );
};

export default MathEditor;
