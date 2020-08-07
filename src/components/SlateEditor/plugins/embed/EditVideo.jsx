import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { Input } from '@ndla/forms';
import { Portal } from '../../../Portal';
import Overlay from '../../../Overlay';
import { EmbedShape } from '../../../../shapes';
import { StyledInputWrapper } from './FigureInput';
import EditVideoTime from './EditVideoTime';

const videoStyle = {
  width: '100%',
  height: '100%',
  position: 'absolute',
  top: '0px',
  left: '0px',
  right: '0px',
};

class EditVideo extends Component {
  componentDidMount() {
    const { placeholderEl, embedEl } = this;

    const bodyRect = document.body.getBoundingClientRect();
    const placeholderRect = placeholderEl.getBoundingClientRect();

    // Placing embed within placeholder div on mount
    embedEl.style.position = 'absolute';
    embedEl.style.top = `${placeholderRect.top - bodyRect.top}px`;
    embedEl.style.left = `${placeholderRect.left}px`;
    embedEl.style.width = `${placeholderRect.width}px`;

    const embedRect = embedEl.getBoundingClientRect();

    placeholderEl.style.height = `${embedRect.height}px`;
  }

  render() {
    const {
      embed,
      onFigureInputChange,
      toggleEditModus,
      figureClass,
      t,
      changes,
      src
    } = this.props;
    return (
      <React.Fragment>
        <Overlay onExit={toggleEditModus} />
        <div
          ref={placeholderEl => {
            this.placeholderEl = placeholderEl;
          }}>
          <Portal isOpened>
            <div
              ref={embedEl => {
                this.embedEl = embedEl;
              }}>
              <figure css={{ paddingTop: '56.25%' }} {...figureClass}>
                <video
                  css={videoStyle}
                  data-video-id={embed.videoid}
                  data-account={embed.account}
                  data-player={embed.player}
                  data-embed="default"
                  className="video-js"
                  controls>
                  <track kind="captions" label={embed.caption} />
                </video>
              </figure>
              <StyledInputWrapper>
                <Input
                  name="caption"
                  label={t('form.video.caption.label')}
                  value={changes?.caption || embed.caption}
                  onChange={onFigureInputChange}
                  container="div"
                  type="text"
                  autoExpand
                  placeholder={t('form.video.caption.placeholder')}
                  white
                />
                <EditVideoTime
                  embed={embed}
                  onFigureInputChange={onFigureInputChange}
                  src={src}
                />
              </StyledInputWrapper>
            </div>
          </Portal>
        </div>
      </React.Fragment>
    );
  }
}

EditVideo.propTypes = {
  toggleEditModus: PropTypes.func,
  embed: EmbedShape.isRequired,
  onFigureInputChange: PropTypes.func.isRequired,
  figureClass: PropTypes.shape({ className: PropTypes.string }).isRequired,
  changes: PropTypes.shape({
    caption: PropTypes.string,
  }),
  src: PropTypes.string,
};

export default injectT(EditVideo);
