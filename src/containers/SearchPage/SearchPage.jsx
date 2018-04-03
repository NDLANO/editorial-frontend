/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { injectT } from 'ndla-i18n';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { OneColumn, Pager, Hero } from 'ndla-ui';
import BEMHelper from 'react-bem-helper';
import * as actions from '../../modules/search/search';
import { SearchResultShape } from '../../shapes';
import {
  getResults,
  getLastPage,
  getSearching,
} from '../../modules/search/searchSelectors';
import { getLocale } from '../../modules/locale/locale';
import SearchList from './components/SearchList';
import SearchTabs from './components/SearchTabs';
import { toSearch } from '../../util/routeHelpers';

export const searchClasses = new BEMHelper({
  name: 'search-results',
  prefix: 'c-',
});

class SearchPage extends Component {
  constructor() {
    super();
    this.onSearchTypeChange = this.onSearchTypeChange.bind(this);
    this.onArticleSearchTypeChange = this.onArticleSearchTypeChange.bind(this);
    this.onSortOrderChange = this.onSortOrderChange.bind(this);
    this.onQueryPush = this.onQueryPush.bind(this);
  }

  componentWillMount() {
    const { location, search } = this.props;
    if (location.search) {
      search(location.search);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { location, search } = nextProps;
    if (location.search && location.search !== this.props.location.search) {
      search(location.search);
    }
  }

  onQueryPush(newQuery) {
    const { history, location } = this.props;
    const oldQuery = queryString.parse(location.search);
    history.push(toSearch({ ...oldQuery, ...newQuery }));
  }

  onSearchTypeChange(types) {
    this.onQueryPush({
      page: 1,
      articleTypes: undefined,
      types: types.join(','),
    });
  }

  onSortOrderChange(sort) {
    this.onQueryPush({ sort, page: 1 });
  }

  onArticleSearchTypeChange(articleTypes) {
    this.onQueryPush({ page: 1, types: 'articles', articleTypes });
  }

  render() {
    const {
      t,
      location,
      results,
      locale,
      lastPage,
      enabledSources,
      searching,
    } = this.props;
    const query = queryString.parse(location.search);
    const enabledTabs = enabledSources.map(source => ({
      title: t(`searchForm.articleType.${source}`),
      content: <SearchList query={query} locale={locale} results={results} />,
      disabled: searching,
    }));

    return (
      <div>
        <Hero contentType="subject" />
        <OneColumn>
          <div {...searchClasses()}>
            <SearchTabs
              searchTypes={query.types}
              articleType={query.articleTypes}
              tabs={enabledTabs}
              onSearchTypeChange={this.onSearchTypeChange}
              onArticleSearchTypeChange={this.onArticleSearchTypeChange}
              searching={searching}
            />
            <Pager
              page={query.page ? parseInt(query.page, 10) : 1}
              lastPage={lastPage}
              query={query}
              pathname={toSearch()}
            />
          </div>
        </OneColumn>
      </div>
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
  results: PropTypes.arrayOf(SearchResultShape).isRequired,
  searching: PropTypes.bool.isRequired,
  search: PropTypes.func.isRequired,
  enabledSources: PropTypes.arrayOf(PropTypes.string),
};

SearchPage.defaultProps = {
  enabledSources: ['all', 'learningResource', 'topicArticle', 'image', 'audio'],
};

const mapDispatchToProps = {
  search: actions.search,
};

const mapStateToProps = (state, ownProps) => ({
  locale: getLocale(state),
  results: getResults(state, queryString.parse(ownProps.location.search).types),
  lastPage: getLastPage(state),
  searching: getSearching(state),
});

export default compose(connect(mapStateToProps, mapDispatchToProps), injectT)(
  SearchPage,
);
