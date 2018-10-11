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
import Button from 'ndla-button';
import { getResourceLanguages } from '../../../../util/resourceHelpers';
import ObjectSelector from '../../../../components/ObjectSelector';

import { searchFormClasses } from './SearchForm';

class SearchMediaForm extends Component {
  constructor(props) {
    super(props);

    const { searchObject } = props;

    this.handleSearch = this.handleSearch.bind(this);
    this.emptySearch = this.emptySearch.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);

    this.state = {
      search: {
        query: searchObject.query || '',
        language: searchObject.language || '',
        types: 'images,audios',
      },
    };
  }

  onFieldChange(evt) {
    const { value, name } = evt.target;
    this.setState(
      prevState => ({ search: { ...prevState.search, [name]: value } }),
      this.handleSearch,
    );
  }

  handleSearch(evt) {
    if (evt) {
      evt.preventDefault();
    }
    const { search } = this.props;
    search({ ...this.state.search, page: 1 });
  }

  emptySearch(evt) {
    this.setState(
      { search: { query: '', language: '', types: 'images,audios' } },
      () => this.handleSearch(evt),
    );
  }

  render() {
    const { t } = this.props;

    return (
      <form onSubmit={this.handleSearch} {...searchFormClasses()}>
        <div {...searchFormClasses('field', '50-width')}>
          <input
            name="query"
            placeholder={t('searchForm.types.mediaQuery')}
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
            onBlur={this.onFieldChange}
            placeholder={t('searchForm.types.language')}
          />
        </div>
        <div {...searchFormClasses('field', '25-width')}>
          <Button onClick={this.emptySearch} outline>
            {t('searchForm.empty')}
          </Button>
          <Button submit>{t('searchForm.btn')}</Button>
        </div>
      </form>
    );
  }
}

SearchMediaForm.propTypes = {
  search: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
  searchObject: PropTypes.shape({
    query: PropTypes.string,
    language: PropTypes.string,
  }),
};

SearchMediaForm.defaultProps = {
  searchObject: {
    query: '',
    language: '',
  },
};

export default injectT(SearchMediaForm);
