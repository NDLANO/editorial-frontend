/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import css from '@emotion/css';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import Button from '@ndla/button';
import ObjectSelector from '../../../../components/ObjectSelector';
import { SearchParams } from './SearchForm';
import SearchTagGroup, { TagType } from './SearchTagGroup';
import InlineDatePicker from '../../../FormikForm/components/InlineDatePicker';

export interface SearchFormSelector {
  type: keyof SearchParams;
  name?: string;
  options: { id: string; name: string }[];
  width?: number;
}

interface Props {
  type: string;
  selectors: SearchFormSelector[];
  query: string;
  searchObject: SearchParams;
  onQueryChange: (event: FormEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  onFieldChange: (name: string, value: string) => void;
  emptySearch: (evt: MouseEvent<HTMLButtonElement>) => void;
  removeTag: (tag: TagType) => void;
}

export const datePickerTypes: (keyof SearchParams)[] = ['revision-date-from', 'revision-date-to'];

interface SelectorProps {
  selector: SearchFormSelector;
  onFieldChange: (name: string, value: string) => void;
  searchObject: SearchParams;
}

const Selector = ({ selector, onFieldChange, searchObject }: SelectorProps) => {
  const { t } = useTranslation();
  if (datePickerTypes.includes(selector.type)) {
    return (
      <InlineDatePicker
        name={selector.type}
        onChange={e => {
          const { name, value } = e.target;
          onFieldChange(name, value);
        }}
        placeholder={t(`searchForm.types.${selector.type}`)}
        value={(searchObject[selector.type] as string | undefined) ?? ''}
      />
    );
  }
  return (
    <ObjectSelector
      name={selector.type}
      // The fields in selectFields that are mapped over all correspond to a string value in SearchState.
      // As such, the value used below will always be a string. TypeScript just needs to be told explicitly.
      value={(searchObject[selector.type] as string) ?? ''}
      options={selector.options}
      idKey="id"
      labelKey="name"
      emptyField
      onChange={evt => {
        const { name, value } = evt.currentTarget;
        onFieldChange(name, value);
      }}
      placeholder={t(`searchForm.types.${selector.type}`)}
    />
  );
};

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
  const tags: TagType[] = [{ type: 'query', name: query }, ...selectors];
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
          <StyledField key={`search-form-field-${selector.type}`} width={selector.width ?? 50}>
            <Selector
              searchObject={searchObject}
              selector={selector}
              onFieldChange={onFieldChange}
            />
          </StyledField>
        );
      })}
      <StyledField width={25}>
        <Button
          css={css`
            margin-right: 1%;
            width: 49%;
          `}
          onClick={emptySearch}
          outline>
          {t('searchForm.empty')}
        </Button>
        <Button
          onClick={onSubmit}
          css={css`
            width: 49%;
          `}>
          {t('searchForm.btn')}
        </Button>
      </StyledField>
      <StyledTagline>
        <SearchTagGroup onRemoveItem={removeTag} tagTypes={tags} />
      </StyledTagline>
    </StyledForm>
  );
};

export default GenericSearchForm;
