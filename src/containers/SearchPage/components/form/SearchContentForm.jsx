/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { css } from '@emotion/core';
import Button from '@ndla/button';
import { fetchResourceTypes } from '../../../../modules/taxonomy';
import { flattenResourceTypesAndAddContextTypes } from '../../../../util/taxonomyHelpers';
import { getResourceLanguages } from '../../../../util/resourceHelpers';
import ObjectSelector from '../../../../components/ObjectSelector';
import SearchTagGroup from './SearchTagGroup';
import ArticleStatuses from '../../../../util/constants/index';
import { fetchAuth0Editors } from '../../../../modules/auth0/auth0Api';
import { searchFormClasses } from './SearchForm';
import { LocationShape } from '../../../../shapes';

const emptySearchState = {
  query: '',
  subjects: '',
  resourceTypes: '',
  draftStatus: '',
  users: '',
};

class SearchContentForm extends Component {
  constructor(props) {
    super(props);
    const { searchObject } = props;
    this.state = {
      dropDown: {
        resourceTypes: [],
        users: [],
      },
      search: {
        subjects: searchObject.subjects || '',
        resourceTypes: searchObject['resource-types'] || '',
        draftStatus: searchObject['draft-status'] || '',
        query: searchObject.query || '',
        users: searchObject.users || '',
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

  onFieldChange(evt) {
    const { name, value } = evt.target;
    this.setState(
      prevState => ({ search: { ...prevState.search, [name]: value } }),
      this.handleSearch,
    );
  }

  async getExternalData() {
    const { locale } = this.props;
    const { t } = this.props;
    const [resourceTypes, users] = await Promise.all([
      fetchResourceTypes(locale),
      this.getUsers(),
    ]);
    this.setState({
      dropDown: {
        resourceTypes: flattenResourceTypesAndAddContextTypes(resourceTypes, t),
        users,
      },
    });
  }

  handleSearch(evt) {
    if (evt) {
      evt.preventDefault();
    }
    const {
      search: { resourceTypes, draftStatus, subjects, query, users },
    } = this.state;
    const { search } = this.props;
    search({
      'resource-types': resourceTypes,
      'draft-status': draftStatus,
      subjects,
      query,
      users,
      page: 1,
    });
  }

  removeTagItem(tag) {
    this.setState(
      prevState => ({ search: { ...prevState.search, [tag.type]: '' } }),
      this.handleSearch,
    );
  }

  emptySearch() {
    this.setState({ search: emptySearchState }, this.handleSearch);
  }

  getDraftStatuses() {
    return Object.keys(ArticleStatuses.articleStatuses).map(s => {
      return { id: s, name: this.props.t(`form.status.${s.toLowerCase()}`) };
    });
  }

  async getUsers() {
    const editors = await fetchAuth0Editors();
    return editors.map(u => {
      return { id: `"${u.app_metadata.ndla_id}"`, name: u.name };
    });
  }

  sortByProperty(property) {
    return function(a, b) {
      // returns true if value of array element at field "name" is null or undefined
      if (!a[property]) return 1;
      return a[property].localeCompare(b[property]);
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
        name: 'draftStatus',
        label: 'draftStatus',
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
        <form onSubmit={this.handleSearch} {...searchFormClasses()}>
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
              draftStatus={this.getDraftStatuses()}
            />
          </div>
        </form>
      </Fragment>
    );
  }
}

SearchContentForm.propTypes = {
  search: PropTypes.func.isRequired,
  subjects: PropTypes.array,
  location: LocationShape,
  searchObject: PropTypes.shape({
    query: PropTypes.string,
    subjects: PropTypes.string,
    'resource-types': PropTypes.string,
    'draft-status': PropTypes.string,
    users: PropTypes.string,
  }),
  locale: PropTypes.string.isRequired,
};

export default injectT(SearchContentForm);
