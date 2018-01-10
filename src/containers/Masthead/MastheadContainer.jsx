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
import MastHeadSearch from './MastheadSearch';
import SessionContainer from './components/SessionContainer';
import SubMasthead from './components/SubMasthead';

const classes = new BEMHelper({
  name: 'masthead',
  prefix: 'c-',
});

const MastheadContainer = ({ t, authenticated, userName }) => (
  <Masthead>
    <div {...classes('container')}>
      <MastheadItem>
        <SubMasthead t={t} />
      </MastheadItem>
      <MastheadItem>
        <MastHeadSearch t={t} />
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
  t: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  userName: PropTypes.string,
};

export default MastheadContainer;
