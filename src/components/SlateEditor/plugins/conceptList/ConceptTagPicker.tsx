/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import Button from '@ndla/button';
import { Transforms } from 'slate';
import { spacing } from '@ndla/core';
import { ReactEditor, useSlateStatic } from 'slate-react';
import Modal, { ModalBody, ModalCloseButton, ModalHeader } from '@ndla/modal';
import { Input } from '@ndla/forms';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { ConceptListElement } from '.';
import { fetchAllTags } from '../../../../modules/concept/conceptApi';
import { Portal } from '../../../Portal';
import ConceptSearchResult from './ConceptSearchResult';
import Dropdown, { DropdownItem } from '../../../Dropdown/Dropdown';
import { fetchSubject } from '../../../../modules/taxonomy';
import { resolveJsonOrRejectWithError } from '../../../../util/apiHelpers';
import { SubjectType } from '../../../../modules/taxonomy/taxonomyApiInterfaces';

const TwoColumn = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${spacing.small};
  align-items: flex-start;
`;

const FormInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  flex: 1;
`;

const StyledButton = styled(Button)`
  flex: 0;
`;

interface Props {
  element: ConceptListElement;
  onClose: () => void;
  language: string;
}

const ConceptTagPicker = ({ element, onClose, language }: Props) => {
  const { t } = useTranslation();
  const [selectedTag, setSelectedTag] = useState<string | undefined>(element.data.tag);
  const [titleInput, setTitleInput] = useState(element.data.title || '');
  const [tags, setTags] = useState<DropdownItem[]>([]);
  const [subjects, setSubjects] = useState<DropdownItem[]>([]);

  const editor = useSlateStatic();

  const onChangeTitleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setTitleInput(value);
  };

  const onSelectTag = (selectedItem: DropdownItem) => {
    setSelectedTag(selectedItem.id);
  };

  const onRemoveTag = () => {
    setSelectedTag(undefined);
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
      fetchAllTags(language).then(tags => {
        const items = tags.map(tag => ({ name: tag, id: tag }));
        setTags(items);
      });

      const subjectIds: string[] = await resolveJsonOrRejectWithError(
        await fetch(`/concept-api/v1/concepts/subjects/`),
      );
      const subjectResults = await Promise.allSettled(
        subjectIds.map(id => fetchSubject({ id, language, taxonomyVersion: 'default' })),
      );
      const subjects = (subjectResults.filter(result => result.status === 'fulfilled') as Array<
        PromiseFulfilledResult<SubjectType>
      >).map(res => {
        const subject = res.value;
        return { name: subject.name, id: subject.id };
      });
      setSubjects(subjects);
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
              <TwoColumn>
                <FormInput>
                  <Input
                    value={titleInput}
                    onChange={onChangeTitleInput}
                    placeholder={t('form.name.title')}
                  />
                  <Dropdown
                    items={tags}
                    onSelect={onSelectTag}
                    onReset={onRemoveTag}
                    selectedTag={selectedTag}
                  />
                  <ConceptSearchResult tag={selectedTag} language={language} showResultCount />
                </FormInput>
                <StyledButton type="button" onClick={onSave} disabled={!selectedTag}>
                  {t('form.save')}
                </StyledButton>
              </TwoColumn>
            </ModalBody>
          </div>
        )}
      </Modal>
    </Portal>
  );
};

export default ConceptTagPicker;
