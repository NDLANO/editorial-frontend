/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import Button from '@ndla/button';
import { css } from '@emotion/core';
import { getResourceLanguages } from '../../../../util/resourceHelpers';
import ObjectSelector from '../../../../components/ObjectSelector';
import SearchTagGroup from './SearchTagGroup';
import { searchFormClasses } from './SearchForm';
import { LocationShape } from '../../../../shapes';

const emptySearchState = {
  query: '',
  subjects: '',
  language: '',
};

class SearchConceptForm extends Component {
  constructor(props) {
    super(props);
    const { searchObject } = props;
    this.state = {
      search: {
        subjects: searchObject.subjects || '',
        query: searchObject.query || '',
        language: searchObject.language || '',
        types: 'concept',
      },
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.removeTagItem = this.removeTagItem.bind(this);
    this.emptySearch = this.emptySearch.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
  }

  onFieldChange = evt => {
    const { value, name } = evt.target;
    this.setState(
      prevState => ({ search: { ...prevState.search, [name]: value } }),
      this.handleSearch,
    );
  };

  handleSearch = evt => {
    if (evt) {
      evt.preventDefault();
      evt.stopPropagation();
    }
    const { search } = this.props;
    search({ ...this.state.search, page: 1 });
  };

  removeTagItem(tag) {
    this.setState(
      prevState => ({ search: { ...prevState.search, [tag.type]: '' } }),
      this.handleSearch,
    );
  }

  emptySearch() {
    this.setState({ search: emptySearchState }, this.handleSearch);
  }

  sortByProperty(property) {
    return function(a, b) {
      return a[property]?.localeCompare(b[property]);
    };
  }

  render() {
    const { t, subjects } = this.props;
    const { search } = this.state;

    return (
      <form onSubmit={this.handleSearch} {...searchFormClasses()}>
        <div {...searchFormClasses('field', '25-width')}>
          <input
            name="query"
            placeholder={t('searchForm.types.conceptQuery')}
            value={search.query}
            onChange={this.onFieldChange}
          />
        </div>
        <div
          key={`searchfield_subjects`}
          {...searchFormClasses('field', `25-width`)}>
          <ObjectSelector
            name={'subjects'}
            options={subjects.sort(this.sortByProperty('name'))}
            idKey="id"
            value={this.state.search['subjects']}
            labelKey="name"
            emptyField
            placeholder={t(`searchForm.types.subjects`)}
            onChange={this.onFieldChange}
          />
        </div>
        <div {...searchFormClasses('field', '25-width')}>
          <ObjectSelector
            name="language"
            value={search.language}
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
        <div {...searchFormClasses('tagline')}>
          <SearchTagGroup
            onRemoveItem={this.removeTagItem}
            languages={getResourceLanguages}
            subjects={subjects}
            searchObject={this.state.search}
          />
        </div>
      </form>
    );
  }
}

SearchConceptForm.propTypes = {
  search: PropTypes.func.isRequired,
  location: LocationShape,
  searchObject: PropTypes.shape({
    query: PropTypes.string,
    subjects: PropTypes.string,
    language: PropTypes.string,
  }),
  locale: PropTypes.string.isRequired,
  subjects: PropTypes.array,
};

export default injectT(SearchConceptForm);
