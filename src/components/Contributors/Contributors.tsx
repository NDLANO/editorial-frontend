/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent, MouseEvent } from 'react';
import { contributorGroups, contributorTypes } from '@ndla/licenses';
import { ButtonV2 } from '@ndla/button';
import styled from '@emotion/styled';
import { fonts, colors } from '@ndla/core';
import { FieldHeader } from '@ndla/forms';
import { useTranslation } from 'react-i18next';
import Contributor from './Contributor';
import { ContributorType, ContributorFieldName } from './types';

const StyledFormWarningText = styled.p`
  font-family: ${fonts.sans};
  color: ${colors.support.red};
  ${fonts.sizes(14, 1.1)};
`;

enum ContributorGroups {
  CREATORS = 'creators',
  PROCESSORS = 'processors',
  RIGHTSHOLDERS = 'rightsholders',
}

interface Props {
  name: ContributorGroups;
  label: string;
  onChange: (event: { target: { value: ContributorType[]; name: string } }) => void;
  errorMessages?: string[];
  showError?: boolean;
  placeholder?: string;
  disabled?: boolean;
  value: ContributorType[];
  width?: number;
}

const Contributors = ({
  name,
  label,
  errorMessages = [],
  disabled,
  showError = false,
  onChange,
  value,
  width = 3 / 4,
  ...rest
}: Props) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const onContributorChange = (newContributors: ContributorType[]) => {
    onChange({
      target: {
        value: newContributors,
        name,
      },
    });
  };

  const addContributor = () => {
    const newContributors = [...value];
    newContributors.push({ name: '', type: '', focusOnMount: true });
    onContributorChange(newContributors);
  };

  const removeContributor = (e: MouseEvent<HTMLButtonElement>, index: number) => {
    e.preventDefault();
    const newContributors = [...value];
    newContributors.splice(index, 1);
    onContributorChange(newContributors);
  };

  const handleContributorChange = (
    evt: FormEvent<HTMLInputElement> | FormEvent<HTMLSelectElement>,
    fieldName: ContributorFieldName,
    index: number,
  ) => {
    const newContributors = [...value];
    newContributors[index] = {
      ...newContributors[index],
      [fieldName]: evt.currentTarget.value,
    };
    onContributorChange(newContributors);
  };

  const contributorTypeItems = contributorGroups[name].map((item: string) => ({
    type: item,
    translation: contributorTypes[locale]
      ? contributorTypes[locale][item]
      : contributorTypes.nb[item],
  }));

  return (
    <div>
      <FieldHeader title={label} width={width} />
      {value.map((contributor, index) => (
        <Contributor
          key={`contributor_${index}`} // eslint-disable-line react/no-array-index-key
          contributor={{ ...contributor, type: contributor.type.toLowerCase() }}
          index={index}
          showError={showError}
          errorMessages={errorMessages}
          contributorTypeItems={contributorTypeItems}
          handleContributorChange={handleContributorChange}
          removeContributor={removeContributor}
          {...rest}
        />
      ))}
      {showError && value.length === 0 && errorMessages.length > 0 && (
        <StyledFormWarningText>{errorMessages[0]}</StyledFormWarningText>
      )}
      <ButtonV2
        variant="outline"
        onClick={addContributor}
        data-cy="addContributor"
        disabled={disabled}>
        {t('form.contributor.add')}
      </ButtonV2>
    </div>
  );
};

export default Contributors;
