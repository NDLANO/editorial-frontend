/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ActionButton from './ActionButton';
import { FirstLoadContext } from '../../App/App';

const AbortButton = ({ children, history, ...rest }) => {
  const isFirstLoad = useContext(FirstLoadContext);
  return (
    <ActionButton onClick={isFirstLoad ? () => history.push('/') : history.goBack} {...rest}>
      {children}
    </ActionButton>
  );
};

AbortButton.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
  }),
};

export default withRouter(AbortButton);
