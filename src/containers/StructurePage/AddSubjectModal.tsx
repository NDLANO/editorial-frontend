/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { ChangeEvent, useState, SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { spacing, colors } from '@ndla/core';
import { InputV2 } from '@ndla/forms';
import TaxonomyLightbox from '../../components/Taxonomy/TaxonomyLightbox';
import { useAddNodeMutation } from '../../modules/nodes/nodeMutations';
import handleError from '../../util/handleError';
import { useTaxonomyVersion } from '../StructureVersion/TaxonomyVersionProvider';

const StyledInputField = styled(InputV2)`
  border-radius: 4px;
  ::placeholder {
    color: ${colors.brand.neutral7};
  }
`;

const FormWrapper = styled.form`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: ${spacing.medium};
`;

interface Props {
  onClose: () => void;
}

const AddSubjectModal = ({ onClose }: Props) => {
  const { t } = useTranslation();
  const addNodeMutation = useAddNodeMutation();
  const { taxonomyVersion } = useTaxonomyVersion();

  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(false);

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
    e.preventDefault();

    try {
      await addNode(inputValue);
      setInputValue('');
      onClose();
    } catch (error) {
      handleError(error);
      setError(true);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (error) setError(false);
    setInputValue(e.target.value);
  };

  return (
    <TaxonomyLightbox title={t('taxonomy.addSubject')} onClose={onClose}>
      <>
        <FormWrapper>
          <StyledInputField
            label={t('taxonomy.newSubject')}
            name={t('taxonomy.newSubject')}
            labelHidden
            type="text"
            data-testid="addSubjectInputField"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={t('taxonomy.subjectName')}
            error={error ? t('taxonomy.errorMessage') : undefined}
          />
          <ButtonV2 type="submit" onClick={handleClick} disabled={!inputValue}>
            {t('form.save')}
          </ButtonV2>
        </FormWrapper>
      </>
    </TaxonomyLightbox>
  );
};

export default AddSubjectModal;
