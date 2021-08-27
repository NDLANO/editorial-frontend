/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import Button from '@ndla/button';
import { css } from '@emotion/core';
import PropTypes from 'prop-types';
import { RouteComponentProps } from 'react-router-dom';
import { getResourceLanguages } from '../../../../util/resourceHelpers';
import { getTagName } from '../../../../util/formHelper';
import ObjectSelector from '../../../../components/ObjectSelector';
import SearchTagGroup from './SearchTagGroup';
import { searchFormClasses, SearchParams } from './SearchForm';
import * as conceptStatuses from '../../../../util/constants/ConceptStatus';
import { fetchAuth0Editors } from '../../../../modules/auth0/auth0Api';
import { CONCEPT_WRITE_SCOPE } from '../../../../constants';
import { SubjectType } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { User } from './SearchContentForm';
import { LocationShape, SearchParamsShape } from '../../../../shapes';
import { MinimalTagType } from './SearchTag';

interface Props extends RouteComponentProps {
  search: (o: SearchParams) => void;
  subjects: SubjectType[];
  searchObject: SearchParams;
  locale: string;
}

interface SearchState {
  query: string;
  language: string;
  subjects: string;
  types: string;
  status: string;
  users: string;
  page?: string;
}

interface State {
  search: SearchState;
  users: User[];
}

const emptySearchState: SearchState = {
  status: '',
  types: '',
  query: '',
  subjects: '',
  language: '',
  users: '',
};

class SearchConceptForm extends Component<Props & WithTranslation, State> {
  constructor(props: Props & WithTranslation) {
    super(props);
    const { searchObject } = props;
    this.state = {
      search: {
        subjects: searchObject.subjects || '',
        query: searchObject.query || '',
        language: searchObject.language || '',
        types: 'concept',
        status: searchObject.status || '',
        users: searchObject.users || '',
      },
      users: [],
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.removeTagItem = this.removeTagItem.bind(this);
    this.emptySearch = this.emptySearch.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.getConceptStatuses = this.getConceptStatuses.bind(this);
  }

  componentDidMount() {
    this.getExternalData();
  }

  async getExternalData() {
    const users = await this.getUsers();
    this.setState({ users: users });
  }

  componentDidUpdate(prevProps: Props & WithTranslation) {
    const { searchObject } = this.props;
    if (prevProps.searchObject?.query !== searchObject?.query) {
      this.setState({
        search: {
          subjects: searchObject.subjects || '',
          query: searchObject.query || '',
          language: searchObject.language || '',
          types: 'concept',
          status: searchObject.status || '',
          users: searchObject.users || '',
        },
      });
    }
  }

  onFieldChange = (evt: React.FormEvent<HTMLInputElement>) => {
    const { value, name } = evt.currentTarget;
    this.setState(
      prevState => ({ search: { ...prevState.search, [name]: value } }),
      this.handleSearch,
    );
  };

  getConceptStatuses() {
    return Object.keys(conceptStatuses).map(s => {
      return { id: s, name: this.props.t(`form.status.${s.toLowerCase()}`) };
    });
  }

  handleSearch = (evt?: React.SyntheticEvent) => {
    if (evt) {
      evt.preventDefault();
      evt.stopPropagation();
    }
    const { search } = this.props;
    search({ ...this.state.search, page: 1 });
  };

  removeTagItem(tag: MinimalTagType) {
    this.setState(
      prevState => ({ search: { ...prevState.search, [tag.type]: '' } }),
      this.handleSearch,
    );
  }

  emptySearch() {
    this.setState({ search: emptySearchState }, this.handleSearch);
  }

  async getUsers() {
    const editors = await fetchAuth0Editors(CONCEPT_WRITE_SCOPE);
    return editors.map(u => {
      return { id: `${u.app_metadata.ndla_id}`, name: u.name };
    });
  }

  sortByProperty(property: string) {
    type Sortable = { [key: string]: any };

    return function(a: Sortable, b: Sortable) {
      return a[property]?.localeCompare(b[property]);
    };
  }

  render() {
    const { t, subjects } = this.props;
    const { search, users } = this.state;

    const tagTypes = [
      {
        type: 'query',
        id: search.query,
        name: search.query,
      },
      {
        type: 'language',
        id: search.language,
        name: getTagName(search.language, getResourceLanguages(t)),
      },
      {
        type: 'users',
        id: search.users,
        name: getTagName(search.users, users),
      },
      {
        type: 'subjects',
        id: search.subjects,
        name: getTagName(search.subjects, subjects),
      },
      {
        type: 'status',
        id: search.status,
        name: getTagName(search.status, this.getConceptStatuses()),
      },
    ];

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
        <div key={`searchfield_subjects`} {...searchFormClasses('field', `50-width`)}>
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
        <div key={`searchfield_status`} {...searchFormClasses('field', `25-width`)}>
          <ObjectSelector
            name={'status'}
            options={this.getConceptStatuses()}
            idKey="id"
            value={this.state.search['status']}
            labelKey="name"
            emptyField
            placeholder={t(`searchForm.types.status`)}
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
          <ObjectSelector
            name="users"
            value={search['users']}
            options={users.sort(this.sortByProperty('name'))}
            idKey="id"
            labelKey="name"
            emptyField
            onChange={this.onFieldChange}
            onBlur={this.onFieldChange}
            placeholder={t('searchForm.types.users')}
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
          <SearchTagGroup onRemoveItem={this.removeTagItem} tagTypes={tagTypes} />
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
}

export default withTranslation()(SearchConceptForm);
