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
import { Figure } from 'ndla-ui';
import SlateInputField from './SlateInputField';
import EditorErrorMessage from '../../../SlateEditor/EditorErrorMessage';
import { fetchExternalOembed } from '../../../../util/apiHelpers';
import { EmbedShape } from '../../../../shapes';

export const getIframeSrcFromHtmlString = html => {
  const el = document.createElement('html');
  el.innerHTML = html;
  const iframe = el.getElementsByTagName('iframe')[0];
  return iframe.getAttribute('src');
};

export class SlateExternal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentWillMount() {
    const { embed } = this.props;
    try {
      this.setState({ loading: true });
      const data = await fetchExternalOembed(embed.url);
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
    const { embed, onFigureInputChange, attributes, submitted, t } = this.props;

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
        <Figure {...attributes}>
          <iframe
            style={{
              minHeight: '437px',
            }}
            ref={iframe => {
              this.iframe = iframe;
            }}
            src={src}
            title={title}
            frameBorder="0"
            allowFullScreen
          />
          <SlateInputField
            name="caption"
            label={t('form.video.caption.label')}
            type="text"
            required
            value={embed.caption}
            submitted={submitted}
            onChange={onFigureInputChange}
            placeholder={t('form.video.caption.placeholder')}
          />
        </Figure>
      );
    }

    return (
      <EditorErrorMessage
        msg={this.props.t('displayOembed.notSupported', { type, provider })}
      />
    );
  }
}

SlateExternal.propTypes = {
  embed: EmbedShape.isRequired,
  onFigureInputChange: PropTypes.func.isRequired,
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  submitted: PropTypes.bool.isRequired,
};

export default injectT(SlateExternal);
