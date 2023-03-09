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
import { ButtonV2 } from '@ndla/button';
import { SearchParams } from './SearchForm';
import SearchTagGroup from './SearchTagGroup';
import Selector, { SearchFormSelector } from './Selector';
import { DateChangedEvent } from '../../../FormikForm/components/InlineDatePicker';

type FormEvents = FormEvent<HTMLInputElement> | FormEvent<HTMLSelectElement>;
type FieldChangedEvent = FormEvents | DateChangedEvent;

export type OnFieldChangeFunction = <T extends keyof SearchParams>(
  name: T,
  value: SearchParams[T],
  event: FieldChangedEvent,
) => void;

interface Props {
  type: string;
  selectors: SearchFormSelector[];
  query: string;
  searchObject: SearchParams;
  onSubmit: () => void;
  onFieldChange: OnFieldChangeFunction;
  emptySearch: (evt: MouseEvent<HTMLButtonElement>) => void;
  removeTag: (tag: SearchFormSelector) => void;
}

const StyledButton = styled(ButtonV2)`
  flex: 1;
  height: ${spacing.normal};
  min-height: ${spacing.mediumlarge};
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

const ButtonContainer = styled.div`
  flex: 1;
  display: flex;
  gap: ${spacing.xsmall};
  margin: 0 ${spacing.xsmall};
`;

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
  selectors: baseSelectors,
  query,
  onSubmit,
  searchObject,
  onFieldChange,
  emptySearch,
  removeTag,
}: Props) => {
  const { t } = useTranslation();
  const selectors: SearchFormSelector[] = [
    { parameterName: 'query', width: 50, value: query, formElementType: 'text-input' },
    ...baseSelectors,
  ];

  return (
    <StyledForm
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
      }}>
      {selectors.map(selector => {
        return (
          <StyledField
            key={`search-form-field-${selector.parameterName}`}
            width={selector.width ?? 50}>
            <Selector
              searchObject={searchObject}
              selector={selector}
              onFieldChange={onFieldChange}
              formType={type}
            />
          </StyledField>
        );
      })}
      <ButtonContainer>
        <StyledButton onClick={emptySearch} variant="outline">
          {t('searchForm.empty')}
        </StyledButton>
        <StyledButton type="submit" onClick={onSubmit}>
          {t('searchForm.btn')}
        </StyledButton>
      </ButtonContainer>
      <StyledTagline>
        <SearchTagGroup onRemoveItem={removeTag} tagTypes={selectors} />
      </StyledTagline>
    </StyledForm>
  );
};

export default GenericSearchForm;
