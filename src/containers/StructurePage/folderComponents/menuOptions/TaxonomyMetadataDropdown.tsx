/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { DeleteForever } from '@ndla/icons/lib/editor';
import { searchClasses } from '../../../SearchPage/SearchContainer';
import { StyledMenuItemEditField, StyledMenuItemInputField } from '../styles';
import RoundIcon from '../../../../components/RoundIcon';
import MenuItemSaveButton from './MenuItemSaveButton';

interface Option {
  key: string;
  value: string;
}
interface Props {
  field: string;
  options: Option[];
  customFields: Record<string, string>;
  updateCustomFields: (newFields: Record<string, string>) => void;
  messages: Record<string, string>;
}

const StyledSelect = styled('select')`
  padding: 0 ${spacing.nsmall} 0 calc(${spacing.nsmall} / 2);
  margin-left: 0;
`;

const TaxonomyMetadataDropdown = ({
  options,
  field,
  customFields,
  updateCustomFields,
  messages,
}: Props) => {
  const selectedValue = customFields[field];
  return (
    <StyledMenuItemEditField>
      <RoundIcon open small />
      <StyledMenuItemInputField placeholder={messages['title']} disabled />
      <StyledSelect
        {...searchClasses('filters-select')}
        onChange={e => {
          e.persist();
          updateCustomFields({
            ...customFields,
            [field]: e.target.value,
          });
        }}
        value={customFields[field]}>
        {selectedValue || (
          <option selected disabled hidden>
            {messages['selected']}
          </option>
        )}
        {options.map((option: Option) => (
          <option key={`sortoptions_${option.key}`} value={option.key}>
            {option.value}
          </option>
        ))}
      </StyledSelect>
      <MenuItemSaveButton
        onClick={() => {
          delete customFields[field];
          updateCustomFields({ ...customFields });
        }}
        css={{ marginLeft: `${spacing.xxsmall}` }}>
        <DeleteForever />
      </MenuItemSaveButton>
    </StyledMenuItemEditField>
  );
};

export default TaxonomyMetadataDropdown;
