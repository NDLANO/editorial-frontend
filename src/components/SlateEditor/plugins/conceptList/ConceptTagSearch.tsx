import Modal, { ModalBody, ModalCloseButton, ModalHeader } from '@ndla/modal';
import { DropdownInput, DropdownMenu } from '@ndla/forms';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConceptListElement } from '.';
import { fetchAllTags, fetchSearchTags } from '../../../../modules/concept/conceptApi';
import AsyncSearchTags from '../../../Dropdown/asyncDropdown/AsyncSearchTags';
import { Portal } from '../../../Portal';
import Downshift from 'downshift';

interface Props {
  isOpen: boolean;
  element: ConceptListElement;
  onClose: () => void;
  language: string;
}

const ConceptTagSearch = ({ isOpen, element, onClose, language }: Props) => {
  const { t } = useTranslation();
  const [selectedTag, setSelectedTag] = useState<string>();
  const [input, setInput] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  const filteredTags = tags.filter(tag => {
    return tag.toLowerCase().includes(input.toLowerCase());
  });

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setInput(value);
  };

  const onFocus = () => {
    setDropdownOpen(true);
  };

  useEffect(() => {
    const initialize = async () => {
      const data = await fetchAllTags(language);
      setTags(data);
    };

    initialize();
  }, [language, setTags]);

  console.log(filteredTags.length);

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
              <Downshift isOpen={dropdownOpen}>
                {({ getInputProps, getMenuProps, getItemProps }): JSX.Element => {
                  return (
                    <div>
                      <DropdownInput
                        values={selectedTag ? [selectedTag] : []}
                        {...getInputProps({
                          onChange: onChangeInput,
                          value: input,
                          onFocus: onFocus,
                          onClick: onFocus,
                        })}
                      />
                      <DropdownMenu
                        getMenuProps={getMenuProps}
                        getItemProps={getItemProps}
                        isOpen={dropdownOpen}
                        items={filteredTags}
                        maxRender={10}
                        hideTotalSearchCount
                        positionAbsolute
                      />
                    </div>
                  );
                }}
              </Downshift>
            </ModalBody>
          </div>
        )}
      </Modal>
    </Portal>
  );
};

export default ConceptTagSearch;
