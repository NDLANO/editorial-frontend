/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Figure } from '@ndla/ui';

import * as visualElementApi from '../../../../containers/VisualElement/visualElementApi';
import { EmbedShape } from '../../../../shapes';

import EditAudio from './EditAudio';
import AudioPlayerMounter from './AudioPlayerMounter';

class SlateAudio extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editMode: false, audio: {} };
    this.toggleEdit = this.toggleEdit.bind(this);
    this.onAudioFigureInputChange = this.onAudioFigureInputChange.bind(this);
  }

  async componentDidMount() {
    const { caption, resource_id: resourceId } = this.props.embed;
    try {
      const audio = await visualElementApi.fetchAudio(resourceId);
      this.setState({
        audio: {
          ...audio,
          caption,
          title: audio.title.title || '',
        },
      });
    } catch (error) {
      visualElementApi.onError(error);
    }
  }

  onAudioFigureInputChange(e) {
    const { value, name } = e.target;

    this.setState(prevState => ({
      audio: {
        ...prevState.audio,
        [name]: value,
      },
    }));
    this.props.onFigureInputChange(e);
  }

  toggleEdit(e) {
    e.stopPropagation();
    this.setState(prevState => ({ editMode: !prevState.editMode }));
  }

  render() {
    const {
      attributes,
      onFigureInputChange,
      submitted,
      embed,
      onRemoveClick,
      locale,
    } = this.props;
    const { audio } = this.state;
    const speech = embed.audioType === 'speech';

    return (
      <Figure id={`${audio.id}`} draggable="true" {...attributes}>
        {this.state.editMode ? (
          <EditAudio
            onExit={this.toggleEdit}
            audioType={embed.audioType || 'sound'}
            onChange={onFigureInputChange}
            onAudioFigureInputChange={this.onAudioFigureInputChange}
            locale={locale}
            onRemoveClick={onRemoveClick}
            embed={embed}
            audio={audio}
            speech={speech}
            submitted={submitted}
          />
        ) : (
          <div
            role="button"
            draggable
            className="c-placeholder-editmode"
            tabIndex={0}
            onKeyPress={this.toggleEdit}
            onClick={this.toggleEdit}>
            {audio.id && <AudioPlayerMounter audio={audio} speech={speech} />}
          </div>
        )}
      </Figure>
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
  submitted: PropTypes.bool.isRequired,
  locale: PropTypes.string,
};

export default SlateAudio;
