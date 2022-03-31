import Modal, { ModalBody, ModalCloseButton, ModalHeader } from '@ndla/modal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConceptListElement } from '.';
import { fetchAllTags, fetchSearchTags } from '../../../../modules/concept/conceptApi';
import AsyncSearchTags from '../../../Dropdown/asyncDropdown/AsyncSearchTags';
import { Portal } from '../../../Portal';

interface Props {
  isOpen: boolean;
  element: ConceptListElement;
  onClose: () => void;
  language: string;
}

const ConceptTagSearch = ({ isOpen, element, onClose, language }: Props) => {
  const { t } = useTranslation();
  const [selectedTag, setSelectedTag] = useState<string>();

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
            <ModalBody>
              <AsyncSearchTags
                updateValue={value => {
                  setSelectedTag(value[1]);
                }}
                disableCreate
                fetchTags={fetchSearchTags}
                language={language}
                initialTags={selectedTag ? [selectedTag] : []}
              />
            </ModalBody>
          </div>
        )}
      </Modal>
    </Portal>
  );
};

export default ConceptTagSearch;
