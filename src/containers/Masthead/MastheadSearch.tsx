/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import queryString from 'query-string';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import MastheadSearchForm from './components/MastheadSearchForm';
import { toSearch } from '../../util/routeHelpers';
import { SearchTypeValues } from '../../constants';
import { parseSearchParams } from '../SearchPage/components/form/SearchForm';
import { SearchType } from '../../interfaces';

interface Props extends RouteComponentProps {
  close: () => void;
}

interface State {
  query?: string;
}

class MastheadSearch extends Component<Props, State> {
  static getDerivedStateFromProps(props: Props, state: State) {
    const { location } = props;
    const { query } = state;
    const propsQuery = queryString.parse(location.search).query;
    if (query !== propsQuery) {
      return { query: propsQuery };
    }
    return null;
  }

  constructor(props: Props) {
    super(props);
    this.state = {
      query: undefined,
    };
  }

  onSearchQuerySubmit = (searchQuery: string) => {
    const { location, history, close } = this.props;

    const type =
      location.pathname
        .split('/')
        .find(pathValue => SearchTypeValues.includes(pathValue as SearchType)) || 'content';

    let oldParams;
    if (type === 'content') {
      oldParams = parseSearchParams(location.search);
    } else {
      oldParams = queryString.parse(location.search);
    }

    const newParams = {
      ...oldParams,
      query: searchQuery || undefined,
      page: 1,
      sort: '-lastUpdated',
      'page-size': 10,
    };

    history.push(toSearch(newParams, type));

    close();
  };

  render() {
    return (
      <MastheadSearchForm
        query={this.state.query}
        onSearchQuerySubmit={searchQuery => this.onSearchQuerySubmit(searchQuery)}
      />
    );
  }
}

export default withRouter(MastheadSearch);
