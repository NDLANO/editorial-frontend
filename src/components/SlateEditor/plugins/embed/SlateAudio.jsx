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
import { Button, Figure } from 'ndla-ui';
import { Cross } from 'ndla-icons/action';
import * as visualElementApi from '../../../../containers/VisualElement/visualElementApi';
import { EmbedShape } from '../../../../shapes';
import { editorClasses } from './SlateFigure';
import AudioPlayerMounter from './AudioPlayerMounter';

class SlateAudio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentWillMount() {
    try {
      const audio = await visualElementApi.fetchAudio(
        this.props.embed.resource_id,
      );
      this.setState({ audio });
    } catch (error) {
      visualElementApi.onError(error);
    }
  }

  render() {
    const { attributes, onRemoveClick } = this.props;
    const { audio = {} } = this.state;
    return (
      <Figure id={`${audio.id}`} {...attributes}>
        <Button
          onClick={onRemoveClick}
          stripped
          {...editorClasses('delete-button')}>
          <Cross />
        </Button>
        {audio.id && <AudioPlayerMounter audio={audio} />}
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
};

export default injectT(SlateAudio);
