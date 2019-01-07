/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import queryString from 'query-string';
import { searchClasses } from '../../SearchContainer';

class SearchSort extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sort: props.sort,
      order: props.order,
    };
    this.handleSortChange = this.handleSortChange.bind(this);
    this.handleOrderChange = this.handleOrderChange.bind(this);
  }

  UNSAFE_componentWillMount() {
    const { location } = this.props;
    const { sort: sortOrder } = queryString.parse(location.search);
    const splitSortOrder = sortOrder.split('-');
    const sort =
      splitSortOrder.length > 1 ? splitSortOrder[1] : splitSortOrder[0];
    const order = splitSortOrder.length > 1 ? 'desc' : 'asc';
    this.setState({ sort, order });
  }

  handleSortChange(evt) {
    const order = this.state.order === 'desc' ? '-' : '';
    const sort = evt.target.value;
    this.setState({ sort }, () => {
      this.props.onSortOrderChange(`${order + sort}`);
    });
  }

  handleOrderChange(evt) {
    let order;
    if (evt.target.value === 'desc') {
      order = '-';
    } else {
      order = '';
    }
    this.setState({ order: evt.target.value }, () => {
      this.props.onSortOrderChange(`${order + this.state.sort}`);
    });
  }

  render() {
    const { t } = this.props;
    const sortOptions = ['id', 'relevance', 'title', 'lastUpdated'];
    const orderOptions = ['desc', 'asc'];

    return (
      <div {...searchClasses('sort-container')}>
        <span {...searchClasses('sort-label')}>{t('searchForm.sorting')}</span>
        <select
          {...searchClasses('filters-select')}
          onChange={this.handleSortChange}
          value={this.state.sort}>
          {sortOptions.map(option => (
            <option key={`sortoptions_${option}`} value={option}>
              {t(`searchForm.sort.${option}`)}
            </option>
          ))}
        </select>
        <span {...searchClasses('sort-label')}>{t('searchForm.order')}</span>
        <select
          {...searchClasses('filters-select')}
          onChange={this.handleOrderChange}
          value={this.state.order}>
          {orderOptions.map(option => (
            <option key={`orderoptions_${option}`} value={option}>
              {t(`searchForm.${option}`)}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

SearchSort.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  sort: PropTypes.string,
  order: PropTypes.string,
  onSortOrderChange: PropTypes.func.isRequired,
};

SearchSort.defaultProps = {
  sort: 'relevance',
  order: 'desc',
};

export default injectT(SearchSort);
