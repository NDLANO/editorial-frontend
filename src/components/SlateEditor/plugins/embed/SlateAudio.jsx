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
import BEMHelper from 'react-bem-helper';
import SlateInputField from './SlateInputField';
import * as visualElementApi from '../../../../containers/VisualElement/visualElementApi';
import { EmbedShape } from '../../../../shapes';

import EditAudio from './EditAudio';
import AudioPlayerMounter from './AudioPlayerMounter';

const classes = new BEMHelper({
  name: 'audio-box',
  prefix: 'c-',
});

class SlateAudio extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editMode: false, audio: {} };
    this.toggleEdit = this.toggleEdit.bind(this);
    this.onAudioFigureInputChange = this.onAudioFigureInputChange.bind(this);
  }

  async componentWillMount() {
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
          <div {...classes()}>
            <EditAudio
              onExit={this.toggleEdit}
              audioType={embed.audioType || 'sound'}
              onChange={onFigureInputChange}
              embed={embed}
              {...rest}>
              {player}
            </EditAudio>
            <SlateInputField
              name="caption"
              label={t('form.audio.caption.label')}
              type="text"
              value={embed.caption}
              onChange={this.onAudioFigureInputChange}
              placeholder={t('form.audio.caption.placeholder')}
              submitted={submitted}
            />
          </div>
        ) : (
          <div
            role="button"
            style={{ cursor: 'pointer' }}
            tabIndex={0}
            onKeyPress={this.toggleEdit}
            onClick={this.toggleEdit}>
            {player}
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
};

export default injectT(SlateAudio);
