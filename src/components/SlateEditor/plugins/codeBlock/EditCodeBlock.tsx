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

  const [initialCodeBlock, setInitialCodeBlock] = useState<any>(
    codeBlock ? codeBlock : emptyTag,
  );
  const [renderCodeBlock, setRenderCodeBlock] = useState<any>(
    codeBlock ? codeBlock : emptyTag,
  );
  const [openDiscartModal, setOpenDiscartModal] = useState(false);

  useEffect(() => {}, []);

  // TODO insert input field for codeBlock og get text from Modals' codeBlock input field.
  // const handleSave = (codeBlock: CodeBlockType) => {
  //   setRenderCodeBlock(codeBlock);
  //   console.log('handle save!!', codeBlock);
  // };

  const handleExit = () => {
    // TODO!! Hent koden i kodeblokk fra inputfelt. const mathML = mathEditor.getMathML();
    // if (initialCodeBlock !== mathML) { // TODO se over ^^^^
    //   setOpenDiscartModal(true);
    // } else {
    //   onExit();  // Hva skal denne være, er det rett å få den fra nivået over, eller bare få en verdi og gjøre noe med den
    // }
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
