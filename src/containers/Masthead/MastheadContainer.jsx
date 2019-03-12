/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Masthead } from '@ndla/ui';
import Navigation from './components/Navigation';

const MastheadContainer = ({ t, authenticated, userName }) => (
  <Masthead>
    <Navigation t={t} userName={userName} authenticated={authenticated}  />
  </Masthead>
);

MastheadContainer.propTypes = {
  params: PropTypes.shape({
    subjectId: PropTypes.string,
    topicId: PropTypes.string,
  }).isRequired,
  authenticated: PropTypes.bool.isRequired,
  userName: PropTypes.string,
};

export default MastheadContainer;
