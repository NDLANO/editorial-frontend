import React, { FC, useEffect, useState } from 'react';
import { injectT } from '@ndla/i18n';
import EditCodeBlockModal from './EditCodeBlockModal';

const emptyTag = '<pre/>';
let codeBlockEditor;

interface CodeBlockType {
  code: string;
  title: string;
  format: string;
}

interface Props {
  locale: string;
  handleSave: Function;
  handleRemove: Function;
  model: CodeBlockType;
  onExit: Function;
}

const EditCodeBlock: FC<Props> = ({ locale, handleSave, model, onExit }) => {
  const codeBlock = model; // TODO skal denne være model.innerHTMl?

  const [initialCodeBlock] = useState<any>(codeBlock ? codeBlock : emptyTag);
  const [renderCodeBlock, setRenderCodeBlock] = useState<any>(
    codeBlock ? codeBlock : emptyTag,
  );
  const [openDiscartModal, setOpenDiscartModal] = useState(false);

  const handleExit = () => {
    if (initialCodeBlock !== model) {
      // TODO få tak i dataen som endrer seg
      setOpenDiscartModal(true);
    } else {
      onExit();
    }
  };

  const handleCancelDiscard = () => {
    setOpenDiscartModal(false);
    console.log(openDiscartModal);
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
