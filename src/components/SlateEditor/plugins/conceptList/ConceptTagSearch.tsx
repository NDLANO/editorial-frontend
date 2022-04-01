import Modal, { ModalBody, ModalCloseButton, ModalHeader } from '@ndla/modal';
import { DropdownInput, DropdownMenu } from '@ndla/forms';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Downshift, { StateChangeOptions } from 'downshift';
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

  const onSelectTag = (selectedItem: string) => {
    setSelectedTag(selectedItem);
    setDropdownOpen(false);
  };

  const onStateChange = (changes: StateChangeOptions<string>) => {
    const { isOpen, type } = changes;

    if (
      type === Downshift.stateChangeTypes.keyDownArrowUp ||
      type === Downshift.stateChangeTypes.keyDownArrowDown
    ) {
      setDropdownOpen(true);
    }
    if (type === Downshift.stateChangeTypes.mouseUp) {
      setDropdownOpen(!!isOpen);
      if (!isOpen) {
        setInput('');
      }
    }

    if (type === Downshift.stateChangeTypes.keyDownEnter) {
      setInput('');
    }
  };

  const onRemoveTag = () => {
    setSelectedTag(undefined);
  };

  console.log(selectedTag);

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

  console.log(selectedTag);

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
              <Downshift isOpen={dropdownOpen} onSelect={onSelectTag} onStateChange={onStateChange}>
                {({ getInputProps, getMenuProps, getItemProps }): JSX.Element => {
                  return (
                    <div>
                      <DropdownInput
                        multiSelect
                        {...getInputProps({
                          value: input,
                          onChange: onChangeInput,
                          onFocus: onFocus,
                          onClick: onFocus,
                        })}
                        values={selectedTag ? [selectedTag] : []}
                        removeItem={onRemoveTag}
                      />
                      <DropdownMenu
                        getMenuProps={getMenuProps}
                        getItemProps={getItemProps}
                        isOpen={dropdownOpen}
                        items={filteredTags}
                        maxRender={10}
                        hideTotalSearchCount
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
