import React, { FC, useEffect, useState } from 'react';
import { injectT } from '@ndla/i18n';
import EditCodeBlockModal from './EditCodeBlockModal';
import { CodeBlockType } from '../../../../interfaces';

interface Props {
  locale: string;
  handleSave: Function;
  handleRemove: Function;
  model: CodeBlockType;
  onExit: Function;
}

const EditCodeBlock: FC<Props> = ({ locale, handleSave, model, onExit }) => {
  const codeBlock = model;

  const [initialCodeBlock] = useState<any>(codeBlock);
  const [renderCodeBlock, setRenderCodeBlock] = useState<any>(codeBlock);
  const [openDiscartModal, setOpenDiscartModal] = useState(false);

  const handleExit = () => {
    if (initialCodeBlock !== model) {
      setOpenDiscartModal(true);
    } else {
      onExit();
    }
  };

  const handleCancelDiscard = () => {
    setOpenDiscartModal(false);
  };

  const handleContinue = () => {
    onExit();
  };

  return (
    <EditCodeBlockModal
      handleCancelDiscard={handleCancelDiscard}
      handleContinue={handleContinue}
      handleExit={handleExit}
      openDiscardModal={openDiscartModal}
      renderCodeBlock={renderCodeBlock}
      model={model}
      handleSave={handleSave}
    />
  );
};

export default EditCodeBlock;
