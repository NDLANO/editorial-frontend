/*
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import FocusLabel from './FocusLabel';

const FormikFieldLabel = ({ label, noBorder, name, hasFocus }) => {
  if (!label) {
    return null;
  }
  if (!noBorder) {
    return <label htmlFor={name}>{label}</label>;
  }
  return (
    <Fragment>
      <label className="u-hidden" htmlFor={name}>
        {label}
      </label>
      <FocusLabel name={name} hasFocus={hasFocus}>
        {label}
      </FocusLabel>
    </Fragment>
  );
};

FormikFieldLabel.propTypes = {
  noBorder: PropTypes.bool,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  hasFocus: PropTypes.bool,
};

export default FormikFieldLabel;
