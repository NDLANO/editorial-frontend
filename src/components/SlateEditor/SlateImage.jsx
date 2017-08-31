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
                <img src={src} alt={embed.alt} />
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
          label={t('learningResourceForm.fields.content.figure.caption.image')}
          type="text"
          value={embed.caption}
          onChange={onFigureInputChange}
          placeholder={t(
            'learningResourceForm.fields.content.figure.caption.image',
          )}
          deletedOnSave={deletedOnSave}
        />
        <SlateInputField
          name="alt"
          label={t('learningResourceForm.fields.content.figure.alt')}
          type="text"
          value={embed.alt}
          onChange={onFigureInputChange}
          placeholder={t('learningResourceForm.fields.content.figure.alt')}
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
};

export default injectT(SlateImage);
