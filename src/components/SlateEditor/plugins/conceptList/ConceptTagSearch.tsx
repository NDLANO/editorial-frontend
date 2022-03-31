import Modal, { ModalBody, ModalCloseButton, ModalHeader } from '@ndla/modal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConceptListElement } from '.';
import { fetchAllTags } from '../../../../modules/concept/conceptApi';
import { Portal } from '../../../Portal';

interface Props {
  isOpen: boolean;
  element: ConceptListElement;
  onClose: () => void;
  language: string;
}

const ConceptTagSearch = ({ isOpen, element, onClose, language }: Props) => {
  const { t } = useTranslation();
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    const initialize = async () => {
      const data = await fetchAllTags(language);
      setTags(data);
    };
    initialize();
  }, [setTags, language]);

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
            <ModalBody></ModalBody>
          </div>
        )}
      </Modal>
    </Portal>
  );
};

export default ConceptTagSearch;
