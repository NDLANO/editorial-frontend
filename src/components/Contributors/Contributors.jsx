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
import { Button } from 'ndla-ui';
import { Plus } from 'ndla-ui/icons';
import { contributorGroups, contributorTypes } from 'ndla-licenses';
import { Field, FieldErrorMessages, getField, classes } from '../Fields';
import AddContributor from './AddContributor';
import { getLocale } from '../../modules/locale/locale';

const Contributors = props => {
  const {
    name,
    label,
    locale,
    value,
    onChange,
    schema,
    submitted,
    placeholder,
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
    newContributors.push({ name: '', type: '' });
    onContributorChange(newContributors);
  };

  const removeContributor = (e, index) => {
    e.preventDefault();
    const newContributors = [].concat(value);
    newContributors.splice(index, 1);
    onContributorChange(newContributors);
  };

  const handleContributorTypeChange = (type, index) => {
    const newContributors = [].concat(value);
    newContributors[index] = { ...newContributors[index], type };
    onContributorChange(newContributors);
  };

  const handleContributorNameChange = (evt, index) => {
    evt.preventDefault();
    const newContributors = [].concat(value);
    newContributors[index] = {
      ...newContributors[index],
      name: evt.target.value,
    };
    onContributorChange(newContributors);
  };

  const contributorTypeItems = contributorGroups[name].map(item => ({
    type: item,
    translation: contributorTypes[locale][item],
  }));
  return (
    <Field>
      <label htmlFor={name}>{label}</label>
      {value.map((contributor, index) => (
        <AddContributor
          key={`contributor_${index}`} //eslint-disable-line
          {...contributor}
          index={index}
          contributorTypes={contributorTypeItems}
          handleContributorTypeChange={c =>
            handleContributorTypeChange(c ? c.type : '', index)}
          handleContributorNameChange={e =>
            handleContributorNameChange(e, index)}
          removeContributor={e => removeContributor(e, index)}
          placeholder={placeholder}
        />
      ))}
      <FieldErrorMessages
        label={label}
        field={getField(name, schema)}
        submitted={submitted}
      />
      <Button {...classes('circle-button')} stripped onClick={addContributor}>
        <Plus />
      </Button>
    </Field>
  );
};

Contributors.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  onChange: PropTypes.func.isRequired,
  schema: PropTypes.shape({
    fields: PropTypes.object.isRequired,
  }),
  submitted: PropTypes.bool.isRequired,
  placeholder: PropTypes.string,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default connect(mapStateToProps)(Contributors);
