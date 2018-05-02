/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Masthead, MastheadItem, Logo } from 'ndla-ui';
import BEMHelper from 'react-bem-helper';
import MastheadSearch from './MastheadSearch';
import SessionContainer from './components/SessionContainer';
import Navigation from './components/Navigation';

const classes = new BEMHelper({
  name: 'masthead',
  prefix: 'c-',
});

export const editorialMastheadClasses = new BEMHelper({
  name: 'masthead-editorial',
  prefix: 'c-',
});

const MastheadContainer = ({ t, authenticated, userName }) => (
  <Masthead>
    <div {...classes('container')}>
      <MastheadItem>
        <Navigation t={t} />
      </MastheadItem>
      <MastheadItem>
        <MastheadSearch t={t} />
      </MastheadItem>
      <MastheadItem>
        <SessionContainer userName={userName} authenticated={authenticated} />
      </MastheadItem>
      <MastheadItem>
        <Logo to="/" altText="Nasjonal digital læringsarena" />
      </MastheadItem>
    </div>
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
