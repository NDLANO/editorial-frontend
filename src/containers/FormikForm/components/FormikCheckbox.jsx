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

const FormikCheckbox = ({ display, children, ...rest }) => {
  return (
    <FormikField {...rest}>
      {({ field }) => (
        <Fragment>
          <StyledInputCheckbox display={display} type="checkbox" {...field} />
          {children}
        </Fragment>
      )}
    </FormikField>
  );
};

FormikCheckbox.defaultProps = {
  display: 'block',
};

FormikCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  display: PropTypes.string,
};

export default FormikCheckbox;
