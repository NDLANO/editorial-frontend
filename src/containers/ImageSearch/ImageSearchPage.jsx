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

import ImageSearch from './ImageSearch';
import * as actions from './imageActions';

class ImageSearchPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      displayImages: false,
    };
  }

  componentWillMount() {
    const { searchImages } = this.props;
    searchImages();
  }


  render() {
    // const { } = this.props;

    return (
      <div>
        <ImageSearch />
      </div>
    );
  }
}

ImageSearchPage.propTypes = {
  searchImages: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  searchImages: actions.searchImages,
};

export default connect(state => state, mapDispatchToProps)(ImageSearchPage);
