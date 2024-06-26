/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Descendant, Editor, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import styled from "@emotion/styled";
import { ModalBody, ModalCloseButton, ModalHeader, ModalTitle } from "@ndla/modal";
import { FootnoteElement } from ".";
import FootnoteForm from "./FootnoteForm";

interface Props {
  closeDialog: () => void;
  onChange: () => void;
  editor: Editor;
  existingFootnote: FootnoteElement["data"];
  node: Descendant;
}

const StyledModalBody = styled(ModalBody)`
  padding-top: 0;
`;

const StyledModalHeading = styled(ModalHeader)`
  padding-bottom: 0;
`;

const EditFootnote = (props: Props) => {
  const { t } = useTranslation();

  const onClose = () => {
    const { existingFootnote, closeDialog } = props;
    if (!existingFootnote.title) {
      handleRemove();
    } else {
      closeDialog();
    }
  };

  const handleRemove = () => {
    const { editor, node, closeDialog } = props;
    if (node) {
      Transforms.removeNodes(editor, {
        at: ReactEditor.findPath(editor, node),
      });
      ReactEditor.focus(editor);
      closeDialog();
    }
  };

  const handleSave = (data: FootnoteElement["data"]) => {
    const { editor, node, closeDialog } = props;
    Transforms.setNodes(
      editor,
      { data },
      {
        at: ReactEditor.findPath(editor, node),
      },
    );

    closeDialog();
  };

  const { existingFootnote } = props;
  const isEdit = existingFootnote.title !== undefined;

  return (
    <>
      <StyledModalHeading>
        <ModalTitle>{t(`form.content.footnote.${isEdit ? "editTitle" : "addTitle"}`)}</ModalTitle>
        <ModalCloseButton />
      </StyledModalHeading>
      <StyledModalBody>
        <FootnoteForm
          footnote={existingFootnote}
          onClose={onClose}
          isEdit={isEdit}
          onRemove={handleRemove}
          onSave={handleSave}
        />
      </StyledModalBody>
    </>
  );
};

export default EditFootnote;
