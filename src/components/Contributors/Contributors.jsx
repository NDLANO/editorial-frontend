/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { contributorGroups, contributorTypes } from 'ndla-licenses';
import Button from 'ndla-button';
import {
  FormHeader,
  FormSections,
  FormSplitter,
  FormInput,
  FormDropdown,
  FormRemoveButton,
} from 'ndla-forms';
import { getField } from '../Fields';
import { getLocale } from '../../modules/locale/locale';

const capitalizeFirstLetter = string =>
  string.charAt(0).toUpperCase() + string.slice(1);

const Contributors = props => {
  const {
    name,
    label,
    labelRemove,
    locale,
    schema,
    submitted,
    placeholder,
    bindInput,
    disabled,
  } = props;
  const { onChange, value } = bindInput(name);

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

  const errorMessages = getField(name, schema).errors.map(error =>
    error(label),
  );

  return (
    <Fragment>
      <FormHeader title={label} width={3 / 4} />
      {value.map((contributor, index) => (
        <FormSections
          key={`contributor_test_${index}`} // eslint-disable-line react/no-array-index-key
        >
          <div>
            <FormSplitter>
              <FormInput
                warningText={
                  submitted &&
                  (contributor.name === '' || contributor.type === '')
                    ? errorMessages[0]
                    : null
                }
                container="div"
                type="text"
                focusOnMount={contributor.focusOnMount}
                placeholder={placeholder}
                disabled={disabled}
                value={contributor.name}
                onChange={e => handleContributorChange(e, 'name', index)}
              />
              <FormDropdown
                value={contributor.type}
                onChange={e => handleContributorChange(e, 'type', index)}
                onBlur={e => handleContributorChange(e, 'type', index)}
                data-cy="contributor-selector">
                <option value="" />
                {contributorTypeItems.map(item => (
                  <option value={item.type} key={item.type}>
                    {item.translation}
                  </option>
                ))}
              </FormDropdown>
            </FormSplitter>
          </div>
          <div>
            <FormRemoveButton onClick={evt => removeContributor(evt, index)}>
              {labelRemove}
            </FormRemoveButton>
          </div>
        </FormSections>
      ))}
      <Button
        outline
        onClick={addContributor}
        data-cy="addContributor"
        disabled={disabled}>
        Legg til
      </Button>
    </Fragment>
  );
};

Contributors.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  bindInput: PropTypes.func.isRequired,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  submitted: PropTypes.bool.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  labelRemove: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default connect(mapStateToProps)(Contributors);
