/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import FormikField from '../../../components/FormikField';

const StyledInputCheckbox = styled.input`
  appearance: checkbox !important;
  margin-right: ${spacing.small};
  display: ${p => p.display};
  width: auto;
`;

const Checkbox = ({ display, children, ...rest }) => {
  return (
    <FormikField {...rest}>
      {({ field }) => (
        <Fragment>
          <StyledInputCheckbox display={display} type="checkbox" checked={field.value} {...field} />
          {children}
        </Fragment>
      )}
    </FormikField>
  );
};

Checkbox.defaultProps = {
  display: 'block',
};

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  display: PropTypes.string,
};

export default Checkbox;
