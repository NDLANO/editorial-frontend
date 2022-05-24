import Button from '@ndla/button';
import { Transforms } from 'slate';
import { spacing } from '@ndla/core';
import { ReactEditor, useSlateStatic } from 'slate-react';
import Modal, { ModalBody, ModalCloseButton, ModalHeader } from '@ndla/modal';
import { DropdownInput, DropdownMenu, Input } from '@ndla/forms';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Downshift, { StateChangeOptions } from 'downshift';
import styled from '@emotion/styled';
import { ConceptListElement } from '.';
import { fetchAllTags } from '../../../../modules/concept/conceptApi';
import { Portal } from '../../../Portal';
import ConceptSearchResult from './ConceptSearchResult';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 3fr 2fr;
  grid-row-gap: ${spacing.small};
`;

const StyledButton = styled(Button)`
  margin-left: auto;
`;

interface Props {
  element: ConceptListElement;
  onClose: () => void;
  language: string;
}

const ConceptTagPicker = ({ element, onClose, language }: Props) => {
  const { t } = useTranslation();
  const [selectedTag, setSelectedTag] = useState<string | undefined>(element.data.tag);
  const [searchInput, setSearchInput] = useState('');
  const [titleInput, setTitleInput] = useState(element.data.title || '');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  const editor = useSlateStatic();

  const filteredTags = tags
    .filter(tag => {
      return tag.toLowerCase().includes(searchInput.toLowerCase());
    })
    .sort();

  const onChangeTitleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setTitleInput(value);
  };

  const onChangeSearchInput = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setSearchInput(value);
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
        setSearchInput('');
      }
    }

    if (type === Downshift.stateChangeTypes.keyDownEnter) {
      setSearchInput('');
    }
  };

  const onRemoveTag = () => {
    setSelectedTag(undefined);
  };

  const onFocus = () => {
    setDropdownOpen(true);
  };

  const onSave = () => {
    ReactEditor.focus(editor);
    Transforms.setNodes<ConceptListElement>(
      editor,
      { data: { tag: selectedTag, title: titleInput }, isFirstEdit: false },
      {
        match: node => node === element,
        at: [],
      },
    );
    onClose();
  };

  useEffect(() => {
    const initialize = async () => {
      const data = await fetchAllTags(language);
      setTags(data);
    };

    initialize();
  }, [language, setTags]);

  return (
    <Portal isOpened>
      <Modal
        controllable
        isOpen
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
              <Grid>
                <Input
                  value={titleInput}
                  onChange={onChangeTitleInput}
                  placeholder={t('form.name.title')}
                />
                <StyledButton type="button" onClick={onSave} disabled={!selectedTag}>
                  {t('form.save')}
                </StyledButton>
                <Downshift
                  isOpen={dropdownOpen}
                  onSelect={onSelectTag}
                  onStateChange={onStateChange}>
                  {({ getInputProps, getMenuProps, getItemProps }): JSX.Element => {
                    return (
                      <div>
                        <DropdownInput
                          multiSelect
                          {...getInputProps({
                            value: searchInput,
                            onChange: onChangeSearchInput,
                            onFocus: onFocus,
                            onClick: onFocus,
                          })}
                          placeholder={t('form.name.tags')}
                          values={selectedTag ? [selectedTag] : []}
                          removeItem={onRemoveTag}
                        />
                        <DropdownMenu
                          getMenuProps={getMenuProps}
                          getItemProps={getItemProps}
                          isOpen={dropdownOpen}
                          items={filteredTags}
                          maxRender={1000}
                          hideTotalSearchCount
                        />
                        <ConceptSearchResult
                          tag={selectedTag}
                          language={language}
                          showResultCount
                        />
                      </div>
                    );
                  }}
                </Downshift>
              </Grid>
            </ModalBody>
          </div>
        )}
      </Modal>
    </Portal>
  );
};

export default ConceptTagPicker;
