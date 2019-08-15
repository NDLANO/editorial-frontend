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
import { searchFormClasses } from './SearchForm';

class SearchAgreementForm extends Component {
  constructor(props) {
    super(props);
    const { searchObject } = props;
    this.state = {
      search: {
        query: searchObject.query || '',
        types: 'agreement',
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
    const { search } = this.props;
    search({ ...this.state.search, page: 1 });
  };

  emptySearch = evt => {
    this.setState({ search: { query: '', types: 'agreement' } }, () =>
      this.handleSearch(evt),
    );
  };

  render() {
    const { t } = this.props;
    const { search } = this.state;

    return (
      <form onSubmit={this.handleSearch} {...searchFormClasses()}>
        <div {...searchFormClasses('field', '50-width')}>
          <input
            name="query"
            placeholder={t('searchForm.types.agreementQuery')}
            value={search.query}
            onChange={this.onFieldChange}
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

SearchAgreementForm.propTypes = {
  search: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
  searchObject: PropTypes.shape({
    query: PropTypes.string,
    language: PropTypes.string,
  }),
};

SearchAgreementForm.defaultProps = {
  searchObject: {
    query: '',
  },
};

export default injectT(SearchAgreementForm);
