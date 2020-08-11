import React, { FC, useEffect, useState } from 'react';
import { injectT } from '@ndla/i18n';
import EditCodeBlockModal from './EditCodeBlockModal'

//     <script type="text/javascript" src="../dist/enlighterjs.min.js"></script>
//     <link rel="stylesheet" href="../dist/enlighterjs.min.css" />

const emptyTag = '<pre/>';
let codeBlockEditor;

interface Props {
  handleRemove: Function;
  handleSave: Function;
  isEditMode: boolean;
  locale: string;
  model: { innerHTML: string; };
  onExit: Function;
}

const EditCodeBlock: FC<Props> = ({handleRemove, handleSave, isEditMode, locale, model, onExit}) => {
  const innerHTML = model // TODO skal denne være model.innerHTMl?

  const [initialCodeBlock, setInitialCodeBlock] = useState<any>(innerHTML ? innerHTML : emptyTag);
  const [renderCodeBlock, setRenderCodeBlock] = useState<any>(innerHTML ? innerHTML : emptyTag);
  const [openDiscartModal, setOpenDiscartModal] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '../../../../public/enlighterjs/enlighterjs.min.js'; // TODO rett path? hvor skal denne ligge
    document.head.appendChild(script);
  }, []);

  // TODO insert input field for codeBlock og get text from Modals' codeBlock input field.
  handleSave = () => {
    handleSave(mathEditor.getMathML()); // TODO bytt ut mathEditor.getMathML()
  };

  const handleExit = () => {
    // TODO!! Hent koden i kodeblokk fra inputfelt. const mathML = mathEditor.getMathML();
    if (initialCodeBlock !== mathML) { // TODO se over ^^^^
      setOpenDiscartModal(true);
    } else {
      onExit();
    }
  }

  const previewCodeBlock = () => {
    const codeBlock = mathEditor.getMathML();  // TODO bytt ut mathEditor.getMathML()
    setRenderCodeBlock(codeBlock);
  }

  const handleCancelDiscard = () => {
    setOpenDiscartModal(false);
  }

  const handleContinue = () => {
    onExit();
  }

  return (
    <EditCodeBlockModal 
      handleCancelDiscard={handleCancelDiscard}
      handleContinue={handleContinue}
      handleExit={handleExit}
      handleRemove={handleRemove}
      handleSave={handleSave}
      openDiscardModal={openDiscartModal}
      previewCodeBlock={previewCodeBlock}
      renderCodeBlock={renderCodeBlock}
    />
  )
};

export default EditCodeBlock;