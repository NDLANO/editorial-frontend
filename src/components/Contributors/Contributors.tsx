/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { injectT, tType } from '@ndla/i18n';
import { contributorGroups, contributorTypes } from '@ndla/licenses';
import Button from '@ndla/button';
import styled from '@emotion/styled';
import { fonts, colors } from '@ndla/core';
import { FieldHeader } from '@ndla/forms';
import Contributor from './Contributor';
import { LocaleContext } from '../../containers/App/App';

const StyledFormWarningText = styled.p`
  font-family: ${fonts.sans};
  color: ${colors.support.red};
  ${fonts.sizes(14, 1.1)};
`;

// keyof typeof contributorGroups

enum ContGroups {
  CREATORS = 'creators',
  PROCESSORS = 'processors',
  RIGHTSHOLDERS = 'rightsholders',
}
interface ContributorType {
  name: string;
  type: string;
  focusOnMount: boolean;
}

interface Props {
  name: ContGroups;
  label: string;
  onChange: (event: { target: { value: ContributorType[]; name: string } }) => void;
  errorMessages?: Array<string>;
  showError?: boolean;
  placeholder?: string;
  disabled?: boolean;
  value: Array<ContributorType>;
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
  t,
  width = 3 / 4,
  ...rest
}: Props & tType) => {
  const locale = useContext(LocaleContext);
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

  const removeContributor = (e: React.FormEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const newContributors = [...value];
    newContributors.splice(index, 1);
    onContributorChange(newContributors);
  };

  const handleContributorChange = (
    evt: React.ChangeEvent<HTMLInputElement>,
    fieldName: 'type' | 'name',
    index: number,
  ) => {
    const newContributors = [...value];
    newContributors[index] = {
      ...newContributors[index],
      [fieldName]: evt.target.value,
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
      <Button outline onClick={addContributor} data-cy="addContributor" disabled={disabled}>
        {t('form.contributor.add')}
      </Button>
    </div>
  );
};

Contributors.propTypes = {
  name: PropTypes.oneOf<ContGroups>([
    ContGroups.CREATORS,
    ContGroups.PROCESSORS,
    ContGroups.RIGHTSHOLDERS,
  ]).isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  errorMessages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  showError: PropTypes.bool,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      focusOnMount: PropTypes.bool.isRequired,
    }).isRequired,
  ).isRequired,
  width: PropTypes.number,
};

export default injectT(Contributors);
