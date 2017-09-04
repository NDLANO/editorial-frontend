/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { OneColumn, Pager } from 'ndla-ui';

import * as actions from './searchActions';
import { ArticleResultShape } from '../../shapes';
import { getResults, getLastPage, getSearching } from './searchSelectors';
import { getLocale } from '../../modules/locale/locale';
import SelectSearchSortOrder from './components/SelectSearchSortOrder';
import SearchList from './components/SearchList';
import SearchTabs from './components/SearchTabs';
import { toSearch } from '../../util/routeHelpers';

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTypes: undefined,
    };
  }
  componentWillMount() {
    const { location, search } = this.props;
    if (location.search) {
      search(location.search);
      const query = queryString.parse(location.search);
      this.setState({ searchTypes: query.articleTypes });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { location, search } = nextProps;
    if (location.search && location.search !== this.props.location.search) {
      search(location.search);
      const query = queryString.parse(location.search);
      this.setState({ searchTypes: query.articleTypes });
    }
  }

  render() {
    const { searchTypes } = this.state;
    const { location, results, locale, lastPage, history } = this.props;
    const query = queryString.parse(location.search);

    return (
      <OneColumn cssModifier="clear">
        <div className="search-result-filter">
          <SelectSearchSortOrder
            sort={query.sort}
            onSortOrderChange={sort =>
              history.push(toSearch({ ...query, sort, page: 1 }))}
          />
        </div>
        <SearchTabs
          searchTypes={searchTypes}
          tabContent={
            <SearchList query={query} locale={locale} results={results} />
          }
          onSearchTypeChange={articleTypes =>
            history.push(toSearch({ ...query, page: 1, articleTypes }))}
        />

        <Pager
          page={query.page ? parseInt(query.page, 10) : 1}
          lastPage={lastPage}
          query={query}
          pathname={toSearch()}
        />
      </OneColumn>
    );
  }
}

SearchPage.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  lastPage: PropTypes.number.isRequired,
  results: PropTypes.arrayOf(ArticleResultShape).isRequired,
  searchTypes: PropTypes.string,
  searching: PropTypes.bool.isRequired,
  search: PropTypes.func.isRequired,
};

const mapDispatchToProps = {
  search: actions.search,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
  results: getResults(state),
  lastPage: getLastPage(state),
  searching: getSearching(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage);
