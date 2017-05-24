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
    const { localParseHash, location: { hash }, history } = this.props;
    localParseHash(hash, history);
  }

  render() {
    return <div />;
  }
}

SessionInitializer.propTypes = {
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }).isRequired,
  localParseHash: PropTypes.func.isRequired,
  location: PropTypes.shape({ hash: PropTypes.string }),
};

const mapDispatchToProps = {
  localParseHash: parseHash,
};
export default connect(state => state, mapDispatchToProps)(SessionInitializer);
