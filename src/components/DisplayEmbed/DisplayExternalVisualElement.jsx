/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import './helpers/h5pResizer';
import { Input } from '@ndla/forms';
import handleError from '../../util/handleError';
import { fetchExternalOembed } from '../../util/apiHelpers';
import { EditorShape } from '../../shapes';
import { getIframeSrcFromHtmlString, urlDomain } from '../../util/htmlHelpers';
import { EXTERNAL_WHITELIST_PROVIDERS } from '../../constants';
import FigureButtons from '../SlateEditor/plugins/embed/FigureButtons';
import { StyledInputWrapper } from '../SlateEditor/plugins/embed/FigureInput';
import EditVideoTime from '../SlateEditor/plugins/embed/EditVideoTime';
import { removeParams } from '../../util/videoUtil';
import Overlay from '../Overlay';
import config from '../../config';

export class DisplayExternalVisualElement extends Component {
  constructor(props) {
    super(props);
    this.state = { editMode: false };
    this.handleChangeVisualElement = this.handleChangeVisualElement.bind(this);
    this.getPropsFromEmbed = this.getPropsFromEmbed.bind(this);
  }

  componentDidMount() {
    this.getPropsFromEmbed();
  }

  componentDidUpdate({ embed: prevEmbed }) {
    const { embed } = this.props;
    if (prevEmbed.url !== embed.url || prevEmbed.path !== embed.path) {
      this.getPropsFromEmbed();
    }
  }

  async getPropsFromEmbed() {
    const { embed } = this.props;
    const domain = embed.url ? urlDomain(embed.url) : config.h5pApiUrl;
    this.setState({ domain });

    if (embed.resource === 'external' || embed.resource === 'h5p') {
      try {
        const url = embed.url || `${domain}${embed.path}`;
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

  render() {
    const { onRemoveClick, embed, onFigureInputChange, language, t } = this.props;
    const { title, src, height, type, provider, domain, error, editMode } = this.state;

    if (error) {
      return error;
    }

    if (!type && !provider) {
      return null;
    }

    // H5P does not provide its name
    const providerName = domain && domain.includes('h5p') ? 'H5P' : provider;

    const [allowedProvider] = EXTERNAL_WHITELIST_PROVIDERS.filter(whitelistProvider =>
      type === 'iframe'
        ? whitelistProvider.url.includes(domain)
        : whitelistProvider.name === providerName,
    );

    const youtubeOrH5p = src.includes('youtube') ? 'video' : 'external';
    return (
      <>
        {editMode && <Overlay onExit={() => this.setState({ editMode: false })} />}
        <div className="c-figure">
          <FigureButtons
            tooltip={t(`form.${youtubeOrH5p}.remove`, { type: providerName })}
            onRemoveClick={onRemoveClick}
            embed={embed}
            language={language}
            figureType="external"
          />
          <iframe
            ref={iframe => {
              this.iframe = iframe;
            }}
            src={editMode ? removeParams(src) : src}
            height={allowedProvider.height || height}
            title={title}
            scrolling={type === 'iframe' ? 'no' : undefined}
            allowFullScreen={allowedProvider.fullscreen || true}
            frameBorder="0"
          />
          {youtubeOrH5p === 'video' && editMode ? (
            <StyledInputWrapper>
              <Input
                name="caption"
                label={t(`form.${youtubeOrH5p}.caption.label`)}
                value={embed.caption}
                onChange={e =>
                  onFigureInputChange({
                    target: {
                      name: 'visualElementCaption',
                      value: e.target.value,
                    },
                  })
                }
                container="div"
                type="text"
                autoExpand
                placeholder={t(`form.${youtubeOrH5p}.caption.placeholder`)}
                white
              />
              <EditVideoTime name="url" src={src} onFigureInputChange={onFigureInputChange} />
            </StyledInputWrapper>
          ) : (
            <Button
              stripped
              style={{ width: '100%' }}
              onClick={() => this.setState({ editMode: true })}>
              <figcaption className="c-figure__caption">
                <div className="c-figure__info">{embed.caption}</div>
              </figcaption>
            </Button>
          )}
        </div>
      </>
    );
  }
}

DisplayExternalVisualElement.propTypes = {
  onRemoveClick: PropTypes.func,
  changeVisualElement: PropTypes.func,
  editor: EditorShape,
  node: PropTypes.any,
  isIframe: PropTypes.bool,
  embed: PropTypes.shape({
    width: PropTypes.string,
    heigth: PropTypes.string,
    url: PropTypes.string,
    path: PropTypes.string,
    resource: PropTypes.string,
    height: PropTypes.number,
    caption: PropTypes.string,
    start: PropTypes.string,
    stop: PropTypes.string,
  }),
  onFigureInputChange: PropTypes.func,
  onFigureTimeChange: PropTypes.func,
  language: PropTypes.string,
};

export default injectT(DisplayExternalVisualElement);
