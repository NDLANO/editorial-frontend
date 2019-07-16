/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import FormikActionButton from './FormikActionButton';
import { FirstLoadContext } from '../../App/App';

const FormikAbortButton = ({ children, history, ...rest }) => {
  const isFirstLoad = useContext(FirstLoadContext);
  return (
    <FormikActionButton
      onClick={isFirstLoad ? () => history.push('/') : history.goBack}
      {...rest}>
      {children}
    </FormikActionButton>
  );
};

FormikAbortButton.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }),
};

export default withRouter(FormikAbortButton);
