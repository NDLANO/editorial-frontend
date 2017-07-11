/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { resolveJsonOrRejectWithError } from '../util/apiHelpers';

export default class Oembed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      html: '',
    };
  }

  componentWillMount() {
    const { url } = this.props;
    if (url) {
      fetch(url).then(resolveJsonOrRejectWithError).then(data => {
        this.setState({ html: data.html });
      });
    }
  }

  render() {
    const { html } = this.state;

    return (
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        ref={iframeDiv => {
          this.iframeDiv = iframeDiv;
        }}
      />
    );
  }
}

Oembed.propTypes = {
  url: PropTypes.string.isRequired,
};
