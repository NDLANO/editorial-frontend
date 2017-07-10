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
import * as api from './videoApi';

class VideoSearch extends React.Component {

  constructor() {
    super();
    this.state = {
      queryObject: {
        query: undefined,
        page: 1,
        pageSize: 16,
      },
      images: [],
      selectedImage: undefined,
      lastPage: 0,
      totalCount: 0,
      searching: false,
    };
  }
  componentDidMount() {
    this.submitImageSearchQuery(this.state.queryObject);
  }

  onImageClick(image) {
    if (!this.state.selectedImage || image.id !== this.state.selectedImage.id) {
      api.fetchImage(image.id, this.props.ndlaClient).then((result) => {
        this.setState({ selectedImage: result });
      });
    }
  }

  onSelectImage(image) {
    this.setState({ selectedImage: undefined });
    this.props.onImageSelect(image);
  }
  submitImageSearchQuery(queryObject) {
    this.searchImages({ ...queryObject, page: 1 });
  }

  changeQueryPage(queryObject) {
    this.searchImages(queryObject);
  }

  searchImages(queryObject) {
    this.setState({ searching: true });
    api.search(queryObject.query, queryObject.page, this.props.locale, this.props.ndlaClient).then((result) => {
      this.setState({
        queryObject: {
          query: queryObject.query,
          pageSize: result.pageSize,
          page: queryObject.page,
        },
        images: result.results,
        totalCount: result.totalCount,
        lastPage: result.totalCount / result.pageSize,
        searching: false,
      });
    }).catch(() => {
      this.setState({ searching: false });
    });
  }
  render() {
    const {
      images,
      onChange,
      fetchSelectedImage,
      selectedImage,
      lastPage,
      searching,
      searchImages,
      totalCount,
      queryObject,
    } = this.props;

    const { query, page } = queryObject;

    const onImageClick = image => {
      if (!selectedImage || image.id !== selectedImage.id) {
        fetchSelectedImage(image.id);
      }
    };
    const submitImageSearchQuery = q => {
      searchImages({ query: q, page: 1 });
    };

    const handleSelectImage = image => {
      onChange(image);
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
              onSelectImage={handleSelectImage}
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
  };
}

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
