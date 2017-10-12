/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Tabs from 'ndla-tabs';

class SearchTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
    };
    this.handleOnSelect = this.handleOnSelect.bind(this);
    this.setIndexTab = this.setIndexTab.bind(this);
  }

  componentWillMount() {
    const { searchTypes, articleType } = this.props;
    const type = articleType || searchTypes;
    this.setIndexTab(type);
  }

  componentWillReceiveProps(nextProps) {
    const { searchTypes } = nextProps;
    if (
      this.state.index !== 0 &&
      searchTypes === undefined &&
      this.props.searchTypes !== undefined
    ) {
      this.setIndexTab(searchTypes);
    }
  }

  setIndexTab(searchTypes) {
    switch (searchTypes) {
      case 'standard':
        this.setState({ index: 0 });
        break;
      case 'topic-article':
        this.setState({ index: 1 });
        break;
      case 'images':
        this.setState({ index: 2 });
        break;
      case 'audios':
        this.setState({ index: 3 });
        break;
      default:
        break;
    }
  }

  handleOnSelect(index, last) {
    const { onSearchTypeChange, onArticleSearchTypeChange } = this.props;
    if (index !== last) {
      this.setState({ index });
      switch (index) {
        case 0:
          onArticleSearchTypeChange('standard');
          break;
        case 1:
          onArticleSearchTypeChange('topic-article');
          break;
        case 2:
          onSearchTypeChange(['images']);
          break;
        case 3:
          onSearchTypeChange(['audios']);
          break;
        default:
          break;
      }
    }
  }

  render() {
    const { index } = this.state;
    const { tabs } = this.props;

    return (
      <Tabs selectedIndex={index} onSelect={this.handleOnSelect} tabs={tabs} />
    );
  }
}

SearchTabs.propTypes = {
  searchTypes: PropTypes.string.isRequired,
  articleType: PropTypes.string,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string,
      content: PropTypes.node,
      disabled: PropTypes.bool,
    }),
  ).isRequired,
  onSearchTypeChange: PropTypes.func.isRequired,
  onArticleSearchTypeChange: PropTypes.func.isRequired,
  searching: PropTypes.bool.isRequired,
};

export default SearchTabs;
