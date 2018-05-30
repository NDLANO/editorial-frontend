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
import { classes } from '../Fields';
import ObjectSelector from '../ObjectSelector';

const AddContributor = ({
  name,
  type,
  contributorTypes,
  handleContributorTypeChange,
  handleContributorNameChange,
  removeContributor,
  disabled,
}) => (
  <div {...classes('removable')}>
    <div {...classes('add-contributor')}>
      <input
        onChange={handleContributorNameChange}
        value={name}
        disabled={disabled}
      />
      <ObjectSelector
        options={contributorTypes}
        value={type}
        idKey="type"
        labelKey="translation"
        onChange={handleContributorTypeChange}
        onBlur={handleContributorTypeChange}
        disabled={disabled}
        emptyField
      />
    </div>
    <Button stripped onClick={removeContributor} disabled={disabled}>
      <Cross className="c-icon--medium" />
    </Button>
  </div>
);

AddContributor.propTypes = {
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  contributorTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  handleContributorNameChange: PropTypes.func.isRequired,
  handleContributorTypeChange: PropTypes.func.isRequired,
  removeContributor: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

AddContributor.defaultProps = {
  placeholder: '',
};

export default AddContributor;
