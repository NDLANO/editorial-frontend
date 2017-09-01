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
import './h5pResizer';
import EditorErrorMessage from '../SlateEditor/EditorErrorMessage';
import { fetchOembed } from '../../util/apiHelpers';

export const getIframeSrcFromHtmlString = html => {
  const el = document.createElement('html');
  el.innerHTML = html;
  const iframe = el.getElementsByTagName('iframe')[0];
  return iframe.getAttribute('src');
};

export class DisplayOembed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentWillMount() {
    try {
      const data = await fetchOembed(this.props.url);
      const src = getIframeSrcFromHtmlString(data.html);
      if (src) {
        this.setState({ title: data.title, src });
      } else {
        this.setState({ error: true });
      }
    } catch (e) {
      this.setState({ error: true });
      throw new Error(e);
    }
  }

  render() {
    const { title, src, error } = this.state;

    if (error) {
      return (
        <EditorErrorMessage msg={this.props.t('displayOembed.errorMessage')} />
      );
    }

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

export default injectT(DisplayOembed);
