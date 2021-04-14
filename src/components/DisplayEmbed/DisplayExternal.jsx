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
import EditorErrorMessage from '../SlateEditor/EditorErrorMessage';
import DisplayExternalModal from './helpers/DisplayExternalModal';
import { fetchExternalOembed } from '../../util/apiHelpers';
import { EditorShape } from '../../shapes';
import { urlDomain, getIframeSrcFromHtmlString } from '../../util/htmlHelpers';
import { EXTERNAL_WHITELIST_PROVIDERS } from '../../constants';
import DeleteButton from '../DeleteButton';
import FigureButtons from '../SlateEditor/plugins/embed/FigureButtons';
import config from '../../config';
import { getH5pLocale } from '../H5PElement/h5pApi';

export class DisplayExternal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditMode: false,
    };
    this.onEditEmbed = this.onEditEmbed.bind(this);
    this.handleChangeVisualElement = this.handleChangeVisualElement.bind(this);
    this.openEditEmbed = this.openEditEmbed.bind(this);
    this.closeEditEmbed = this.closeEditEmbed.bind(this);
    this.getPropsFromEmbed = this.getPropsFromEmbed.bind(this);
  }

  componentDidMount() {
    this.getPropsFromEmbed();
  }

  componentDidUpdate(prevProps) {
    const { embed } = this.props;
    if (prevProps.embed.url !== embed.url || prevProps.embed.path !== embed.path) {
      this.getPropsFromEmbed();
    }
  }

  onEditEmbed(properties) {
    const { editor, node, embed } = this.props;

    if (properties.url !== embed.url || properties.path !== embed.path) {
      editor.setNodeByKey(node.key, {
        data: {
          ...properties,
        },
      });
      this.closeEditEmbed();
    }
  }

  async getPropsFromEmbed() {
    const { embed, language } = this.props;
    const domain = embed.url ? urlDomain(embed.url) : config.h5pApiUrl;
    const cssUrl = encodeURIComponent(`${config.ndlaFrontendDomain}/static/h5p-custom-css.css`);
    this.setState({ domain });

    if (embed.resource === 'external' || embed.resource === 'h5p') {
      try {
        let url = embed.url || `${domain}${embed.path}`;
        url = url.includes(config.h5pApiUrl)
          ? `${url}?locale=${getH5pLocale(language)}&cssUrl=${cssUrl}`
          : url;

        const data = await fetchExternalOembed(url);
        const src = getIframeSrcFromHtmlString(data.html);

        if (src) {
          this.setState({
            title: data.title,
            src,
            type: data.type,
            provider: data.providerName,
            height: data.height || '486px',
          });
        } else {
          this.setState({ error: true });
        }
      } catch (err) {
        handleError(err);
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

  openEditEmbed(evt, providerName) {
    evt.preventDefault();
    this.handleChangeVisualElement(providerName);
    this.setState({ isEditMode: true });
  }

  closeEditEmbed(providerName) {
    this.handleChangeVisualElement(providerName);
    this.setState({ isEditMode: false });
  }

  render() {
    const { onRemoveClick, embed, t, language } = this.props;
    const { isEditMode, title, src, height, error, type, provider, domain } = this.state;

    const errorHolder = () => (
      <>
        <DeleteButton stripped onClick={onRemoveClick} />
        <EditorErrorMessage
          msg={
            error
              ? t('displayOembed.errorMessage')
              : t('displayOembed.notSupported', {
                  type,
                  provider,
                })
          }
        />
      </>
    );

    if (error) {
      return errorHolder();
    }

    // H5P does not provide its name
    const providerName = domain && domain.includes('h5p') ? 'H5P' : provider;

    const [allowedProvider] = EXTERNAL_WHITELIST_PROVIDERS.filter(whitelistProvider =>
      type === 'iframe'
        ? whitelistProvider.url.includes(domain)
        : whitelistProvider.name === providerName,
    );

    if (!allowedProvider) {
      return errorHolder();
    }

    if (!src || !type) {
      return <div></div>;
    }
    return (
      <div className="c-figure">
        <FigureButtons
          language={language}
          tooltip={t('form.external.remove', {
            type: providerName || t('form.external.title'),
          })}
          onRemoveClick={onRemoveClick}
          embed={embed}
          providerName={providerName}
          figureType="external"
          onEdit={
            allowedProvider.name
              ? evt => this.openEditEmbed(evt, allowedProvider.name.toLowerCase())
              : undefined
          }
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
        <DisplayExternalModal
          isEditMode={isEditMode}
          src={src}
          type={type}
          onEditEmbed={this.onEditEmbed}
          onClose={this.closeEditEmbed}
          allowedProvider={allowedProvider}
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
    url: PropTypes.string,
    path: PropTypes.string,
    height: PropTypes.string,
    resource: PropTypes.string,
  }),
  language: PropTypes.string,
};

export default injectT(DisplayExternal);
