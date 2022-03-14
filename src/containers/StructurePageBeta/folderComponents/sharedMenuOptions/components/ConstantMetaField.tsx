/*
 * Copyright (c) 2021-present, NDLA.
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useState, KeyboardEvent } from 'react';
import { spacing } from '@ndla/core';
import { css } from '@emotion/core';
import { DeleteForever, Done } from '@ndla/icons/editor';
import { StyledMenuItemEditField, StyledMenuItemInputField } from '../../styles';
import RoundIcon from '../../../../../components/RoundIcon';
import { TaxonomyMetadata } from '../../../../../modules/taxonomy/taxonomyApiInterfaces';
import CustomFieldButton from './CustomFieldButton';

interface Props {
  fieldKey: string;
  onSubmit: Function;
  initialVal?: string;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
  dataTestid?: string;
}

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
      onSubmit((prevState: TaxonomyMetadata['customFields']) => ({ ...prevState, ...newPair }));
    }
  };

  const handleDelete = () => {
    onSubmit((prevState: TaxonomyMetadata['customFields']) => {
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
  );
};

export default ConstantMetaField;
