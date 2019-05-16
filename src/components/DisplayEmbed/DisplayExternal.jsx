/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
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
    if (prevProps.embed.url !== embed.url) {
      this.getPropsFromEmbed();
    }
  }

  onEditEmbed(properties) {
    const { editor, node, embed } = this.props;

    if (properties.url !== embed.url) {
      editor.setNodeByKey(node.key, {
        data: {
          ...properties,
        },
      });
      this.closeEditEmbed();
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
      } catch (err) {
        handleError(err);
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
    const { onRemoveClick, embed, t } = this.props;
    const {
      isEditMode,
      title,
      src,
      height,
      error,
      type,
      provider,
      domain,
    } = this.state;

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

    if (error || !allowedProvider) {
      return (
        <Fragment>
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
        </Fragment>
      );
    }

    return (
      <div className="c-figure">
        <FigureButtons
          tooltip={t('form.external.remove')}
          onRemoveClick={onRemoveClick}
          embed={embed}
          t={t}
          figureType="external"
          onEdit={
            allowedProvider.name
              ? evt =>
                  this.openEditEmbed(evt, allowedProvider.name.toLowerCase())
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
    heigth: PropTypes.string,
    url: PropTypes.string,
  }),
};

export default injectT(DisplayExternal);
