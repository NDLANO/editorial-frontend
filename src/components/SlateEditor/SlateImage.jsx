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
import SlateInputField from './SlateInputField';

const SlateImage = props => {
  const { embedTag, figureClass, attributes, onFigureInputChange, t } = props;

  if (!embedTag || !embedTag.id) {
    return null;
  }

  const src = `${window.config.ndlaApiUrl}/image-api/raw/id/${embedTag.id}`;
  return (
    <div {...attributes}>
      <figure {...figureClass}>
        <img src={src} alt={embedTag.alt} />
      </figure>
      <SlateInputField
        name="caption"
        label={t('learningResourceForm.fields.content.figure.caption.image')}
        type="text"
        value={embedTag.caption}
        onChange={onFigureInputChange}
        placeholder={t(
          'learningResourceForm.fields.content.figure.caption.image',
        )}
      />
      <SlateInputField
        name="alt"
        label={t('learningResourceForm.fields.content.figure.alt')}
        type="text"
        value={embedTag.alt}
        onChange={onFigureInputChange}
        placeholder={t('learningResourceForm.fields.content.figure.alt')}
      />
    </div>
  );
};

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
};

export default injectT(SlateImage);
