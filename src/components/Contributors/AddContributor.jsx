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
import DropDown from '../DropDown'

import { Button } from 'ndla-ui';
import { Arrow } from 'ndla-ui/icons';
import { InputFileField } from '../Fields';

const AddContributor = ({contributorName, contributorGroups}) => {
  console.log("HEEY");
  return (
    <div>
      <input value={contributorName}/>
      <DropDown items={contributorGroups}/>
    </div>
  )
}

export default AddContributor;
