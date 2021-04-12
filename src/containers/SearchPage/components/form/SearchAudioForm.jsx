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
import Button from '@ndla/button';
import { css } from '@emotion/core';
import { getResourceLanguages } from '../../../../util/resourceHelpers';
import ObjectSelector from '../../../../components/ObjectSelector';
import { searchFormClasses } from './SearchForm';
import { LocationShape } from '../../../../shapes';

class SearchAudioForm extends Component {
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
        audioType: searchObject['audio-type'] || '',
      },
    };
  }

  componentDidUpdate(prevProps) {
    const { searchObject } = this.props;
    if (prevProps.searchObject?.query !== searchObject?.query) {
      this.setState({
        search: {
          query: searchObject.query || '',
          language: searchObject.language || '',
          'audio-type': searchObject['audio-type'] || '',
        },
      });
    }
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
    evt.persist();
    this.setState({ search: { query: '', language: '', 'audio-type': '' } }, () =>
      this.handleSearch(evt),
    );
  }

  render() {
    const { t } = this.props;

    const getAudioTypes = t => [
      { id: 'standard', name: t('searchForm.audioType.standard') },
      { id: 'podcast', name: t('searchForm.audioType.podcast') },
    ];

    return (
      <form onSubmit={this.handleSearch} {...searchFormClasses()}>
        <div {...searchFormClasses('field', '50-width')}>
          <input
            name="query"
            placeholder={t('searchForm.types.audioQuery')}
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
        <div {...searchFormClasses('field', '50-width')}>
          <ObjectSelector
            name="audio-type"
            value={this.state.search['audio-type']}
            options={getAudioTypes(t)}
            idKey="id"
            labelKey="name"
            emptyField
            onChange={this.onFieldChange}
            placeholder={t('searchForm.types.audio')}
          />
        </div>
      </form>
    );
  }
}

SearchAudioForm.propTypes = {
  search: PropTypes.func.isRequired,
  location: LocationShape,
  searchObject: PropTypes.shape({
    query: PropTypes.string,
    language: PropTypes.string,
    'audio-type': PropTypes.string,
  }),
};

SearchAudioForm.defaultProps = {
  searchObject: {
    query: '',
    language: '',
    'audio-type': '',
  },
};

export default injectT(SearchAudioForm);
