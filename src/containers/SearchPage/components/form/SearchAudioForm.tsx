/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectT, tType } from '@ndla/i18n';
import Button from '@ndla/button';
import { css } from '@emotion/core';
import { getResourceLanguages } from '../../../../util/resourceHelpers';
import ObjectSelector from '../../../../components/ObjectSelector';
import { LocationShape, SearchParamsShape } from '../../../../shapes';
import { searchFormClasses, SearchParams } from './SearchForm';
import { SubjectType } from '../../../../interfaces';

interface Props {
  search: (o: SearchParams) => void;
  subjects: SubjectType[];
  location: Location;
  searchObject: SearchParams;
  locale: string;
}

export interface SearchState {
  query: string;
  language: string;
  'audio-type': string;
}

interface State {
  search: SearchState;
}

class SearchAudioForm extends Component<Props & tType, State> {
  constructor(props: Props & tType) {
    super(props);

    const { searchObject } = props;

    this.handleSearch = this.handleSearch.bind(this);
    this.emptySearch = this.emptySearch.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);

    this.state = {
      search: {
        query: searchObject.query || '',
        language: searchObject.language || '',
        'audio-type': searchObject['audio-type'] || '',
      },
    };
  }

  componentDidUpdate(prevProps: Props & tType) {
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

  onFieldChange(evt: React.FormEvent<HTMLInputElement>) {
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
    search({ ...this.state.search, page: '1' });
  }

  emptySearch(evt: React.MouseEvent<HTMLButtonElement>) {
    evt.persist();
    this.setState({ search: { query: '', language: '', 'audio-type': '' } }, () =>
      this.handleSearch(evt),
    );
  }

  render() {
    const { t } = this.props;

    const getAudioTypes = () => [
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
            options={getAudioTypes()}
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

  static defaultProps = {
    searchObject: {
      query: '',
      language: '',
      'audio-type': '',
    },
  };

  static propTypes = {
    search: PropTypes.func.isRequired,
    subjects: PropTypes.array.isRequired,
    location: LocationShape,
    searchObject: SearchParamsShape,
    locale: PropTypes.string.isRequired,
  };
}

export default injectT(SearchAudioForm);
