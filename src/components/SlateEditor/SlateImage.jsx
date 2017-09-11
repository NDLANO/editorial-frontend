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
import SlateInputField from './SlateInputField';
import ForbiddenOverlay from '../ForbiddenOverlay';
import ImageEditor from '../../containers/ImageEditor/ImageEditor';
import { EmbedShape } from '../../shapes';

const getSrcSets = embed => {
  const src = `${window.config
    .ndlaApiUrl}/image-api/raw/id/${embed.resource_id}`;
  const cropString = `cropStartX=${embed['upper-left-x']}&cropStartY=${embed[
    'upper-left-y'
  ]}&cropEndX=${embed['lower-right-x']}&cropEndY=${embed['lower-right-y']}`;
  const focalString = `focalX=${embed['focal-x']}&focalY=${embed['focal-y']}`;
  return [
    `${src}?width=1440&${cropString}&${focalString} 1440w`,
    `${src}?width=1120&${cropString}&${focalString} 1120w`,
    `${src}?width=1000&${cropString}&${focalString} 1000w`,
    `${src}?width=960&${cropString}&${focalString} 960w`,
    `${src}?width=800&${cropString}&${focalString} 800w`,
    `${src}?width=640&${cropString}&${focalString} 640w`,
    `${src}?width=480&${cropString}&${focalString} 480w`,
    `${src}?width=320&${cropString}&${focalString} 320w`,
    `${src}?width=320&${cropString}&${focalString} 320w`,
  ].join(', ');
};

class SlateImage extends React.Component {
  constructor() {
    super();
    this.state = {
      editModus: false,
    };
    this.toggleEditModus = this.toggleEditModus.bind(this);
  }

  toggleEditModus() {
    this.setState(prevState => ({
      editModus: !prevState.editModus,
    }));
  }

  render() {
    const {
      embed,
      figureClass,
      attributes,
      onFigureInputChange,
      deletedOnSave,
      submitted,
      t,
    } = this.props;
    const src = `${window.config
      .ndlaApiUrl}/image-api/raw/id/${embed.resource_id}`;
    return (
      <div {...attributes}>
        {this.state.editModus
          ? <ImageEditor
              embedTag={embed}
              toggleEditModus={this.toggleEditModus}
              {...this.props}
            />
          : <Button stripped onClick={this.toggleEditModus}>
              <figure {...figureClass}>
                <img src={src} alt={embed.alt} srcSet={getSrcSets(embed)} />
                {deletedOnSave &&
                  <ForbiddenOverlay
                    text={t(
                      'topicArticleForm.fields.content.deleteEmbedOnSave',
                    )}
                  />}
              </figure>
            </Button>}
        <SlateInputField
          name="caption"
          label={t('form.image.caption.label')}
          type="text"
          value={embed.caption}
          required
          onChange={onFigureInputChange}
          placeholder={t('form.image.caption.placeholder')}
          submitted={submitted}
          deletedOnSave={deletedOnSave}
        />
        <SlateInputField
          name="alt"
          label={t('form.image.alt.label')}
          type="text"
          required
          value={embed.alt}
          onChange={onFigureInputChange}
          placeholder={t('form.image.alt.placeholder')}
          submitted={submitted}
          deletedOnSave={deletedOnSave}
        />
      </div>
    );
  }
}

SlateImage.propTypes = {
  embed: EmbedShape.isRequired,
  figureClass: PropTypes.object.isRequired,
  onFigureInputChange: PropTypes.func.isRequired,
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  deletedOnSave: PropTypes.bool,
  submitted: PropTypes.bool.isRequired,
};

export default injectT(SlateImage);
