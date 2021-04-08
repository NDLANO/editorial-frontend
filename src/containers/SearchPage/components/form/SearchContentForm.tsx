/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, FormEvent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT, tType } from '@ndla/i18n';
import { css } from '@emotion/core';
import Button from '@ndla/button';
import { fetchResourceTypes } from '../../../../modules/taxonomy';
import { flattenResourceTypesAndAddContextTypes } from '../../../../util/taxonomyHelpers';
import { getResourceLanguages } from '../../../../util/resourceHelpers';
import ObjectSelector from '../../../../components/ObjectSelector';
import SearchTagGroup from './SearchTagGroup';
import ArticleStatuses from '../../../../util/constants/index';
import { fetchAuth0Editors } from '../../../../modules/auth0/auth0Api';
import { searchFormClasses, SearchParams } from './SearchForm';
import { LocationShape, SearchParamsShape } from '../../../../shapes';
import { DRAFT_WRITE_SCOPE } from '../../../../constants';
import { SubjectType } from '../../../../interfaces';

const emptySearchState: SearchState = {
  query: '',
  subjects: '',
  resourceTypes: '',
  status: '',
  users: '',
  lang: '',
};

interface Props {
  search: (o: SearchParams) => void;
  subjects: SubjectType[];
  location: Location;
  searchObject: SearchParams;
  locale: string;
}

export interface SearchState extends Record<string, string | undefined> {
  subjects: string;
  resourceTypes?: string;
  status: string;
  query: string;
  users: string;
  // This field is called `lang` instead of `language` to NOT match with tag in `SearchTagGroup.tsx`
  lang: string;
}

export interface ResourceType {
  id: string;
  name: string;
  typeId: string;
  typeName: string;
}

export interface User {
  id: string;
  name: string;
}

interface State {
  dropDown: {
    resourceTypes: ResourceType[];
    users: User[];
  };
  search: SearchState;
}

class SearchContentForm extends Component<Props & tType, State> {
  constructor(props: Props & tType) {
    super(props);
    const { searchObject, locale } = props;
    this.state = {
      dropDown: {
        resourceTypes: [],
        users: [],
      },
      search: {
        subjects: searchObject.subjects || '',
        resourceTypes: searchObject['resource-types'] || '',
        status: searchObject['draft-status'] || '',
        query: searchObject.query || '',
        users: searchObject.users || '',
        lang: searchObject.language || locale,
      },
    };
    this.getExternalData = this.getExternalData.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.removeTagItem = this.removeTagItem.bind(this);
    this.emptySearch = this.emptySearch.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
    this.getDraftStatuses = this.getDraftStatuses.bind(this);
  }

  componentDidMount() {
    this.getExternalData();
  }

  componentDidUpdate(prevProps: Props) {
    const { searchObject, locale } = this.props;
    if (prevProps.searchObject?.query !== searchObject?.query) {
      this.setState({
        search: {
          subjects: searchObject.subjects || '',
          resourceTypes: searchObject['resource-types'] || '',
          status: searchObject['draft-status'] || '',
          query: searchObject.query || '',
          users: searchObject.users || '',
          lang: searchObject.language || locale,
        },
      });
    }
  }

  onFieldChange(evt: FormEvent<HTMLInputElement>) {
    const { name, value } = evt.currentTarget;
    this.setState(
      prevState => ({ search: { ...prevState.search, [name]: value } }),
      this.handleSearch,
    );
  }

  async getExternalData() {
    const { locale } = this.props;
    const { t } = this.props;
    const [resourceTypes, users] = await Promise.all([fetchResourceTypes(locale), this.getUsers()]);
    const flattenedResourceTypes = flattenResourceTypesAndAddContextTypes(resourceTypes, t);
    this.setState({
      dropDown: {
        resourceTypes: flattenedResourceTypes,
        users,
      },
    });
  }

  handleSearch() {
    const {
      search: { resourceTypes, status, subjects, query, users, lang },
    } = this.state;
    const { search } = this.props;

    // HAS_PUBLISHED isn't a status in the backend.
    const newStatus = status === 'HAS_PUBLISHED' ? 'PUBLISHED' : status;
    const shouldFilterOthers = status === 'HAS_PUBLISHED';

    search({
      'resource-types': resourceTypes,
      'draft-status': newStatus,
      'include-other-statuses': shouldFilterOthers.toString(),
      subjects,
      query,
      users,
      language: lang,
      fallback: true,
      page: '1',
    });
  }

  removeTagItem(tag: { name: string; type: string }) {
    this.setState(
      prevState => ({ search: { ...prevState.search, [tag.type]: '' } }),
      this.handleSearch,
    );
  }

  emptySearch() {
    this.setState({ search: emptySearchState }, this.handleSearch);
  }

  getDraftStatuses(): { id: string; name: string }[] {
    return [
      ...Object.keys(ArticleStatuses.articleStatuses).map(s => {
        return { id: s, name: this.props.t(`form.status.${s.toLowerCase()}`) };
      }),
      { id: 'HAS_PUBLISHED', name: this.props.t(`form.status.has_published`) },
    ];
  }

  async getUsers() {
    const editors = await fetchAuth0Editors(DRAFT_WRITE_SCOPE);
    return editors.map((u: { app_metadata: { ndla_id: string }; name: string }) => {
      return { id: `"${u.app_metadata.ndla_id}"`, name: u.name };
    });
  }

  sortByProperty(property: string) {
    type Sortable = { [key: string]: any };

    return function(a: Sortable, b: Sortable) {
      return a[property]?.localeCompare(b[property]);
    };
  }

  render() {
    const {
      dropDown: { resourceTypes, users },
    } = this.state;
    const { t, subjects } = this.props;

    const selectFields = [
      {
        name: 'subjects',
        label: 'subjects',
        width: 50,
        options: subjects.sort(this.sortByProperty('name')),
      },
      {
        name: 'resourceTypes',
        label: 'resourceTypes',
        width: 25,
        options: resourceTypes.sort(this.sortByProperty('name')),
      },
      {
        name: 'status',
        label: 'status',
        width: 25,
        options: this.getDraftStatuses().sort(this.sortByProperty('name')),
      },
      {
        name: 'users',
        label: 'users',
        width: 25,
        options: users.sort(this.sortByProperty('name')),
      },
    ];

    return (
      <Fragment>
        <form
          onSubmit={evt => {
            evt.preventDefault();
            this.handleSearch();
          }}
          {...searchFormClasses()}>
          <div {...searchFormClasses('field', '50-width')}>
            <input
              name="query"
              value={this.state.search.query}
              placeholder={t('searchForm.types.contentQuery')}
              onChange={this.onFieldChange}
            />
          </div>

          {selectFields.map(selectField => (
            <div
              key={`searchfield_${selectField.name}`}
              {...searchFormClasses('field', `${selectField.width}-width`)}>
              <ObjectSelector
                name={selectField.name}
                options={selectField.options}
                idKey="id"
                value={this.state.search[selectField.name]}
                labelKey="name"
                emptyField
                placeholder={t(`searchForm.types.${selectField.label}`)}
                onChange={this.onFieldChange}
              />
            </div>
          ))}
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
              users={users}
              subjects={subjects}
              searchObject={this.state.search}
              resourceTypes={resourceTypes}
              status={this.getDraftStatuses()}
            />
          </div>
        </form>
      </Fragment>
    );
  }

  static propTypes = {
    search: PropTypes.func.isRequired,
    subjects: PropTypes.array.isRequired,
    location: LocationShape,
    searchObject: SearchParamsShape.isRequired,
    locale: PropTypes.string.isRequired,
  };
}

export default injectT(SearchContentForm);
