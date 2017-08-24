/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fetchH5PiframeUrl } from './h5pApi';

class H5PSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: undefined,
      isOpen: false,
    };
    this.handleH5PChange = this.handleH5PChange.bind(this);
  }

  componentDidMount() {
    fetchH5PiframeUrl()
      .then(data => {
        this.setState(() => ({ url: data.url }));
      })
      .catch(() => {
        this.setState({ error: 'Failed' });
      });

    window.addEventListener('message', this.handleH5PChange);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleH5PChange);
  }

  handleH5PChange(event) {
    const { onSelect } = this.props;
    if (event.data.type !== 'h5p') {
      return;
    }
    onSelect({
      id: event.data.oembed_url,
    });
  }

  render() {
    return (
      <div>
        <h2>H5P</h2>
        {this.state.url
          ? <iframe
              src={this.state.url}
              title="H5P"
              frameBorder="0"
              height="900"
            />
          : null}
      </div>
    );
  }
}

H5PSearch.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default H5PSearch;
