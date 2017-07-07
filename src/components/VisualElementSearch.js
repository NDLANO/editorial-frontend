/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import ImageSearch from '../containers/ImageSearch/ImageSearch';
import VideoSearch from '../containers/VideoSearch/VideoSearch';

const titles = {
  video: 'Videosøk',
  image: 'Bildesøk'
}

const VisualElementSearch = ({embedTag, handleVisualElementChange}) => {
  const searchContainer = () => {
    if (embedTag.resource === 'image') {
      return <ImageSearch onChange={handleVisualElementChange} />
    }
    return <VideoSearch onChange={handleVisualElementChange} />
  };

  return(
    <div>
      <h2>{titles[embedTag.resource]}</h2>
      {searchContainer()}
    </div>
  );
}

VisualElementSearch.propTypes = {
  embedTag: PropTypes.shape({
    caption: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
  }),
  handleVisualElementChange: PropTypes.func.isRequired,
};


export default VisualElementSearch;
