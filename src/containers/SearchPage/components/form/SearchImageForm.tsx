/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation, WithTranslation } from 'react-i18next';
import Button from '@ndla/button';
import { css } from '@emotion/core';
import { RouteComponentProps } from 'react-router-dom';
import { getResourceLanguages } from '../../../../util/resourceHelpers';
import ObjectSelector from '../../../../components/ObjectSelector';
import { searchFormClasses, SearchParams } from './SearchForm';
import { LocationShape, SearchParamsShape } from '../../../../shapes';
import { SubjectType } from '../../../../modules/taxonomy/taxonomyApiInterfaces';

interface Props extends RouteComponentProps {
  search: (o: SearchParams) => void;
  subjects: SubjectType[];
  searchObject: SearchParams;
  locale: string;
}

interface State {
  search: {
    query: string;
    language: string;
    page?: string;
  };
}

class SearchImageForm extends Component<Props & WithTranslation, State> {
  constructor(props: Props & WithTranslation) {
    super(props);

    const { searchObject } = props;

    this.handleSearch = this.handleSearch.bind(this);
    this.emptySearch = this.emptySearch.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);

    this.state = {
      search: {
        query: searchObject.query || '',
        language: searchObject.language || '',
      },
    };
  }

  componentDidUpdate(prevProps: Props & WithTranslation) {
    const { searchObject } = this.props;
    if (prevProps.searchObject?.query !== searchObject?.query) {
      this.setState({
        search: {
          query: searchObject.query || '',
          language: searchObject.language || '',
        },
      });
    }
  }

  onFieldChange(evt: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLSelectElement>) {
    const { value, name } = evt.currentTarget;
    this.setState(
      prevState => ({ search: { ...prevState.search, [name]: value } }),
      this.handleSearch,
    );
  }

  handleSearch(evt?: React.SyntheticEvent) {
    if (evt) {
      evt.preventDefault();
    }
    const { search } = this.props;
    search({ ...this.state.search, page: 1 });
  }

  emptySearch(evt: React.MouseEvent<HTMLButtonElement>) {
    evt.persist();
    this.setState({ search: { query: '', language: '' } }, () => this.handleSearch(evt));
  }

  render() {
    const { t } = this.props;

    return (
      <form onSubmit={this.handleSearch} {...searchFormClasses()}>
        <div {...searchFormClasses('field', '50-width')}>
          <input
            name="query"
            placeholder={t('searchForm.types.imageQuery')}
            value={this.state.search.query}
            onChange={this.onFieldChange}
          />
        </div>
        <div {...searchFormClasses('field', '25-width')}>
          <ObjectSelector
            name="language"
            value={this.state.search.language}
            options={getResourceLanguages(t)}
            idKey="id"
            labelKey="name"
            emptyField
            onChange={this.onFieldChange}
            placeholder={t('searchForm.types.language')}
          />
        </div>
        <div {...searchFormClasses('field', '25-width')}>
          <Button
            css={css`
              margin-right: 1%;
              width: 49%;
            `}
            onClick={this.emptySearch}
            outline>
            {t('searchForm.empty')}
          </Button>
          <Button
            css={css`
              width: 49%;
            `}
            submit>
            {t('searchForm.btn')}
          </Button>
        </div>
      </form>
    );
  }

  static propTypes = {
    search: PropTypes.func.isRequired,
    subjects: PropTypes.array.isRequired,
    location: LocationShape,
    searchObject: SearchParamsShape,
    locale: PropTypes.string.isRequired,
  };

  static defaultProps = {
    searchObject: {
      query: '',
      language: '',
    },
  };
}

export default withTranslation()(SearchImageForm);
