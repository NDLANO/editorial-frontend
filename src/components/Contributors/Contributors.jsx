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
import { Plus } from 'ndla-icons/action';
import { contributorGroups, contributorTypes } from 'ndla-licenses';
import { Field, FieldErrorMessages, getField } from '../Fields';
import AddContributor from './AddContributor';
import { getLocale } from '../../modules/locale/locale';
import CirclePlusButton from '../CirclePlusButton';

const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1)

const Contributors = props => {
  const {
    name,
    label,
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
    newContributors.push({ name: '', type: '' });
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
    <Field>
      <label htmlFor={name}>{label}</label>
      {value.map((contributor, index) => (
        <AddContributor
          key={`contributor_${index}`} // eslint-disable-line react/no-array-index-key
          {...contributor}
          index={index}
          contributorTypes={contributorTypeItems}
          handleContributorTypeChange={evt =>
            handleContributorChange(evt, 'type', index)
          }
          handleContributorNameChange={evt =>
            handleContributorChange(evt, 'name', index)
          }
          removeContributor={evt => removeContributor(evt, index)}
          placeholder={placeholder}
          disabled={disabled}
        />
      ))}
      <FieldErrorMessages
        label={label}
        field={getField(name, schema)}
        submitted={submitted}
      />
      <CirclePlusButton onClick={addContributor} disabled={disabled}>
        <Plus className="c-icon--medium" />
      </CirclePlusButton>
    </Field>
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
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default connect(mapStateToProps)(Contributors);
