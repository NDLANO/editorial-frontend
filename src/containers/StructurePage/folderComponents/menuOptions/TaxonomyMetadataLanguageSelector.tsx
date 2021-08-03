/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { injectT, tType } from '@ndla/i18n';
import { DeleteForever } from '@ndla/icons/lib/editor';
import React from 'react';
import { spacing } from '@ndla/core';
import styled from '@emotion/styled';
import { LOCALE_VALUES, TAXONOMY_CUSTOM_FIELD_LANGUAGE } from '../../../../constants';
import { searchClasses } from '../../../SearchPage/SearchContainer';
import { StyledMenuItemEditField, StyledMenuItemInputField } from '../styles';
import RoundIcon from '../../../../components/RoundIcon';
import MenuItemSaveButton from './MenuItemSaveButton';

interface Props {
  customFields: Record<string, string>;
  updateCustomFields: (newFields: Record<string, string>) => void;
}

const StyledSelect = styled('select')`
  padding: 0 ${spacing.nsmall} 0 calc(${spacing.nsmall} / 2);
  width: calc(${spacing.large} * 2);
  margin-left: 0;
  margin-right: 35%;
`;

const TaxonomyMetadataLanguageSelector = ({
  customFields,
  updateCustomFields,
  t,
}: Props & tType) => {
  // eslint-disable-next-line react/prop-types
  const languageValue = customFields[TAXONOMY_CUSTOM_FIELD_LANGUAGE];
  return (
    <StyledMenuItemEditField>
      <RoundIcon open small />
      <StyledMenuItemInputField
        placeholder={t('taxonomy.metadata.customFields.languagePlaceholder')}
        disabled
      />
      <StyledSelect
        {...searchClasses('filters-select')}
        onChange={e => {
          e.persist();
          updateCustomFields({ ...customFields, [TAXONOMY_CUSTOM_FIELD_LANGUAGE]: e.target.value });
        }}
        value={customFields[TAXONOMY_CUSTOM_FIELD_LANGUAGE]}>
        {languageValue || (
          <option selected disabled hidden>
            {t('searchForm.types.language')}
          </option>
        )}
        {LOCALE_VALUES.map(option => (
          <option key={`sortoptions_${option}`} value={option}>
            {option}
          </option>
        ))}
      </StyledSelect>
      <MenuItemSaveButton
        onClick={() => {
          delete customFields[TAXONOMY_CUSTOM_FIELD_LANGUAGE];
          updateCustomFields({ ...customFields });
        }}
        css={{ marginLeft: `${spacing.xxsmall}` }}>
        <DeleteForever />
      </MenuItemSaveButton>
    </StyledMenuItemEditField>
  );
};

export default injectT(TaxonomyMetadataLanguageSelector);
