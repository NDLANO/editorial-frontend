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
import SlateInputField from './SlateInputField';
import * as visualElementApi from '../../../../containers/VisualElement/visualElementApi';
import { EmbedShape } from '../../../../shapes';

import EditAudio from './EditAudio';
import AudioPlayerMounter from './AudioPlayerMounter';

class SlateAudio extends React.Component {
  constructor(props) {
    super(props);
    this.state = { audio: {} };
    this.toggleEdit = this.toggleEdit.bind(this);
    this.onAudioFigureInputChange = this.onAudioFigureInputChange.bind(this);
  }

  async componentWillMount() {
    try {
      const audio = await visualElementApi.fetchAudio(
        this.props.embed.resource_id,
      );
      this.setState({
        audio: {
          ...audio,
          title: audio.title.title,
          caption: this.props.embed.caption,
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
      t,
      ...rest
    } = this.props;
    const { audio } = this.state;

    const player = audio.id && (
      <AudioPlayerMounter audio={audio} speech={embed.audioType === 'speech'} />
    );

    return (
      <Figure id={`${audio.id}`} {...attributes}>
        {this.state.editMode ? (
          <EditAudio
            onExit={() => this.setState({ editMode: false })}
            audioType={embed.audioType || 'sound'}
            onChange={onFigureInputChange}
            embed={embed}
            t={t}
            {...rest}>
            {player}
          </EditAudio>
        ) : (
          <div
            role="button"
            style={{ cursor: 'pointer' }}
            tabIndex={0}
            onKeyPress={() => this.setState({ editMode: true })}
            onClick={() => this.setState({ editMode: true })}>
            {player}
          </div>
        )}
        <SlateInputField
          name="caption"
          label={t('form.audio.caption.label')}
          type="text"
          required
          value={embed.caption}
          onChange={this.onAudioFigureInputChange}
          placeholder={t('form.audio.caption.placeholder')}
          submitted={submitted}
        />
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
};

export default injectT(SlateAudio);
