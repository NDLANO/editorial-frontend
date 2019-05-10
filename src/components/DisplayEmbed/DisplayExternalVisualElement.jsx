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
import Types from 'slate-prop-types';
import './helpers/h5pResizer';
import handleError from '../../util/handleError';
import { fetchExternalOembed } from '../../util/apiHelpers';
import { EditorShape } from '../../shapes';
import { urlDomain, getIframeSrcFromHtmlString } from '../../util/htmlHelpers';
import { EXTERNAL_WHITELIST_PROVIDERS } from '../../constants';
import FigureButtons from '../SlateEditor/plugins/embed/FigureButtons';

export class DisplayExternal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleChangeVisualElement = this.handleChangeVisualElement.bind(this);
    this.getPropsFromEmbed = this.getPropsFromEmbed.bind(this);
  }

  componentDidMount() {
    this.getPropsFromEmbed();
  }

  componentDidUpdate(prevProps) {
    const { embed } = this.props;
    if (prevProps.embed.url !== embed.url) {
      this.getPropsFromEmbed();
    }
  }

  async getPropsFromEmbed() {
    const { embed } = this.props;
    const domain = urlDomain(embed.url);
    this.setState({ domain });

    if (embed.resource === 'external') {
      try {
        const data = await fetchExternalOembed(embed.url);
        const src = getIframeSrcFromHtmlString(data.html);
        if (src) {
          this.setState({
            title: data.title,
            src,
            type: data.type,
            provider: data.providerName,
          });
        } else {
          this.setState({ error: true });
        }
      } catch (e) {
        handleError(e);
        this.setState({ error: true });
      }
    } else {
      this.setState({
        title: domain,
        src: embed.url,
        type: embed.resource,
        height: embed.height,
      });
    }
  }

  handleChangeVisualElement(providerName) {
    const { changeVisualElement } = this.props;
    if (changeVisualElement) {
      changeVisualElement(providerName);
    }
  }

  render() {
    const { onRemoveClick, embed, t } = this.props;
    const { title, src, height, type, provider, domain, error } = this.state;

    if (error) {
      return error;
    }

    if (!type && !provider) {
      return null;
    }

    // H5P does not provide its name
    const providerName = domain && domain.includes('h5p') ? 'H5P' : provider;

    const [allowedProvider] = EXTERNAL_WHITELIST_PROVIDERS.filter(
      whitelistProvider =>
        type === 'iframe'
          ? whitelistProvider.url.includes(domain)
          : whitelistProvider.name === providerName,
    );

    return (
      <div className="c-figure">
        <FigureButtons
          tooltip={t('form.external.remove')}
          onRemoveClick={onRemoveClick}
          embed={embed}
          t={t}
          figureType="external"
        />
        <iframe
          ref={iframe => {
            this.iframe = iframe;
          }}
          src={src}
          height={allowedProvider.height || height}
          title={title}
          scrolling={type === 'iframe' ? 'no' : undefined}
          allowFullScreen={allowedProvider.fullscreen || true}
          frameBorder="0"
        />
      </div>
    );
  }
}

DisplayExternal.propTypes = {
  onRemoveClick: PropTypes.func,
  changeVisualElement: PropTypes.func,
  editor: EditorShape,
  node: Types.node,
  isIframe: PropTypes.bool,
  embed: PropTypes.shape({
    width: PropTypes.string,
    heigth: PropTypes.string,
    url: PropTypes.string,
  }),
};

export default injectT(DisplayExternal);
