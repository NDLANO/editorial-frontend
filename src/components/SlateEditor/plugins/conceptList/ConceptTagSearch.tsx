import Modal, { ModalCloseButton, ModalHeader } from '@ndla/modal';
import { useTranslation } from 'react-i18next';
import { ConceptListElement } from '.';
import { Portal } from '../../../Portal';

interface Props {
  isOpen: boolean;
  element: ConceptListElement;
  onClose: () => void;
}

const ConceptTagSearch = ({ isOpen, element, onClose }: Props) => {
  const { t } = useTranslation();

  return (
    <Portal isOpened>
      <Modal
        controllable
        isOpen={isOpen}
        onClose={onClose}
        size="large"
        backgroundColor="white"
        minHeight="90vh">
        {() => (
          <div>
            <ModalHeader>
              <ModalCloseButton title={t('dialog.close')} onClick={onClose} />
            </ModalHeader>
          </div>
        )}
      </Modal>
    </Portal>
  );
};

export default ConceptTagSearch;
