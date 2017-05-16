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
import { Pager } from 'ndla-ui';

import ImageSearchForm from './components/SearchForm';
import ImageSearchResult from './components/ImageSearchResult';
import * as actions from './imageActions';
import {
  getSelectedImage,
  getQueryObject,
  getResults,
  getLastPage,
  getTotalCount,
  getSearching,
} from './imageSelectors';

export function ImageSearch(props) {
  const {
    images,
    // onChange,
    fetchSelectedImage,
    selectedImage,
    lastPage,
    searching,
    searchImages,
    totalCount,
    queryObject,
  } = props;

  const { query, page } = queryObject;

  const onImageClick = (evt, image) => {
    evt.preventDefault();
    if (!selectedImage || image.id !== selectedImage.id) {
      fetchSelectedImage(image.id);
    }
  };
  const submitImageSearchQuery = (q) => {
    searchImages({ query: q, page: 1 });
  };
  // const base = '/image-api/v1/images';

  const onSelectImage = (evt, image) => {
    console.log(image);
    // closeLightBox();
    // const coverPhotoMetaUrl = `${window.config.ndlaApiUrl}${base}/${image.id}`;
    // onChange(coverPhotoMetaUrl);
    // localSetSavedImage(image);
  };

  return (
    <div>
      <ImageSearchForm
        onSearchQuerySubmit={submitImageSearchQuery}
        query={query}
        searching={searching}
        totalCount={totalCount}
      />
      <div className="image-search_list">
        {images.map(image =>
          <ImageSearchResult
            key={image.id}
            image={image}
            onImageClick={onImageClick}
            selectedImage={selectedImage}
            onSelectImage={onSelectImage}
          />,
        )}
      </div>
      <Pager
        page={page ? parseInt(page, 10) : 1}
        pathname=""
        lastPage={lastPage}
        query={queryObject}
        onClick={searchImages}
        pageItemComponentClass="button"
      />
    </div>
  );
}

ImageSearch.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    previewUrl: PropTypes.string.isRequired,
  })),
  // onChange: PropTypes.func.isRequired,
  // imageSearchQuery: PropTypes.object.isRequired,
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


const mapStateToProps = state => ({
  images: getResults(state),
  selectedImage: getSelectedImage(state),
  lastPage: getLastPage(state),
  searching: getSearching(state),
  totalCount: getTotalCount(state),
  queryObject: getQueryObject(state),
});

const mapDispatchToProps = {
  searchImages: actions.searchImages,
  fetchSelectedImage: actions.fetchSelectedImage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageSearch);

