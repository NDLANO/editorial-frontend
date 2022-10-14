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
import ObjectSelector from '../../../../components/ObjectSelector';
import { SearchParams } from './SearchForm';
import SearchTagGroup, { TagType } from './SearchTagGroup';
import InlineDatePicker from '../../../FormikForm/components/InlineDatePicker';
import CheckboxSelector from './CheckboxSelector';
import { unreachable } from '../../../../util/guards';

interface SearchFormSelectorBase {
  parameterName: keyof SearchParams;
  value?: string;
  width?: number;
  formElementType: 'date-picker' | 'dropdown' | 'check-box' | 'text-input';
}

/** These types are to extract keys of a specific type from SearchParams */
type RSP = Required<SearchParams>;
type SearchParamsWithOnlyType<P> = { [k in keyof RSP]: RSP[k] extends P ? k : never }[keyof RSP];
type SearchParamsOfType<O> = { [k in SearchParamsWithOnlyType<O>]: O };

export type SearchFormSelector =
  | CheckboxSelectorType
  | ObjectSelectorType
  | DatePickerSelectorType
  | TextInputSelectorType;

export interface CheckboxSelectorType extends SearchFormSelectorBase {
  formElementType: 'check-box';
  parameterName: keyof SearchParamsOfType<boolean>;
}
export interface ObjectSelectorType extends SearchFormSelectorBase {
  formElementType: 'dropdown';
  options: { id: string; name: string }[];
  parameterName: keyof SearchParamsOfType<string>;
}
export interface DatePickerSelectorType extends SearchFormSelectorBase {
  formElementType: 'date-picker';
  parameterName: keyof SearchParamsOfType<string>;
}
export interface TextInputSelectorType extends SearchFormSelectorBase {
  formElementType: 'text-input';
}

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

interface SelectorProps {
  selector: SearchFormSelector;
  onFieldChange: OnFieldChangeFunction;
  searchObject: SearchParams;
}

const Selector = ({ selector, onFieldChange, searchObject }: SelectorProps) => {
  const { t } = useTranslation();
  switch (selector.formElementType) {
    case 'text-input':
      // TODO: text-input/query is handled specifically in `GenericSearchForm`
      //       in the future this should probably be moved here.
      //       for now this branch will remain here to satisfy the typing.
      return null;
    case 'date-picker':
      const datePickerValue = searchObject[selector.parameterName];
      return (
        <InlineDatePicker
          name={selector.parameterName}
          onChange={e => onFieldChange(selector.parameterName, e.target.value)}
          placeholder={t(`searchForm.types.${selector.parameterName}`)}
          value={datePickerValue ?? ''}
        />
      );
    case 'check-box':
      const checkboxValue = searchObject[selector.parameterName];
      return (
        <CheckboxSelector
          name={selector.parameterName}
          checked={checkboxValue ?? false}
          onChange={e => onFieldChange(selector.parameterName, e.currentTarget.checked)}
        />
      );
    case 'dropdown':
      const dropdownValue = searchObject[selector.parameterName];
      return (
        <ObjectSelector
          name={selector.parameterName}
          value={dropdownValue ?? ''}
          options={selector.options}
          idKey="id"
          labelKey="name"
          emptyField
          onChange={evt => onFieldChange(selector.parameterName, evt.currentTarget.value)}
          placeholder={t(`searchForm.types.${selector.parameterName}`)}
        />
      );
    default:
      return unreachable(selector);
  }
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
