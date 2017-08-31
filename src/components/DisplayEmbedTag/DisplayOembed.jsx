/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { resolveJsonOrRejectWithError } from '../../util/apiHelpers';

export default class DisplayOembed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      src: '',
    };
    this.handleResizeMessage = this.handleResizeMessage.bind(this);
  }

  componentWillMount() {
    const { url } = this.props;
    this.enableIframeResizing();
    if (url) {
      fetch(url).then(resolveJsonOrRejectWithError).then(data => {
        if (data.type === 'rich' && data.html.indexOf('<iframe') !== -1) {
          const el = document.createElement('html');
          el.innerHTML = data.html;
          const iframe = el.getElementsByTagName('iframe')[0];
          this.setState({ title: data.title, src: iframe.getAttribute('src') });
        }
      });
    }
  }

  componentWillUnmount() {
    this.disableIframeResizing();
  }

  enableIframeResizing() {
    window.addEventListener('message', this.handleResizeMessage);
  }

  disableIframeResizing() {
    window.removeEventListener('message', this.handleResizeMessage);
  }

  handleResizeMessage(evt) {
    const iframe = this.iframe;

    if (iframe.contentWindow !== evt.source || evt.data.context !== 'h5p') {
      return;
    }

    /* Needed to enforce content to stay within iframe on Safari iOS */
    iframe.setAttribute('scrolling', 'no');

    const newHeight = evt.data.scrollHeight ? evt.data.scrollHeight + 35 : 800;
    // const newHeight = parseInt(heightString, 10) + 55;

    iframe.style.height = `${newHeight}px`;
  }

  render() {
    const { title, src } = this.state;

    return (
      <iframe
        ref={iframe => {
          this.iframe = iframe;
        }}
        src={src}
        title={title}
        frameBorder="0"
      />
    );
  }
}

DisplayOembed.propTypes = {
  url: PropTypes.string.isRequired,
};
