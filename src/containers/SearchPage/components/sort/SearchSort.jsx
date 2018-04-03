/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { searchClasses } from '../../SearchContentPage';

class SearchSort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sort: props.sort,
    };
    this.handleSortChange = this.handleSortChange.bind(this);
  }

  handleSortChange(evt) {
    this.setState({ sort: evt.target.value }, () => {
      this.props.onSortOrderChange(this.state.sort);
    });
  }

  render() {
    const { t } = this.props;
    return (
      <div {...searchClasses('sort-container')}>
        <span {...searchClasses('sort-label')}>Sortering</span>
        <select
          {...searchClasses('filters-select')}
          onChange={this.handleSortChange}
          value={this.state.sort}>
          <option value="-relevance">{t('searchForm.order.relevance')}</option>
        </select>
      </div>
    );
  }
}

SearchSort.propTypes = {
  sort: PropTypes.string.isRequired,
  onSortOrderChange: PropTypes.func.isRequired,
};

SearchSort.defaultProps = {
  sort: '-relevance',
};

export default injectT(SearchSort);
