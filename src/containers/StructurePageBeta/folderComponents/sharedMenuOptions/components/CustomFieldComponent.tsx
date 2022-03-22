/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, KeyboardEvent } from 'react';
import { css } from '@emotion/core';
import { DeleteForever, Done } from '@ndla/icons/editor';
import { spacing } from '@ndla/core';
import RoundIcon from '../../../../../components/RoundIcon';
import CustomFieldButton from './CustomFieldButton';
import { StyledMenuItemEditField, StyledMenuItemInputField } from '../../styles';
import { TaxonomyMetadata } from '../../../../../modules/taxonomy/taxonomyApiInterfaces';

interface Props {
  onSubmit: (prevState: any) => void;
  onClose?: () => void;
  initialKey?: string;
  initialVal?: string;
  dataTestid?: string;
  placeholder?: string;
}

const CustomFieldComponent = ({
  onSubmit,
  onClose,
  initialKey = '',
  initialVal = '',
  dataTestid = 'customFieldComponent',
  placeholder,
}: Props) => {
  const [currentKey, setCurrentKey] = useState<string | undefined>(undefined);
  const [currentVal, setCurrentVal] = useState<string | undefined>(undefined);

  const handleSubmit = () => {
    const newPair: Record<string, string> = {};
    if (initialKey !== currentKey && currentKey != null) {
      newPair[currentKey] = currentVal ?? initialVal;
      onSubmit((prevState: TaxonomyMetadata['customFields']) => {
        delete prevState[initialKey];
        return { ...prevState, ...newPair };
      });
    } else if (initialVal !== currentVal && currentVal != null) {
      newPair[initialKey] = currentVal;
      onSubmit((prevState: TaxonomyMetadata['customFields']) => ({ ...prevState, ...newPair }));
    }
    onClose?.();
  };

  const handleDelete = () => {
    if (initialKey !== '') {
      onSubmit((prevState: TaxonomyMetadata['customFields']) => {
        delete prevState[initialKey];
        return { ...prevState };
      });
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose?.();
    }
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <>
      <StyledMenuItemEditField>
        <RoundIcon open small />
        <StyledMenuItemInputField
          type="text"
          placeholder={placeholder}
          value={currentKey ?? initialKey}
          data-testid={dataTestid}
          onChange={e => setCurrentKey(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <StyledMenuItemInputField
          type="text"
          placeholder={placeholder}
          value={currentVal ?? initialVal}
          data-testid={dataTestid}
          onChange={e => setCurrentVal(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <CustomFieldButton onClick={handleSubmit} data-testid={'CustomFieldSaveButton'}>
          <Done className="c-icon--small" />
        </CustomFieldButton>
        <CustomFieldButton
          onClick={handleDelete}
          css={css`
            margin-left: ${spacing.xxsmall};
          `}>
          <DeleteForever />
        </CustomFieldButton>
      </StyledMenuItemEditField>
    </>
  );
};

export default CustomFieldComponent;
