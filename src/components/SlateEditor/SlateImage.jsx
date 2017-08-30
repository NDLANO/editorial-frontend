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
      embedTag,
      figureClass,
      attributes,
      onFigureInputChange,
      deletedOnSave,
      t,
    } = this.props;
    console.log(embedTag);
    const src = `${window.config.ndlaApiUrl}/image-api/raw/id/${embedTag.id}`;
    return (
      <div {...attributes}>
        {this.state.editModus
          ? <ImageEditor
              embedTag={embedTag}
              toggleEditModus={this.toggleEditModus}
              {...this.props}
            />
          : <Button stripped onClick={this.toggleEditModus}>
              <figure {...figureClass}>
                <img src={src} alt={embedTag.alt} />
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
          value={embedTag.caption}
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
          value={embedTag.alt}
          onChange={onFigureInputChange}
          placeholder={t('learningResourceForm.fields.content.figure.alt')}
          deletedOnSave={deletedOnSave}
        />
      </div>
    );
  }
}

SlateImage.propTypes = {
  embedTag: PropTypes.shape({
    caption: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
  }),
  figureClass: PropTypes.object.isRequired,
  onFigureInputChange: PropTypes.func.isRequired,
  attributes: PropTypes.shape({
    'data-key': PropTypes.string.isRequired,
  }),
  deletedOnSave: PropTypes.bool,
};

export default injectT(SlateImage);
