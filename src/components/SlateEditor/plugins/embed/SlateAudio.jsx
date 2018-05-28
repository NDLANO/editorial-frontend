/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { Figure } from 'ndla-ui';
import * as visualElementApi from '../../../../containers/VisualElement/visualElementApi';
import { EmbedShape } from '../../../../shapes';

import EditAudio from './EditAudio';
import AudioPlayerMounter from './AudioPlayerMounter';

class SlateAudio extends React.Component {
  constructor(props) {
    super(props);
    this.state = { audio: {} };
    this.toggleEdit = this.toggleEdit.bind(this);
  }

  async componentWillMount() {
    try {
      const audio = await visualElementApi.fetchAudio(
        this.props.embed.resource_id,
      );
      this.setState({ audio: { ...audio, title: audio.title.title } });
    } catch (error) {
      visualElementApi.onError(error);
    }
  }

  toggleEdit(e) {
    e.stopPropagation();
    this.setState(prevState => ({ editMode: !prevState.editMode }));
  }

  render() {
    const { attributes, onFigureInputChange, embed, ...rest } = this.props;
    const { audio = {} } = this.state;

    const player = audio.id && (
      <Figure id={`${audio.id}`} {...attributes}>
        <AudioPlayerMounter
          audio={audio}
          speech={embed.audioType === 'speech'}
        />
      </Figure>
    );

    return this.state.editMode ? (
      <EditAudio
        onExit={() => this.setState({ editMode: false })}
        audioType={embed.audioType || 'sound'}
        onChange={onFigureInputChange}
        embed={embed}
        {...rest}>
        {player}
      </EditAudio>
    ) : (
      <div
        role="button"
        tabIndex={0}
        onKeyPress={() => this.setState({ editMode: true })}
        onClick={() => this.setState({ editMode: true })}>
        {player}
      </div>
    );
  }
}

SlateAudio.propTypes = {
  embed: EmbedShape.isRequired,
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  onRemoveClick: PropTypes.func.isRequired,
  onFigureInputChange: PropTypes.func.isRequired,
};

export default injectT(SlateAudio);
