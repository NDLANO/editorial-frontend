/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import Button from '@ndla/button';
import { SearchParams } from './SearchForm';
import SearchTagGroup, { TagType } from './SearchTagGroup';
import Selector, { SearchFormSelector } from './Selector';

export type OnFieldChangeFunction = <T extends keyof SearchParams>(
  name: T,
  value: SearchParams[T],
) => void;

interface Props {
  type: string;
  selectors: SearchFormSelector[];
  query: string;
  searchObject: SearchParams;
  onQueryChange: (event: FormEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onFieldChange: OnFieldChangeFunction;
  emptySearch: (evt: MouseEvent<HTMLButtonElement>) => void;
  removeTag: (tag: TagType) => void;
}

const StyledButton = styled(Button)`
  margin-right: 1%;
  width: 49%;
`;

const StyledSubmitButton = styled(Button)`
  width: 49%;
`;

const StyledForm = styled.form`
  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  margin: 0 -0.4rem;

  & select {
    width: 100%;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
`;

interface StyledFieldProps {
  width?: number;
}

const StyledField = styled.div<StyledFieldProps>`
  align-self: center;
  padding: 0 0.4rem 0.5rem 0.4rem;
  width: ${p => p.width && `${p.width}%`};
`;

const StyledTagline = styled.div`
  display: flex;
  flex-flow: wrap;
  padding: ${spacing.small} 0;
`;

const GenericSearchForm = ({
  type,
  selectors,
  query,
  onQueryChange,
  onSubmit,
  searchObject,
  onFieldChange,
  emptySearch,
  removeTag,
}: Props) => {
  const { t } = useTranslation();
  const tags: TagType[] = [
    { parameterName: 'query', value: query, formElementType: 'text-input' },
    ...selectors,
  ];
  return (
    <StyledForm
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
      }}>
      <StyledField width={50}>
        <input
          name="query"
          placeholder={t(`searchForm.types.${type}Query`)}
          value={query}
          onChange={onQueryChange}
        />
      </StyledField>
      {selectors.map(selector => {
        return (
          <StyledField
            key={`search-form-field-${selector.parameterName}`}
            width={selector.width ?? 50}>
            <Selector
              searchObject={searchObject}
              selector={selector}
              onFieldChange={onFieldChange}
            />
          </StyledField>
        );
      })}
      <StyledField width={25}>
        <StyledButton onClick={emptySearch} outline>
          {t('searchForm.empty')}
        </StyledButton>
        <StyledSubmitButton onClick={onSubmit}>{t('searchForm.btn')}</StyledSubmitButton>
      </StyledField>
      <StyledTagline>
        <SearchTagGroup onRemoveItem={removeTag} tagTypes={tags} />
      </StyledTagline>
    </StyledForm>
  );
};

export default GenericSearchForm;
