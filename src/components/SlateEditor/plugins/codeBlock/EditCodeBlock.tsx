import React, { FC, useEffect, useState } from 'react';
import { injectT } from '@ndla/i18n';
import EditCodeBlockModal from './EditCodeBlockModal';

//     <script type="text/javascript" src="../dist/enlighterjs.min.js"></script>
//     <link rel="stylesheet" href="../dist/enlighterjs.min.css" />

const emptyTag = '<pre/>';
let codeBlockEditor;

interface CodeBlockType {
  programmingLanguage: string;
  code: string;
}

interface Props {
  locale: string;
  existingCodeBlock: CodeBlockType;
  model: { innerHTML: string };
  onExit: Function;
}

const EditCodeBlock: FC<Props> = ({ locale, model, onExit }) => {
  const innerHTML = model; // TODO skal denne være model.innerHTMl?

  const [initialCodeBlock, setInitialCodeBlock] = useState<any>(
    innerHTML ? innerHTML : emptyTag,
  );
  const [renderCodeBlock, setRenderCodeBlock] = useState<any>(
    innerHTML ? innerHTML : emptyTag,
  );
  const [openDiscartModal, setOpenDiscartModal] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '../../../../public/enlighterjs/enlighterjs.min.js'; // TODO rett path? hvor skal denne ligge
    document.head.appendChild(script);
  }, []);

  // TODO insert input field for codeBlock og get text from Modals' codeBlock input field.
  const handleSave = () => {
    const codeBlock = ''; // TODO bytt ut mathEditor.getMathML()
  };

  const handleExit = () => {
    // TODO!! Hent koden i kodeblokk fra inputfelt. const mathML = mathEditor.getMathML();
    // if (initialCodeBlock !== mathML) { // TODO se over ^^^^
    //   setOpenDiscartModal(true);
    // } else {
    //   onExit();  // Hva skal denne være, er det rett å få den fra nivået over, eller bare få en verdi og gjøre noe med den
    // }
  };

  const previewCodeBlock = () => {
    //    const (codeBlock: CodeBlockType) = {programmingLanguage= '', code= ''};
    //    setRenderCodeBlock(codeBlock);
    const hei = 'hei';
    console.log('yo');
  };

  const handleCancelDiscard = () => {
    setOpenDiscartModal(false);
  };

  const handleContinue = () => {
    onExit();
  };

  const handleRemove = () => {};

  return (
    <EditCodeBlockModal
      handleCancelDiscard={handleCancelDiscard}
      handleContinue={handleContinue}
      handleExit={handleExit}
      openDiscardModal={openDiscartModal}
      previewCodeBlock={previewCodeBlock}
      renderCodeBlock={renderCodeBlock}
    />
  );
};

export default EditCodeBlock;
