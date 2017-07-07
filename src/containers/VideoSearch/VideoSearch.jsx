/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const VideoSearch = props => (
    <div>
      <p>Heisann du</p>
    </div>
  );

VideoSearch.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      previewUrl: PropTypes.string.isRequired,
    }),
  ),
  onChange: PropTypes.func.isRequired,
  queryObject: PropTypes.shape({
    page: PropTypes.number.isRequired,
    query: PropTypes.string.isRequired,
  }).isRequired,
  fetchSelectedImage: PropTypes.func.isRequired,
  searching: PropTypes.bool.isRequired,
  selectedImage: PropTypes.object,
  lastPage: PropTypes.number.isRequired,
  totalCount: PropTypes.number,
  searchImages: PropTypes.func.isRequired,
};


export default VideoSearch;
