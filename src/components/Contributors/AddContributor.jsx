/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'ndla-ui';
import { Cross } from 'ndla-icons/action';
import DropDown from '../Dropdown/DropDown';
import { classes } from '../Fields';

const AddContributor = ({
  name,
  type,
  contributorTypes,
  handleContributorTypeChange,
  handleContributorNameChange,
  removeContributor,
}) => {
  const defaultSelectedItem = type
    ? contributorTypes.find(contributorType => contributorType.type === type)
    : '';
  return (
    <div {...classes('three-column')}>
      <input onChange={handleContributorNameChange} value={name} />
      <DropDown
        items={contributorTypes}
        onChange={handleContributorTypeChange}
        textField="translation"
        valueField="type"
        defaultSelectedItem={defaultSelectedItem}
      />
      <Button stripped onClick={removeContributor}>
        <Cross className='c-icon--medium'/>
      </Button>
    </div>
  );
};

AddContributor.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  contributorTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleContributorNameChange: PropTypes.func.isRequired,
  handleContributorTypeChange: PropTypes.func.isRequired,
  removeContributor: PropTypes.func.isRequired,
};

AddContributor.defaultProps = {
  placeholder: '',
};

export default AddContributor;
