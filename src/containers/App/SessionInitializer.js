/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { parseHash } from './sessionActions';

export class SessionInitializer extends React.Component {
  componentWillMount() {
    console.log('welcome to the SessionInitializer we have props:', this.props);
    const { localParseHash, location: { hash } } = this.props;
    console.log('hash', hash);
    localParseHash(hash);
  }

  render() {
    console.log('rendering a div');
    return <div />;
  }
}

SessionInitializer.propTypes = {
  localParseHash: PropTypes.func.isRequired,
  location: PropTypes.shape({ hash: PropTypes.string }),
};

const mapDispatchToProps = {
  localParseHash: parseHash,
};
export default connect(state => state, mapDispatchToProps)(SessionInitializer);
