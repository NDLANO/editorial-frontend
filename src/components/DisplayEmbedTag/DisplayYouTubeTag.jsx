/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';

const DisplayYouTubeTag = ({ embedTag, className }) =>
  <figure className={className}>
    <iframe
      style={{
        border: 'none',
        minHeight: '200px',
        minWidth: '200px',
        marginRight: '56px',
      }}
      title={embedTag.metaData.title}
      src={embedTag.metaData.pagemap.videoobject[0].embedurl}
      allowFullScreen
    />
    <figcaption>
      {embedTag.caption}
    </figcaption>
  </figure>;

DisplayYouTubeTag.propTypes = {
  embedTag: PropTypes.shape({
    title: PropTypes.string,
    metaData: PropTypes.shape({}).isRequired,
    caption: PropTypes.string,
  }).isRequired,
  className: PropTypes.string,
};

export default DisplayYouTubeTag;
