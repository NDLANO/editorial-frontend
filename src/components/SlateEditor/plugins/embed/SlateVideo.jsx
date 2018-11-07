/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Figure } from '@ndla/ui';
import Button from '@ndla/button';
import { injectT } from '@ndla/i18n';
import { Cross } from '@ndla/icons/action';
import config from '../../../../config';
import { EmbedShape } from '../../../../shapes';
import { editorClasses } from './SlateFigure';
import EditVideo from './EditVideo';

class SlateVideo extends React.PureComponent {
  constructor() {
    super();
    this.state = { editMode: false };
    this.toggleEditModus = this.toggleEditModus.bind(this);
  }

  toggleEditModus() {
    this.setState(prevState => ({ editMode: !prevState.editMode }));
  }

  render() {
    const {
      embed,
      attributes,
      t,
      figureClass,
      onRemoveClick,
      ...rest
    } = this.props;
    const src = `//players.brightcove.net/${config.brightCoveAccountId}/${
      config.brightcovePlayerId
    }_default/index.min.js`;
    return (
      <Figure id={embed.videoid} {...attributes}>
        <Button
          stripped
          onClick={onRemoveClick}
          {...editorClasses('delete-button')}>
          <Cross />
        </Button>
        <Helmet>
          <script src={src} type="text/javascript" />
        </Helmet>
        <figure style={{ paddingTop: '56.25%' }} {...figureClass}>
          <video
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: '0px',
              left: '0px',
              right: '0px',
            }}
            data-video-id={embed.videoid}
            data-account={embed.account}
            data-player={embed.player}
            data-embed="default"
            className="video-js"
            controls>
            <track kind="captions" label={embed.caption} />
          </video>
          {this.state.editMode ? (
            <EditVideo
              embed={embed}
              toggleEditModus={this.toggleEditModus}
              t={t}
              {...rest}
            />
          ) : (
            <Button
              stripped
              style={{ width: '100%', textAlign: 'left' }}
              onClick={this.toggleEditModus}>
              <figcaption className="c-figure__caption">
                <div className="c-figure__info">{embed.caption}</div>
              </figcaption>
            </Button>
          )}
        </figure>
      </Figure>
    );
  }
}

SlateVideo.propTypes = {
  embed: EmbedShape.isRequired,
  onFigureInputChange: PropTypes.func.isRequired,
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  submitted: PropTypes.bool.isRequired,
  onRemoveClick: PropTypes.func.isRequired,
  figureClass: PropTypes.shape({ className: PropTypes.string }).isRequired,
};

export default injectT(SlateVideo);
