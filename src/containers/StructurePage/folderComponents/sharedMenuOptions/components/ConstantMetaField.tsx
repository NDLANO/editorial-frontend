/*
 * Copyright (c) 2021-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, KeyboardEvent } from 'react';
import { spacing } from '@ndla/core';
import { DeleteForever, Done } from '@ndla/icons/editor';
import styled from '@emotion/styled';
import { Metadata } from '@ndla/types-taxonomy';
import { StyledMenuItemEditField, StyledMenuItemInputField } from '../../styles';
import RoundIcon from '../../../../../components/RoundIcon';
import CustomFieldButton from './CustomFieldButton';

interface Props {
  fieldKey: string;
  onSubmit: Function;
  initialVal?: string;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  dataTestid?: string;
}

const StyledCustomFieldButton = styled(CustomFieldButton)`
  margin-left: ${spacing.xxsmall};
`;

const ConstantMetaField = ({
  onSubmit,
  keyPlaceholder,
  valuePlaceholder,
  initialVal = '',
  dataTestid,
  fieldKey,
}: Props) => {
  const [currentVal, setCurrentVal] = useState<string | undefined>();

  const handleSubmit = () => {
    const newPair: Record<string, string> = {};
    if (initialVal !== currentVal && !!currentVal) {
      newPair[fieldKey] = currentVal;
      onSubmit((prevState: Metadata['customFields']) => ({ ...prevState, ...newPair }));
    }
  };

  const handleDelete = () => {
    onSubmit((prevState: Metadata['customFields']) => {
      delete prevState[fieldKey];
      return { ...prevState };
    });
    setCurrentVal('');
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <StyledMenuItemEditField>
      <RoundIcon open small />
      <StyledMenuItemInputField placeholder={keyPlaceholder ?? fieldKey} disabled />
      <StyledMenuItemInputField
        type="text"
        placeholder={valuePlaceholder}
        value={currentVal ?? initialVal}
        data-testid={dataTestid}
        onChange={(e) => setCurrentVal(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <CustomFieldButton onClick={handleSubmit} data-testid={'CustomFieldSaveButton'}>
        <Done className="c-icon--small" />
      </CustomFieldButton>
      <StyledCustomFieldButton onClick={handleDelete}>
        <DeleteForever />
      </StyledCustomFieldButton>
    </StyledMenuItemEditField>
  );
};

export default ConstantMetaField;
