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
import ForbiddenOverlay from '../ForbiddenOverlay';

const DisplayImageTag = ({ embedTag, className, deletedOnSave, t }) => {
  if (!embedTag || !embedTag.id) {
    return null;
  }
  const src = `${window.config.ndlaApiUrl}/image-api/raw/id/${embedTag.id}`;
  return (
    <figure className={className}>
      <img src={src} alt={embedTag.alt} />
      <figcaption>
        {embedTag.caption}
      </figcaption>
      {deletedOnSave &&
        <ForbiddenOverlay
          text={t('topicArticleForm.fields.content.deleteEmbedOnSave')}
        />}
    </figure>
  );
};

DisplayImageTag.propTypes = {
  embedTag: PropTypes.shape({
    caption: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
  }),
  className: PropTypes.string,
  deletedOnSave: PropTypes.bool,
};

export default injectT(DisplayImageTag);
