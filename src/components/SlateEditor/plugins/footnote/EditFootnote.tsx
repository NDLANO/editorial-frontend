/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Descendant, Editor, Transforms } from 'slate';
import { useTranslation } from 'react-i18next';
import { ReactEditor } from 'slate-react';
import styled from '@emotion/styled';
import { CloseButton } from '@ndla/button';
import { ModalBody, ModalHeader, ModalTitle } from '@ndla/modal';
import FootnoteForm from './FootnoteForm';
import { FootnoteElement } from '.';

interface Props {
  closeDialog: () => void;
  onChange: () => void;
  editor: Editor;
  existingFootnote: FootnoteElement['data'];
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
      Transforms.removeNodes(editor, { at: ReactEditor.findPath(editor, node) });
      ReactEditor.focus(editor);
      closeDialog();
    }
  };

  const handleSave = (data: FootnoteElement['data']) => {
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
        <ModalTitle>{t(`form.content.footnote.${isEdit ? 'editTitle' : 'addTitle'}`)}</ModalTitle>
        <CloseButton onClick={onClose} />
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
