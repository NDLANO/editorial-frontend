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
import { Button } from 'ndla-ui';
import { Cross } from 'ndla-icons/action';
import * as visualElementApi from '../../../../containers/VisualElement/visualElementApi';
import { EmbedShape } from '../../../../shapes';
import { editorClasses } from './SlateFigure';

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
    const { embed, figureClass, attributes, onRemoveClick } = this.props;
    const { audio } = this.state;
    return (
      <figure {...figureClass} {...attributes}>
        <Button
          onClick={onRemoveClick}
          stripped
          {...editorClasses('delete-button')}>
          <Cross />
        </Button>
        <audio controls>
          {audio && audio.audioFile.url ? (
            <source src={audio.audioFile.url} type={audio.audioFile.mimeType} />
          ) : (
            undefined
          )}
          <track kind="captions" label={embed.title} />
        </audio>
        <figcaption>{audio && audio.title.title}</figcaption>
      </figure>
    );
  }
}

SlateAudio.propTypes = {
  embed: EmbedShape.isRequired,
  figureClass: PropTypes.object.isRequired,
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  onRemoveClick: PropTypes.func.isRequired,
};

export default injectT(SlateAudio);
