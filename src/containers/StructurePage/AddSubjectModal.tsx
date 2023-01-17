/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import Button from '@ndla/button';
import { ChangeEvent, useState, SyntheticEvent, KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { spacing, colors } from '@ndla/core';
import TaxonomyLightbox from '../../components/Taxonomy/TaxonomyLightbox';
import { useAddNodeMutation } from '../../modules/nodes/nodeMutations';
import handleError from '../../util/handleError';
import { useTaxonomyVersion } from '../StructureVersion/TaxonomyVersionProvider';

const StyledInputField = styled('input')`
  width: 100%;
  border-radius: 4px;
`;
const StyledErrorMessage = styled('span')`
  color: ${colors.support.red};
  margin-right: auto;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: ${spacing.medium};
`;

interface Props {
  onClose: () => void;
}

interface ValueType {
  status: 'initial' | 'success' | 'error';
  inputValue: string;
}

const AddSubjectModal = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const addNodeMutation = useAddNodeMutation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const [value, setValue] = useState<ValueType>({ status: 'initial', inputValue: '' });

  const addNode = async (name: string) => {
    await addNodeMutation.mutateAsync({
      body: {
        name,
        nodeType: 'SUBJECT',
        root: true,
      },
      taxonomyVersion,
    });
  };

  const handleClick = async (e: SyntheticEvent) => {
    e.stopPropagation();

    setValue({ status: 'initial', inputValue: '' });

    try {
      addNode(value.inputValue);
      setValue({ status: 'success', inputValue: '' });
      onClose();
    } catch (error) {
      handleError(error);
      setValue({ status: 'error', inputValue: '' });
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setValue({ ...value, inputValue: e.target.value });
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setValue({ ...value, status: 'initial' });
    }
    if (e.key === 'Enter') {
      handleClick(e);
    }
  };

  return (
    <TaxonomyLightbox title={t('taxonomy.addSubject')} onClose={onClose}>
      <>
        <Wrapper>
          <StyledInputField
            type="text"
            autoFocus //  eslint-disable-line
            /* allow autofocus when it happens when clicking a dialog and not at page load
         ref: https://w3c.github.io/html/sec-forms.html#autofocusing-a-form-control-the-autofocus-attribute */
            data-testid="addSubjectInputField"
            value={value.inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder={t('taxonomy.subjectName')}
          />
          <Button onClick={handleClick} disabled={!value.inputValue}>
            {t('form.save')}
          </Button>
        </Wrapper>
        {value.status === 'error' && (
          <StyledErrorMessage>{t('taxonomy.errorMessage')}</StyledErrorMessage>
        )}
      </>
    </TaxonomyLightbox>
  );
};

export default AddSubjectModal;
