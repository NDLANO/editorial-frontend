/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { Button } from 'ndla-ui';
import Types from 'slate-prop-types';
import { Cross, Pencil } from 'ndla-icons/action';
import './h5pResizer';
import Lightbox from '../Lightbox';
import VisualElementSearch from '../../containers/VisualElement/VisualElementSearch';
import handleError from '../../util/handleError';
import EditorErrorMessage from '../SlateEditor/EditorErrorMessage';
import { fetchExternalOembed } from '../../util/apiHelpers';
import { EditorShape } from '../../shapes';
import { editorClasses } from '../SlateEditor/plugins/embed/SlateFigure';
import { urlDomain } from '../../util/htmlHelpers';
import { EXTERNAL_WHITELIST_PROVIDERS } from '../../constants';

const el = document.createElement('html');

export const getIframeSrcFromHtmlString = html => {
  el.innerHTML = html;
  const iframe = el.getElementsByTagName('iframe')[0];
  return iframe.getAttribute('src');
};

export class DisplayExternal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editH5pMode: false,
    };
    this.onEditEmbed = this.onEditEmbed.bind(this);
    this.toggleEditH5p = this.toggleEditH5p.bind(this);
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
      const next = editor.value.change().setNodeByKey(node.key, {
        data: {
          ...properties,
        },
      });
      editor.onChange(next);

      this.toggleEditH5p();
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

  toggleEditH5p() {
    const { changeVisualElement } = this.props;
    if (changeVisualElement) {
      changeVisualElement('h5p');
    } else
      this.setState(prevState => ({ editH5pMode: !prevState.editH5pMode }));
  }

  render() {
    const { onRemoveClick } = this.props;
    const { title, src, height, error, type, provider, domain } = this.state;

    if (!type && !provider) return null;

    // H5P does not provide its name
    const providerName = domain && domain.includes('h5p') ? 'H5P' : provider;

    const [allowedProvider] = EXTERNAL_WHITELIST_PROVIDERS.filter(
      whitelistProvider => {
        switch (type) {
          case 'iframe':
            return whitelistProvider.url.includes(domain);
          default:
            return whitelistProvider.name === providerName;
        }
      },
    );

    const renderProvider = allowedProvider && (
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
    );

    if (error) {
      return (
        <Fragment>
          <Button
            stripped
            onClick={onRemoveClick}
            {...editorClasses('delete-button')}>
            <Cross />
          </Button>
          <EditorErrorMessage
            msg={this.props.t('displayOembed.errorMessage')}
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
          {providerName === 'h5p' && (
            <Button
              stripped
              onClick={this.toggleEditH5p}
              {...editorClasses('button', 'green')}>
              <Pencil />
            </Button>
          )}
        </div>
        {renderProvider}
        {!renderProvider && (
          <EditorErrorMessage
            msg={this.props.t('displayOembed.notSupported', {
              type,
              provider,
            })}
          />
        )}
        {this.state.editH5pMode && (
          <Lightbox display fullscreen big onClose={this.toggleEditH5p}>
            <VisualElementSearch
              selectedResource="h5p"
              selectedResourceUrl={src}
              handleVisualElementChange={this.onEditEmbed}
              closeModal={this.toggleEditH5p}
            />
          </Lightbox>
        )}
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
