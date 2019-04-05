/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import defined from 'defined';
import { Figure } from '@ndla/ui';
import Button from '@ndla/button';
import config from '../../../../config';
import { EmbedShape } from '../../../../shapes';
import EditVideo from './EditVideo';
import DeleteButton from '../../../../components/DeleteButton';
import * as visualElementApi from '../../../../containers/VisualElement/visualElementApi';

const getIframeProps = ({ account, videoid, player = 'default' }, sources) => {
  const source =
    sources
      .filter(s => s.width && s.height)
      .sort((a, b) => a.height < b.height)[0] || {};
  return {
    src: `https://players.brightcove.net/${account}/${player}_default/index.html?videoId=${videoid}`,
    height: defined(source.height, '480'),
    width: defined(source.width, '640'),
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
      ...rest
    } = this.props;
    const { iframeData } = this.state;

    return (
      <Figure id={embed.videoid} resizeIframe {...attributes}>
        <DeleteButton stripped onClick={onRemoveClick} />
        <iframe
          title={`Video: ${embed.metaData ? embed.metaData.name : ''}`}
          frameBorder="0"
          {...iframeData}
          allowFullScreen
        />

        {this.state.editMode ? (
          <EditVideo
            embed={embed}
            toggleEditModus={this.toggleEditModus}
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

export default SlateVideo;
