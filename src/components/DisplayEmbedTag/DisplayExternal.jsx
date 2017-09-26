/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import EditorErrorMessage from '../SlateEditor/EditorErrorMessage';
import { fetchExternalOembed } from '../../util/apiHelpers';

export const getIframeSrcFromHtmlString = html => {
  const el = document.createElement('html');
  el.innerHTML = html;
  const iframe = el.getElementsByTagName('iframe')[0];
  return iframe.getAttribute('src');
};

export class DisplayExternal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentWillMount() {
    try {
      this.setState({ loading: true });
      const data = await fetchExternalOembed(this.props.url);
      const src = getIframeSrcFromHtmlString(data.html);
      if (src) {
        this.setState({
          title: data.title,
          src,
          type: data.type,
          provider: data.providerName,
          loading: false,
        });
      } else {
        this.setState({ error: true, loading: false });
      }
    } catch (e) {
      this.setState({ error: true, loading: false });
      // throw new Error(e);
    }
  }

  render() {
    const { title, src, error, type, provider, loading } = this.state;

    if (error) {
      return (
        <EditorErrorMessage msg={this.props.t('displayOembed.errorMessage')} />
      );
    }

    if (loading) {
      return <div />; // Spinner here!
    }

    if (type === 'video' && provider === 'YouTube') {
      return (
        <iframe
          style={{
            minHeight: '349px',
          }}
          ref={iframe => {
            this.iframe = iframe;
          }}
          src={src}
          title={title}
          frameBorder="0"
          allowFullScreen
        />
      );
    }

    return (
      <EditorErrorMessage
        msg={this.props.t('displayOembed.notSupported', { type, provider })}
      />
    );
  }
}

DisplayExternal.propTypes = {
  url: PropTypes.string.isRequired,
};

export default injectT(DisplayExternal);
