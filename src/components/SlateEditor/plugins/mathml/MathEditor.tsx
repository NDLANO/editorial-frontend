/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import he from "he";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Editor, Node, Path, Transforms } from "slate";
import { ReactEditor, RenderElementProps } from "slate-react";
import styled from "@emotion/styled";
import { Content, Root, Trigger } from "@radix-ui/react-popover";
import { colors, spacing, stackOrder } from "@ndla/core";
import { Modal, ModalContent, ModalTrigger } from "@ndla/modal";
import { Button } from "@ndla/primitives";
import { HStack } from "@ndla/styled-system/jsx";
import { MathmlElement } from ".";
import EditMath, { MathMLType, emptyMathTag } from "./EditMath";
import MathML from "./MathML";
import { AlertDialog } from "../../../AlertDialog/AlertDialog";
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
    isFirstEdit: data.innerHTML === undefined,
  };
};

const StyledContent = styled(Content)`
  padding: ${spacing.small};
  z-index: ${stackOrder.popover};
`;

const MathWrapper = styled.span`
  &[data-state="open"] {
    box-shadow: 0 0 0 1px ${colors.brand.tertiary};
  }
`;

const InlineDiv = styled.div`
  display: inline;
`;

interface Props {
  editor: Editor;
  element: MathmlElement;
}

const StyledMenu = styled.span`
  display: flex;
  gap: ${spacing.xsmall};
  padding: ${spacing.xsmall};
  background-color: white;
  border: 1px solid ${colors.brand.greyLight};
`;

const MathEditor = ({ element, children, attributes, editor }: Props & RenderElementProps) => {
  const { t } = useTranslation();
  const nodeInfo = useMemo(() => getInfoFromNode(element), [element]);
  const [isFirstEdit, setIsFirstEdit] = useState(nodeInfo.isFirstEdit);
  const [mathEditor, setMathEditor] = useState<MathMLType | undefined>(undefined);
  const [editMode, setEditMode] = useState(isFirstEdit);
  const [showMenu, setShowMenu] = useState(false);
  const [openDiscardModal, setOpenDiscardModal] = useState(false);

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
      };
      const path = ReactEditor.findPath(editor, element);

      const nextPath = Path.next(path);

      setIsFirstEdit(false);
      setEditMode(false);
      setShowMenu(false);

      setTimeout(() => {
        ReactEditor.focus(editor);
        if (isFirstEdit) {
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
    [editor, element, isFirstEdit],
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

    if (isFirstEdit) {
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
  }, [editor, element, handleRemove, isFirstEdit, mathEditor, nodeInfo.model.innerHTML, openDiscardModal]);

  return (
    <Modal open={editMode} onOpenChange={onOpenChange}>
      <InlineDiv {...attributes} contentEditable={false}>
        <Root open={showMenu} onOpenChange={setShowMenu}>
          <Trigger asChild>
            <MathWrapper role="button" tabIndex={0}>
              <MathML
                model={nodeInfo.model}
                onDoubleClick={() => setEditMode(true)}
                editor={editor}
                element={element}
              />
            </MathWrapper>
          </Trigger>
          <StyledContent>
            <StyledMenu>
              <ModalTrigger>
                <Button variant="link">{t("form.edit")}</Button>
              </ModalTrigger>
              <Button variant="link" onClick={handleRemove}>
                {t("form.remove")}
              </Button>
            </StyledMenu>
          </StyledContent>
        </Root>
        {children}
      </InlineDiv>
      <ModalContent size="large">
        <EditMath
          onExit={onExit}
          onSave={handleSave}
          onRemove={handleRemove}
          model={nodeInfo.model}
          mathEditor={mathEditor}
          setMathEditor={setMathEditor}
        />
        <AlertDialog
          title={t("unsavedChanges")}
          label={t("unsavedChanges")}
          show={openDiscardModal}
          text={t("mathEditor.continue")}
          onCancel={() => setOpenDiscardModal(false)}
        >
          <HStack justify="flex-end" gap="xsmall">
            <Button variant="secondary" onClick={() => setOpenDiscardModal(false)}>
              {t("form.abort")}
            </Button>
            <Button variant="danger" onClick={onExit}>
              {t("alertModal.continue")}
            </Button>
          </HStack>
        </AlertDialog>
      </ModalContent>
    </Modal>
  );
};

export default MathEditor;
