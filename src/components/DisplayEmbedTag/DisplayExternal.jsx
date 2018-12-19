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
import Button from '@ndla/button';
import Types from 'slate-prop-types';
import { Cross, Pencil } from '@ndla/icons/action';

import './helpers/h5pResizer';
import handleError from '../../util/handleError';
import EditorErrorMessage from '../SlateEditor/EditorErrorMessage';
import DisplayExternalModal from './helpers/DisplayExternalModal';
import { fetchExternalOembed } from '../../util/apiHelpers';
import { EditorShape } from '../../shapes';
import { editorClasses } from '../SlateEditor/plugins/embed/SlateFigure';
import { urlDomain, getIframeSrcFromHtmlString } from '../../util/htmlHelpers';
import { EXTERNAL_WHITELIST_PROVIDERS } from '../../constants';

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
    this.getPropsFromEmbed(this.props.url);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.url !== this.props.url) {
      this.getPropsFromEmbed(this.props.url);
    }
  }

  onEditEmbed(properties) {
    const { editor, node } = this.props;

    if (properties.url !== this.props.url) {
      editor.setNodeByKey(node.key, {
        data: {
          ...properties,
        },
      });
      this.closeEditEmbed();
    }
  }

  async getPropsFromEmbed(url) {
    const { embed } = this.props;
    const domain = urlDomain(url);
    this.setState({ domain });

    if (embed.resource === 'external') {
      try {
        const data = await fetchExternalOembed(url);
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
        src: url,
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

  openEditEmbed(providerName) {
    this.handleChangeVisualElement(providerName);
    this.setState({ isEditMode: true });
  }

  closeEditEmbed(providerName) {
    this.handleChangeVisualElement(providerName);
    this.setState({ isEditMode: false });
  }

  render() {
    const { onRemoveClick, t } = this.props;
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
          <Button
            stripped
            onClick={onRemoveClick}
            {...editorClasses('delete-button')}>
            <Cross />
          </Button>
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
      <Fragment>
        <div {...editorClasses('figure-buttons', '')}>
          <Button
            stripped
            onClick={onRemoveClick}
            {...editorClasses('button', 'red')}>
            <Cross />
          </Button>
          {allowedProvider.name && (
            <Button
              stripped
              onClick={() =>
                this.openEditEmbed(allowedProvider.name.toLowerCase())
              }
              {...editorClasses('button', 'green')}>
              <Pencil />
            </Button>
          )}
        </div>
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
      </Fragment>
    );
  }
}

DisplayExternal.propTypes = {
  url: PropTypes.string.isRequired,
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
