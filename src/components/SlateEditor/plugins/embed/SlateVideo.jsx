/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import Button from '@ndla/button';
import { Figure } from '@ndla/ui';
import { EmbedShape } from '../../../../shapes';
import FigureButtons from './FigureButtons';
import EditVideo from './EditVideo';
import {
  getYoutubeEmbedUrl,
  getStartTime,
  getStopTime,
} from '../../../../util/videoUtil';
import { isBrightcoveUrl } from '../../../../util/htmlHelpers';

const videoStyle = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: '0px',
  left: '0px',
  right: '0px',
};

class SlateVideo extends React.PureComponent {
  constructor() {
    super();
    this.state = { editMode: false };
    this.toggleEditModus = this.toggleEditModus.bind(this);
    this.setStartTime = this.setStartTime.bind(this);
    this.setStopTime = this.setStopTime.bind(this);
  }

  componentDidMount() {
    const {
      embed: { resource, account, videoid, url, player = 'default' },
    } = this.props;
    if (resource === 'brightcove') {
      if (isBrightcoveUrl(url)) {
        this.setState({ src: url });
      } else {
        this.setState({
          src: `https://players.brightcove.net/${account}/${player}_default/index.html?videoId=${videoid}`,
        });
      }
    } else {
      this.setState({
        src: url.includes('embed') ? url : getYoutubeEmbedUrl(url),
        startTime: getStartTime(url),
        stopTime: getStopTime(url),
      });
    }
  }

  toggleEditModus() {
    this.setState(prevState => ({ editMode: !prevState.editMode }));
  }

  setStartTime(startTime) {
    this.setState({ startTime: startTime });
  }

  setStopTime(stopTime) {
    this.setState({ stopTime: stopTime });
  }

  render() {
    const {
      embed,
      attributes,
      figureClass,
      onRemoveClick,
      language,
      t,
      ...rest
    } = this.props;
    const { src, editMode, startTime, stopTime } = this.state;

    return (
      <div className="c-figure" draggable="true" {...attributes}>
        <FigureButtons
          tooltip={t('form.video.remove')}
          onRemoveClick={onRemoveClick}
          embed={embed}
          figureType="video"
          language={language}
          t={t}
        />
        {editMode ? (
          <EditVideo
            embed={embed}
            toggleEditModus={this.toggleEditModus}
            figureClass={figureClass}
            src={src}
            startTime={startTime}
            stopTime={stopTime}
            setStartTime={this.setStartTime}
            setStopTime={this.setStopTime}
            {...rest}
          />
        ) : (
          <>
            <Figure
              draggable
              style={{ paddingTop: '57%' }}
              {...figureClass}
              id={embed.videoid}
              resizeIframe>
              <iframe
                title={`Video: ${embed.metaData ? embed.metaData.name : ''}`}
                frameBorder="0"
                src={src}
                allowFullScreen
                css={videoStyle}
              />
            </Figure>
            <Button
              stripped
              style={{ width: '100%' }}
              onClick={this.toggleEditModus}>
              <figcaption className="c-figure__caption">
                <div className="c-figure__info">{embed.caption}</div>
              </figcaption>
            </Button>
          </>
        )}
      </div>
    );
  }
}

SlateVideo.propTypes = {
  embed: EmbedShape.isRequired,
  onFigureInputChange: PropTypes.func.isRequired,
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  onRemoveClick: PropTypes.func.isRequired,
  figureClass: PropTypes.shape({ className: PropTypes.string }),
  language: PropTypes.string,
};

export default injectT(SlateVideo);
