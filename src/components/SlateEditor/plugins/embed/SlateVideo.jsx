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
import config from '../../../../config';
import { EmbedShape } from '../../../../shapes';
import FigureButtons from './FigureButtons';
import EditVideo from './EditVideo';
import * as visualElementApi from '../../../../containers/VisualElement/visualElementApi';

const getIframeProps = ({ account, videoid, player = 'default' }, sources) => {
  const sortedSources = sources
    .filter(s => s.width && s.height)
    .sort((a, b) => a.height < b.height);
  const source = sortedSources.length > 0 ? sortedSources[0] : {};
  return {
    src: `https://players.brightcove.net/${account}/${player}_default/index.html?videoId=${videoid}`,
    height: source.height || '480',
    width: source.width || '640',
  };
};

class SlateVideo extends React.PureComponent {
  constructor() {
    super();
    this.state = { editMode: false, iframeData: {} };
    this.toggleEditModus = this.toggleEditModus.bind(this);
  }

  async componentDidMount() {
    const { embed } = this.props;
    const sources = await visualElementApi.fetchVideoSources(
      embed.videoid,
      config.brightCoveAccountId,
    );

    const iframeData = getIframeProps(embed, sources);
    this.setState({ iframeData });
  }

  toggleEditModus() {
    this.setState(prevState => ({ editMode: !prevState.editMode }));
  }

  render() {
    const {
      embed,
      attributes,
      figureClass,
      onRemoveClick,
      t,
      ...rest
    } = this.props;
    const { iframeData, editMode } = this.state;

    return (
      <div className="c-figure" {...attributes}>
        <FigureButtons
          tooltip={t('form.video.remove')}
          onRemoveClick={onRemoveClick}
          embed={embed}
          figureType="video"
          t={t}
        />
        {editMode ? (
          <EditVideo
            embed={embed}
            toggleEditModus={this.toggleEditModus}
            figureClass={figureClass}
            {...rest}
          />
        ) : (
          <>
            <Figure
              draggable
              style={{ paddingTop: '56.25%' }}
              {...figureClass}
              resizeIframe>
              <iframe
                title={`Video: ${embed.metaData ? embed.metaData.name : ''}`}
                frameBorder="0"
                {...iframeData}
                allowFullScreen
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
  submitted: PropTypes.bool.isRequired,
  onRemoveClick: PropTypes.func.isRequired,
  figureClass: PropTypes.shape({ className: PropTypes.string }).isRequired,
};

export default injectT(SlateVideo);
