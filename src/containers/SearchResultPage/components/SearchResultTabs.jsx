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

class SearchResultTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: this.props.tabIndex,
    };
    this.handleOnSelect = this.handleOnSelect.bind(this);
  }

  handleOnSelect(index, last) {
    const { onSearchTypeChange } = this.props;
    if (index !== last) {
      switch (index) {
        case 0:
          onSearchTypeChange(undefined);
          this.setState({ selectedIndex: 0 });
          break;
        case 1:
          onSearchTypeChange('standard');
          this.setState({ selectedIndex: 1 });
          break;
        case 2:
          onSearchTypeChange('topic-article');
          this.setState({ selectedIndex: 2 });
          break;
        default:
          break;
      }
    }
  }

  render() {
    const { selectedIndex } = this.state;
    const { t, tabContent } = this.props;

    return (
      <Tabs
        selectedIndex={selectedIndex}
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

SearchResultTabs.propTypes = {
  tabIndex: PropTypes.number.isRequired,
  tabContent: PropTypes.node.isRequired,
  onSearchTypeChange: PropTypes.func.isRequired,
};

export default injectT(SearchResultTabs);
