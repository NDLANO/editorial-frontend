/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ChangeEvent, SyntheticEvent, useEffect, useRef, useState, KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { colors, spacing } from '@ndla/core';
import TaxonomyLightbox from '../../components/Taxonomy/TaxonomyLightbox';
import handleError from '../../util/handleError';
import { useAddNodeMutation } from '../../modules/nodes/nodeMutations';
import { useTaxonomyVersion } from '../StructureVersion/TaxonomyVersionProvider';
import SaveButton from '../../components/Taxonomy/SaveButton';

const StyledContent = styled.div`
  width: 100%;
  > * {
    width: 100%;
  }
  & form {
    background-color: white;
  }
`;

const StyledErrorMessage = styled('span')`
  color: ${colors.support.red};
  position: absolute;
  right: 55px;
  top: 50px;
`;

const StyledInputField = styled('input')`
  margin: calc(${spacing.small} / 2);
  width: 200px;
  flex: 1;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: ${spacing.nsmall};
`;

interface Props {
  onClose: () => void;
}

const AddSubjectModal = ({ onClose }: Props) => {
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState('initial');
  const prevInput = useRef('');
  const { t } = useTranslation();
  const addNodeMutation = useAddNodeMutation();
  const { taxonomyVersion } = useTaxonomyVersion();

  useEffect(() => {
    prevInput.current = inputValue;
  }, [inputValue]);

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

  const handleClick = async () => {
    if (prevInput.current.trim() === '') {
      setInputValue('');
      setStatus('initial');
    } else {
      setInputValue(prevInput.current);
      setStatus('loading');
    }
    if (status !== 'initial') {
      try {
        await addNode(inputValue);
        setInputValue('');
        setStatus('success');
      } catch (error) {
        handleError(error);
        setInputValue('');
        setStatus('error');
      }
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setInputValue(e.target.value);
  };
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setStatus('initial');
    }
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  return (
    <TaxonomyLightbox title="Legg til nytt fag" onClose={onClose}>
      <StyledContent>
        <InputWrapper>
          <StyledInputField
            type="text"
            autoFocus //  eslint-disable-line
            /* allow autofocus when it happens when clicking a dialog and not at page load
         ref: https://w3c.github.io/html/sec-forms.html#autofocusing-a-form-control-the-autofocus-attribute */
            data-testid="addSubjectInputField"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
          />
          <SaveButton
            handleClick={handleClick}
            disabled={!inputValue}
            loading={status === 'loading'}
          />

          {status === 'error' && (
            <StyledErrorMessage>{t('taxonomy.errorMessage')}</StyledErrorMessage>
          )}
        </InputWrapper>
      </StyledContent>
    </TaxonomyLightbox>
  );
};

export default AddSubjectModal;
