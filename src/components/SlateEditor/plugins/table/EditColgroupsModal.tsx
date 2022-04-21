import Modal, { ModalBody, ModalCloseButton, ModalHeader } from '@ndla/modal';
import { useSlateStatic } from 'slate-react';
import { Transforms } from 'slate';
import { useTranslation } from 'react-i18next';
import { TableElement } from './interfaces';
import { Portal } from '../../../Portal';

interface Props {
  element: TableElement;
}

const EditColgroupsModal = ({ element }: Props) => {
  const editor = useSlateStatic();
  const { t } = useTranslation();
  const { showEditColgroups } = element;

  const onClose = () => {
    Transforms.setNodes(
      editor,
      { showEditColgroups: false },
      {
        match: node => node === element,
      },
    );
  };

  return (
    <Portal isOpened>
      <Modal
        controllable
        isOpen={showEditColgroups}
        onClose={onClose}
        backgroundColor="white"
        minHeight="90vh">
        {() => (
          <div>
            <ModalHeader>
              <ModalCloseButton title={t('dialog.close')} onClick={onClose} />
            </ModalHeader>
            <ModalBody>{element.colgroups}</ModalBody>
          </div>
        )}
      </Modal>
    </Portal>
  );
};

export default EditColgroupsModal;
