/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Button } from 'ndla-ui';
import {
  Plus,
} from 'ndla-ui/icons';
import { contributorGroups } from 'ndla-licenses'
import {Field} from '../Fields'
import AddContributor from './AddContributor';

const classes = new BEMHelper({
  name: 'add-contributor',
  prefix: 'c-',
});

const Contributors = (props) => {
  console.log("test", props)
  const {name, label, locale, bindInput, value, onChange} = props;
  const addContributor = () => {
    const newContributrs = [].concat(value);
    newContributrs.push({name: '', type: ''})
    onChange({target: {
      value: newContributrs,
      name,
    }})
  }

  const onContributorChange = (contributor, index) => {
    const newContributrs = [].concat(value);
    newContributrs[index] = contributor;
    onChange({target: {
      value: newContributrs,
      name,
    }})
  }

  return (
    <Field>
      <label htmlFor={name}>{label}</label>
      {value.map((contributor, index) => (
        <AddContributor {...contributor} index={index} contributorGroups={contributorGroups[name]}/>
      ))}
      <Button onClick={addContributor}>
        <Plus />
      </Button>
    </Field>
  );
};

Contributors.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Contributors;
