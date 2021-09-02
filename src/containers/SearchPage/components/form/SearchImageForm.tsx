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
import { getTagName } from '../../../../util/formHelper';
import { getLicensesWithTranslations } from '../../../../util/licenseHelpers';
import ObjectSelector from '../../../../components/ObjectSelector';
import SearchTagGroup from './SearchTagGroup';
import { searchFormClasses, SearchParams } from './SearchForm';
import { LocationShape, SearchParamsShape } from '../../../../shapes';
import { SubjectType } from '../../../../modules/taxonomy/taxonomyApiInterfaces';
import { fetchLicenses } from '../../../../modules/draft/draftApi';
import { MinimalTagType } from './SearchTag';

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
    license: string;
    modelReleased: string;
    page?: string;
  };
  licenses: {
    id: string;
    name: string;
  }[];
}

const getModelReleasedValues = (t: WithTranslation['t']) => [
  { id: 'yes', name: t('imageSearch.modelReleased.yes') },
  { id: 'not-applicable', name: t('imageSearch.modelReleased.not-applicable') },
  { id: 'no', name: t('imageSearch.modelReleased.no') },
];

class SearchImageForm extends Component<Props & WithTranslation, State> {
  constructor(props: Props & WithTranslation) {
    super(props);

    const { searchObject } = props;

    this.handleSearch = this.handleSearch.bind(this);
    this.removeTagItem = this.removeTagItem.bind(this);
    this.emptySearch = this.emptySearch.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);

    this.state = {
      search: {
        query: searchObject.query || '',
        language: searchObject.language || '',
        license: searchObject.license || '',
        modelReleased: searchObject['model-released'] || '',
      },
      licenses: [],
    };
  }

  componentDidMount() {
    this.getLicenses();
  }

  componentDidUpdate(prevProps: Props & WithTranslation) {
    const { searchObject } = this.props;
    if (prevProps.searchObject?.query !== searchObject?.query) {
      this.setState({
        search: {
          query: searchObject.query || '',
          language: searchObject.language || '',
          license: searchObject.license || '',
          modelReleased: searchObject['model-released'] || '',
        },
      });
    }
  }

  async getLicenses() {
    const licenses = await fetchLicenses();
    const licensesWithTranslations = getLicensesWithTranslations(licenses, this.props.locale);
    this.setState({
      licenses: licensesWithTranslations.map(license => ({
        id: license.license,
        name: license.title,
      })),
    });
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
    const {
      search: { query, language, license, modelReleased },
    } = this.state;
    const { search } = this.props;
    search({ query, language, license, 'model-released': modelReleased, page: 1 });
  }

  removeTagItem(tag: MinimalTagType) {
    this.setState(
      prevState => ({ search: { ...prevState.search, [tag.type]: '' } }),
      this.handleSearch,
    );
  }

  emptySearch(evt: React.MouseEvent<HTMLButtonElement>) {
    evt.persist();
    this.setState({ search: { query: '', language: '', license: '', modelReleased: '' } }, () =>
      this.handleSearch(evt),
    );
  }

  render() {
    const { t } = this.props;
    const { search, licenses } = this.state;

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
        type: 'license',
        id: search.license,
        name: getTagName(search.license, licenses),
      },
      {
        type: 'modelReleased',
        id: search.modelReleased,
        name: getTagName(search.modelReleased, getModelReleasedValues(t)),
      },
    ];

    return (
      <form onSubmit={this.handleSearch} {...searchFormClasses()}>
        <div {...searchFormClasses('field', '50-width')}>
          <input
            name="query"
            placeholder={t('searchForm.types.imageQuery')}
            value={search.query}
            onChange={this.onFieldChange}
          />
        </div>
        <div {...searchFormClasses('field', '50-width')}>
          <ObjectSelector
            name="license"
            value={search.license}
            options={licenses}
            idKey="id"
            labelKey="name"
            emptyField
            onChange={this.onFieldChange}
            placeholder={t('searchForm.types.license')}
          />
        </div>
        <div {...searchFormClasses('field', '50-width')}>
          <ObjectSelector
            name="modelReleased"
            value={search.modelReleased}
            options={getModelReleasedValues(t)}
            idKey="id"
            labelKey="name"
            emptyField
            onChange={this.onFieldChange}
            placeholder={t('searchForm.types.modelReleased')}
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

  static defaultProps = {
    searchObject: {
      query: '',
      language: '',
    },
  };
}

export default withTranslation()(SearchImageForm);
