import React, { FC, useState } from 'react';
import { Editor, Node } from 'slate';

import EditCodeBlockModal from './EditCodeBlockModal';
import { CodeBlockType } from '../../../../interfaces';

interface Props {
  blur: () => Editor;
  closeDialog: () => void;
  editor: Editor;
  handleSave: (code: CodeBlockType) => void;
  onExit: () => void;
  onChange: Editor['onChange'];
  node: Node;
  model: CodeBlockType;
}

const EditCodeBlock: FC<Props> = ({ handleSave, model, onExit }) => {
  const codeBlock = model;

  const [initialCodeBlock] = useState<any>(codeBlock);
  const [openDiscardModal, setOpenDiscardModal] = useState(false);

  const handleExit = () => {
    if (initialCodeBlock !== model) {
      setOpenDiscardModal(true);
    } else {
      onExit();
    }
  };

  const handleCancelDiscard = () => {
    setOpenDiscardModal(false);
  };

  const handleContinue = () => {
    onExit();
  };

  return (
    <EditCodeBlockModal
      handleCancelDiscard={handleCancelDiscard}
      handleContinue={handleContinue}
      handleExit={handleExit}
      handleSave={handleSave}
      model={model}
      openDiscardModal={openDiscardModal}
    />
  );
};

export default EditCodeBlock;
