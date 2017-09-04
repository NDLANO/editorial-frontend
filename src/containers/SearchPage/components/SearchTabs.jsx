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
import { injectT } from 'ndla-i18n';

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
    const { searchTypes } = this.props;
    this.setIndexTab(searchTypes);
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
      case undefined:
        this.setState({ index: 0 });
        break;
      case 'standard':
        this.setState({ index: 1 });
        break;
      case 'topic-article':
        this.setState({ index: 2 });
        break;
      default:
        break;
    }
  }

  handleOnSelect(index, last) {
    const { onSearchTypeChange } = this.props;
    if (index !== last) {
      switch (index) {
        case 0:
          onSearchTypeChange(undefined);
          this.setState({ index });
          break;
        case 1:
          onSearchTypeChange('standard');
          this.setState({ index });
          break;
        case 2:
          onSearchTypeChange('topic-article');
          this.setState({ index });
          break;
        default:
          break;
      }
    }
  }

  render() {
    const { index } = this.state;
    const { t, tabContent } = this.props;

    return (
      <Tabs
        selectedIndex={index}
        onSelect={this.handleOnSelect}
        tabs={[
          {
            title: t('searchForm.articleType.all'),
            content: tabContent,
          },
          {
            title: t('searchForm.articleType.learningResource'),
            content: tabContent,
          },
          {
            title: t('searchForm.articleType.topicArticle'),
            content: tabContent,
          },
        ]}
      />
    );
  }
}

SearchTabs.propTypes = {
  searchTypes: PropTypes.string,
  tabContent: PropTypes.node.isRequired,
  onSearchTypeChange: PropTypes.func.isRequired,
};

export default injectT(SearchTabs);
