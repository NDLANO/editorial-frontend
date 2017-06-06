/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '../../../i18n';

class SelectArticleType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articleType: props.articleType,
    };
    this.handleArticleTypeChange = this.handleArticleTypeChange.bind(this);
  }

  handleArticleTypeChange(evt) {
    this.setState({ articleType: evt.target.value }, () => {
      if (this.state.articleType === 'all') {
        this.props.onArticleTypeChange(undefined);
      } else {
        this.props.onArticleTypeChange(this.state.articleType);
      }
    });
  }

  render() {
    const { t } = this.props;
    return (
      <select
        className="search-filters__select"
        onChange={this.handleArticleTypeChange}
        value={this.state.articleType}>
        <option value="all">{t('searchForm.articleType.all')}</option>
        <option value="standard">{t('searchForm.articleType.standard')}</option>
        <option value="topic-article">
          {t('searchForm.articleType.topicArticle')}
        </option>
      </select>
    );
  }
}

SelectArticleType.propTypes = {
  articleType: PropTypes.string.isRequired,
  onArticleTypeChange: PropTypes.func.isRequired,
};

SelectArticleType.defaultProps = {
  articleType: 'all',
};

export default injectT(SelectArticleType);
