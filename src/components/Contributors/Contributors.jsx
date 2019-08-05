/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectT } from '@ndla/i18n';
import { contributorGroups, contributorTypes } from '@ndla/licenses';
import Button from '@ndla/button';
import styled from '@emotion/styled';
import { fonts, colors } from '@ndla/core';
import { FieldHeader } from '@ndla/forms';
import Contributor from './Contributor';
import { getLocale } from '../../modules/locale/locale';

const StyledFormWarningText = styled.p`
  font-family: ${fonts.sans};
  color: ${colors.support.red};
  ${fonts.sizes(14, 1.1)};
`;

const capitalizeFirstLetter = string =>
  string.charAt(0).toUpperCase() + string.slice(1);

const Contributors = props => {
  const {
    name,
    label,
    locale,
    errorMessages,
    disabled,
    showError,
    onChange,
    value,
    t,
    width,
    ...rest
  } = props;
  const onContributorChange = newContributors => {
    onChange({
      target: {
        value: newContributors,
        name,
      },
    });
  };
  const addContributor = () => {
    const newContributors = [].concat(value);
    newContributors.push({ name: '', type: '', focusOnMount: true });
    onContributorChange(newContributors);
  };

  const removeContributor = (e, index) => {
    e.preventDefault();
    const newContributors = [].concat(value);
    newContributors.splice(index, 1);
    onContributorChange(newContributors);
  };

  const handleContributorChange = (evt, fieldName, index) => {
    const newContributors = [].concat(value);
    newContributors[index] = {
      ...newContributors[index],
      [fieldName]: evt.target.value,
    };
    onContributorChange(newContributors);
  };

  const contributorTypeItems = contributorGroups[name].map(item => ({
    type: capitalizeFirstLetter(item),
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
          contributor={contributor}
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
      <Button
        outline
        onClick={addContributor}
        data-cy="addContributor"
        disabled={disabled}>
        {t('form.contributor.add')}
      </Button>
    </div>
  );
};

Contributors.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  errorMessages: PropTypes.arrayOf(PropTypes.string),
  showError: PropTypes.bool,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.string,
    }),
  ),
  width: PropTypes.number,
};

Contributors.defaultProps = {
  showError: false,
  width: 3 / 4,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default injectT(connect(mapStateToProps)(Contributors));
