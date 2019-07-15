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
import { searchFormClasses } from './SearchForm';

class SearchConceptForm extends Component {
  constructor(props) {
    super(props);

    const { searchObject } = props;

    this.handleSearch = this.handleSearch.bind(this);
    this.emptySearch = this.emptySearch.bind(this);

    this.state = {
      search: {
        query: searchObject.query || '',
        language: searchObject.language || '',
        types: 'concept',
      },
    };
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
    }
    const { search } = this.state;
    search({ ...this.state.search, page: 1 });
  }

  emptySearch = evt => {
    this.setState(
      { search: { query: '', language: '', types: 'concept' } },
      () => this.handleSearch(evt),
    );
  }

  render() {
    const { t } = this.props;
    const { search } = this.state;

    return (
      <form onSubmit={this.handleSearch} {...searchFormClasses()}>
        <div {...searchFormClasses('field', '50-width')}>
          <input
            name="query"
            placeholder={t('searchForm.types.conceptQuery')}
            value={search.query}
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
      </form>
    );
  }
}

SearchConceptForm.propTypes = {
  search: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
  searchObject: PropTypes.shape({
    query: PropTypes.string,
    language: PropTypes.string,
  }),
};

SearchConceptForm.defaultProps = {
  searchObject: {
    query: '',
    language: '',
  },
};

export default injectT(SearchConceptForm);
