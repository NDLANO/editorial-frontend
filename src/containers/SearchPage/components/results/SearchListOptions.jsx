/*
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { searchClasses } from '../../SearchContainer';

const pageSizeOptions = [4, 6, 8, 10, 12, 14, 16, 18, 20];

class SearchListOptions extends React.Component {
  constructor(props) {
    super(props);
    const { searchObject } = props;
    this.state = { pageSize: searchObject['page-size'] || 10 };
    this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
  }

  handlePageSizeChange(evt) {
    this.setState({ pageSize: evt.target.value });
    this.props.search(
      { 'page-size': evt.target.value, page: 1 },
      this.props.type,
    );
  }

  render() {
    const { totalCount, t } = this.props;

    return (
      <div {...searchClasses('options-container')}>
        <div {...searchClasses('option')}>
          <span>
            {t('searchPage.totalCount')}: <b>{totalCount}</b>
          </span>
          <select
            onChange={this.handlePageSizeChange}
            value={this.state.pageSize}>
            {pageSizeOptions.map(size => (
              <option key={`pageSize_${size}`} value={size}>
                {t('searchPage.pageSize', { pageSize: size })}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}

SearchListOptions.propTypes = {
  totalCount: PropTypes.number,
  type: PropTypes.string.isRequired,
  searchObject: PropTypes.shape({
    pageSize: PropTypes.number,
  }),
  search: PropTypes.func.isRequired,
};

SearchListOptions.defaultProps = {
  searchObject: {
    pageSize: 10,
  },
};

export default injectT(SearchListOptions);
