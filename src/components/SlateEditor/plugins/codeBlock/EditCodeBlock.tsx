import { useState } from 'react';
import { Editor } from 'slate';
import { CodeEmbedData } from '@ndla/types-embed';
import EditCodeBlockModal from './EditCodeBlockModal';
import { CodeBlockType } from '../../../../interfaces';

interface Props {
  closeDialog: () => void;
  editor: Editor;
  handleSave: (code: CodeBlockType) => void;
  onExit: () => void;
  onChange: Editor['onChange'];
  embedData: CodeEmbedData;
}

const EditCodeBlock = ({ handleSave, embedData, onExit }: Props) => {
  const [initialCodeBlock] = useState<CodeEmbedData>(embedData);
  const [openDiscardModal, setOpenDiscardModal] = useState(false);

  const handleExit = () => {
    if (initialCodeBlock !== embedData) {
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
      embedData={embedData}
      openDiscardModal={openDiscardModal}
    />
  );
};

export default EditCodeBlock;
