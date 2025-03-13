/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Path, Transforms } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { DialogOpenChangeDetails, Portal } from "@ark-ui/react";
import { getClosestEditor } from "@ndla/editor-components";
import { Button, DialogBody, DialogContent, DialogHeader, DialogRoot, DialogTitle } from "@ndla/primitives";
import EditMath, { emptyMathTag, MathMLType } from "./EditMath";
import { MathmlElement } from "./mathTypes";
import { isMathElement } from "./queries/mathQueries";
import { getInfoFromNode } from "./utils";
import { AlertDialog } from "../../../AlertDialog/AlertDialog";
import { DialogCloseButton } from "../../../DialogCloseButton";
import { FormActionsContainer } from "../../../FormikForm";
import mergeLastUndos from "../../utils/mergeLastUndos";

interface UseMathDialog {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  element: MathmlElement | undefined;
  toggleDialog: (open: boolean, element?: MathmlElement) => void;
}

const MathEditorDialogContext = createContext<UseMathDialog | null>(null);

const useInternalMathDialog = (): UseMathDialog => {
  const [open, setOpen] = useState(false);
  const [element, setElement] = useState<MathmlElement | undefined>(undefined);

  const toggleDialog = useCallback((open: boolean, element?: MathmlElement) => {
    setOpen(open);
    setElement(open ? element : undefined);
  }, []);

  return {
    open,
    setOpen,
    element,
    toggleDialog,
  };
};

export const MathDialogProvider = ({ children }: { children: ReactNode }) => {
  const value = useInternalMathDialog();
  return <MathEditorDialogContext.Provider value={value}>{children}</MathEditorDialogContext.Provider>;
};

export const useMathDialog = () => {
  const context = useContext(MathEditorDialogContext);
  if (!context) {
    throw new Error("useMathDialog must be used within a MathDialogProvider");
  }
  return context;
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
    // Insertion of math consists of inserting an empty mathml tag and then updating it with content. By merging the events we can consider them as one action and undo both with ctrl+z.
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

export const MathDialog = () => {
  const { t } = useTranslation();
  const [mathEditor, setMathEditor] = useState<MathMLType | undefined>(undefined);
  const [showAlert, setShowAlert] = useState(false);
  const editor = useSlate();
  const { open, setOpen, element, toggleDialog } = useMathDialog();
  const nodeInfo = useMemo(() => (element ? getInfoFromNode(element) : undefined), [element]);

  const handleSave = useCallback(
    (mathML: string) => {
      if (element) {
        setTimeout(() => {
          upsertMath(mathML, editor, element);
          toggleDialog(false);
        }, 0);
      }
    },
    [editor, element, toggleDialog],
  );

  const onOpenChange = useCallback(
    (details: DialogOpenChangeDetails) => {
      if (!element) return;
      if (details.open) {
        setOpen(details.open);
        return;
      }
      const editorContent = mathEditor?.getMathML();
      if (editorContent !== nodeInfo?.model.innerHTML || element.isFirstEdit) {
        setShowAlert(true);
      } else {
        setOpen(details.open);
        Transforms.move(editor, { unit: "offset" });
        const triggerEl = ReactEditor.toDOMNode(editor, element);
        getClosestEditor(triggerEl)?.focus();
        setTimeout(() => {
          ReactEditor.focus(editor);
          toggleDialog(false);
        }, 0);
      }
    },
    [editor, element, mathEditor, nodeInfo?.model.innerHTML, setOpen, toggleDialog],
  );

  const handleRemove = useCallback(() => {
    if (!element) return;
    const path = ReactEditor.findPath(editor, element);
    toggleDialog(false);
    Transforms.select(editor, editor.start(Path.next(path)));
    Transforms.unwrapNodes(editor, { at: path, match: isMathElement, voids: true });
    setTimeout(() => ReactEditor.focus(editor), 0);
  }, [editor, element, toggleDialog]);

  const onExit = useCallback(() => {
    if (!nodeInfo || !element) return;
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
      toggleDialog(false);
    }
  }, [editor, element, handleRemove, mathEditor, nodeInfo, setOpen, showAlert, toggleDialog]);

  return (
    <>
      <DialogRoot
        open={open}
        onOpenChange={onOpenChange}
        onExitComplete={() => {
          if (!element) return;
          const closestEditor = ReactEditor.toDOMNode(editor, element);
          closestEditor?.focus();
          setTimeout(() => {
            ReactEditor.focus(editor);
            toggleDialog(false);
          }, 0);
        }}
      >
        <Portal>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("richTextEditor.plugin.math.dialogTitle")}</DialogTitle>
              <DialogCloseButton />
            </DialogHeader>
            <DialogBody>
              {!!nodeInfo && (
                <EditMath
                  onSave={handleSave}
                  onRemove={handleRemove}
                  model={nodeInfo.model}
                  mathEditor={mathEditor}
                  setMathEditor={setMathEditor}
                />
              )}
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
            {t("alertModal.continue")}
          </Button>
        </FormActionsContainer>
      </AlertDialog>
    </>
  );
};
