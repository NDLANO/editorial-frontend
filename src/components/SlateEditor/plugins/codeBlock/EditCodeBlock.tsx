import React, { FC, useState } from 'react';
import EditCodeBlockModal from './EditCodeBlockModal';
import { CodeBlockType } from '../../../../interfaces';

interface Props {
  handleSave: (code: CodeBlockType) => void;
  model: CodeBlockType;
  onExit: () => void;
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
