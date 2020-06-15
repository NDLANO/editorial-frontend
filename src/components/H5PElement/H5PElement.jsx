/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { ErrorMessage } from '@ndla/ui';
import { fetchH5PiframeUrl, editH5PiframeUrl } from './h5pApi';

class H5PElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      url: undefined,
      fetchFailed: false,
    };
    this.handleH5PChange = this.handleH5PChange.bind(this);
  }

  /* eslint-disable react/no-did-mount-set-state */
  /* See: https://github.com/yannickcr/eslint-plugin-react/issues/1110 */
  async componentDidMount() {
    const { h5pUrl } = this.props;
    window.addEventListener('message', this.handleH5PChange);
    try {
      const data = h5pUrl
        ? await editH5PiframeUrl(h5pUrl)
        : await fetchH5PiframeUrl();
      this.setState(() => ({ url: data.url }));
    } catch (e) {
      this.setState({ fetchFailed: true });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleH5PChange);
  }

  handleH5PChange(event) {
    const { onSelect } = this.props;
    if (event.data.type !== 'h5p') {
      return;
    }

    // Currently, we need to strip oembed part of H5P-url to support NDLA proxy oembed service
    const { oembed_url: oembedUrl } = event.data;
    const url = oembedUrl.match(/url=([^&]*)/)[0].replace('url=', '');
    const path = url.replace(/https?:\/\/h5p.{0,8}.ndla.no/, '')
    onSelect({ path });
  }

  render() {
    const { url, fetchFailed } = this.state;
    const { t } = this.props;
    return (
      <div>
        {fetchFailed && (
          <ErrorMessage
            illustration={{
              url: '/Oops.gif',
              altText: t('errorMessage.title'),
            }}
            messages={{
              title: t('errorMessage.title'),
              description: t('h5pElement.fetchError'),
            }}
          />
        )}
        {url && <iframe src={url} title="H5P" frameBorder="0" height="900" />}
      </div>
    );
  }
}

H5PElement.propTypes = {
  h5pUrl: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

export default injectT(H5PElement);
