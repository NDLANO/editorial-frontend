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
import Types from 'slate-prop-types';
import './helpers/h5pResizer';
import { Input } from '@ndla/forms';
import handleError from '../../util/handleError';
import { fetchExternalOembed } from '../../util/apiHelpers';
import { EditorShape } from '../../shapes';
import { getIframeSrcFromHtmlString } from '../../util/htmlHelpers';
import { EXTERNAL_WHITELIST_PROVIDERS } from '../../constants';
import FigureButtons from '../SlateEditor/plugins/embed/FigureButtons';
import { StyledInputWrapper } from '../SlateEditor/plugins/embed/FigureInput';
import Overlay from '../Overlay';
import config from '../../config';

export class DisplayExternalVisualElement extends Component {
  constructor(props) {
    super(props);
    this.state = { editModus: false };
    this.handleChangeVisualElement = this.handleChangeVisualElement.bind(this);
    this.getPropsFromEmbed = this.getPropsFromEmbed.bind(this);
  }

  componentDidMount() {
    this.getPropsFromEmbed();
  }

  componentDidUpdate({ embed: prevEmbed }) {
    const { embed } = this.props;
    if (prevEmbed.url !== embed.url) {
      this.getPropsFromEmbed();
    }
  }

  async getPropsFromEmbed() {
    const { embed } = this.props;
    const domain = config.h5pApiUrl;
    this.setState({ domain });

    if (embed.resource === 'external' || embed.resource === 'h5p') {
      try {
        const url = domain + embed.path;
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
    const {
      onRemoveClick,
      embed,
      onFigureInputChange,
      language,
      t,
    } = this.props;
    const {
      title,
      src,
      height,
      type,
      provider,
      domain,
      error,
      editModus,
    } = this.state;

    if (error) {
      return error;
    }

    if (!type && !provider) {
      return null;
    }

    // H5P does not provide its name
    const providerName = domain && domain.includes('h5p') ? 'H5P' : provider;

    const [
      allowedProvider,
    ] = EXTERNAL_WHITELIST_PROVIDERS.filter(whitelistProvider =>
      type === 'iframe'
        ? whitelistProvider.url.includes(domain)
        : whitelistProvider.name === providerName,
    );

    const youtubeOrH5p = src.includes('youtube') ? 'video' : 'external';

    return (
      <>
        {editModus && (
          <Overlay onExit={() => this.setState({ editModus: false })} />
        )}
        <div className="c-figure">
          <FigureButtons
            tooltip={t(`form.${youtubeOrH5p}.remove`, { type: providerName })}
            onRemoveClick={onRemoveClick}
            embed={embed}
            language={language}
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
          {youtubeOrH5p === 'video' && editModus ? (
            <StyledInputWrapper>
              <Input
                name="caption"
                label={t(`form.${youtubeOrH5p}.caption.label`)}
                value={embed.caption}
                onChange={onFigureInputChange}
                container="div"
                type="text"
                autoExpand
                placeholder={t(`form.${youtubeOrH5p}.caption.placeholder`)}
                white
              />
            </StyledInputWrapper>
          ) : (
            <Button
              stripped
              style={{ width: '100%' }}
              onClick={() => this.setState({ editModus: true })}>
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
  node: Types.node,
  isIframe: PropTypes.bool,
  embed: PropTypes.shape({
    width: PropTypes.string,
    heigth: PropTypes.string,
    url: PropTypes.string,
    path: PropTypes.string,
    resource: PropTypes.string,
    height: PropTypes.number,
    caption: PropTypes.string,
  }),
  onFigureInputChange: PropTypes.func,
  language: PropTypes.string,
};

export default injectT(DisplayExternalVisualElement);
