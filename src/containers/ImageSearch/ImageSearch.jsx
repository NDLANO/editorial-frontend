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
import ImageSearchForm from './components/SearchForm';
import ImageSearchResult from './ImageSearchResult';
// import ButtonPager from '../common/pager/ButtonPager';
import * as actions from './imageActions';
import {
  // getSelectedImage,
  getQuery, getResults, getLastPage, getTotalCount, getSearching } from './imageSelectors';

export function ImageSearch(props) {
  const {
    images,
    // onChange,
    // imageSearchQuery,
    // localChangeImageSearchQuery,
    // fetchImage,
    // selectedImage,
    // lastPage,
    searching,
    searchImages,
    totalCount,
    query,
    // localSetSavedImage,
  } = props;

  const onImageClick = (evt, image) => {
    evt.preventDefault();
    console.log(image);
  //   if (image.id !== selectedImage.id) {
  //     fetchImage(image.id);
    // }
  };
  const submitImageSearchQuery = (q) => {
    searchImages({ query: q, page: 1 });
  //   evt.preventDefault();
  //   localFetchImages(q, false);
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
      <div>
        {images.map(image =>
          <ImageSearchResult
            key={image.id}
            image={image}
            onImageClick={onImageClick}
            selectedImage={image}
            onSelectImage={onSelectImage}
          />,
        )}
      </div>
      {/* <ButtonPager page={imageSearchQuery.page} lastPage={lastPage} query={imageSearchQuery} pagerAction={localFetchImages} />*/}
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
  query: PropTypes.string,
  // localChangeImageSearchQuery: PropTypes.func.isRequired,
  searching: PropTypes.bool.isRequired,
  // selectedImage: PropTypes.object,
  lastPage: PropTypes.number.isRequired,
  totalCount: PropTypes.number,
  searchImages: PropTypes.func.isRequired,
};


const mapStateToProps = state => Object.assign({}, state, {
  images: getResults(state),
  // selectedImage: getSelectedImage(state),
  lastPage: getLastPage(state),
  searching: getSearching(state),
  totalCount: getTotalCount(state),
  query: getQuery(state),
});

const mapDispatchToProps = {
  searchImages: actions.searchImages,
};

export default connect(mapStateToProps, mapDispatchToProps)(ImageSearch);

