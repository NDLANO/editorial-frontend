/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { Descendant, Editor, Transforms } from 'slate';
import { useTranslation } from 'react-i18next';
import { ReactEditor } from 'slate-react';
import FootnoteForm from './FootnoteForm';
import { Portal } from '../../../Portal';
import Lightbox from '../../../Lightbox';
import { FootnoteElement } from '.';

interface Props {
  closeDialog: () => void;
  onChange: () => void;
  editor: Editor;
  existingFootnote: FootnoteElement['data'];
  node: Descendant;
}

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
    <Portal isOpened>
      <Lightbox display appearance="big" onClose={onClose}>
        <div>
          <h2>{t(`form.content.footnote.${isEdit ? 'editTitle' : 'addTitle'}`)}</h2>
          <FootnoteForm
            footnote={existingFootnote}
            onClose={onClose}
            isEdit={isEdit}
            onRemove={handleRemove}
            onSave={handleSave}
          />
        </div>
      </Lightbox>
    </Portal>
  );
};

export default EditFootnote;
