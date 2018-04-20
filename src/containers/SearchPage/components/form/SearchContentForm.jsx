/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component, Fragment } from 'react';
import { compose } from 'redux';
import PropTypes from 'prop-types';
import { injectT } from 'ndla-i18n';
import { Button } from 'ndla-ui';
import {
  fetchSubjects,
  fetchResourceTypes,
} from '../../../../modules/taxonomy';
import { flattenResourceTypes } from '../../../../util/taxonomyHelpers';
import reformed from '../../../../components/reformed';
import validateSchema from '../../../../components/validateSchema';
import {
  Field,
  TextField,
  SelectObjectField,
} from '../../../../components/Fields';
import { SchemaShape } from '../../../../shapes';
import SearchTagGroup from './SearchTagGroup';

import { searchFormClasses } from './SearchForm';

export const getInitialModel = (query = {}) => ({
  query: query.query || '',
  language: query.language || '',
  subjects: query.subjects,
  resourceTypes: query['resource-types'],
});

const languages = t => [
  { id: 'nb', name: t('language.nb') },
  { id: 'nn', name: t('language.nn') },
  { id: 'en', name: t('language.en') },
];

class SearchContentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subjects: [],
      resourceTypes: [],
    };
    this.getTaxonomyData = this.getTaxonomyData.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.removeTagItem = this.removeTagItem.bind(this);
    this.emptySearch = this.emptySearch.bind(this);
  }

  componentDidMount() {
    this.getTaxonomyData();
  }

  componentWillReceiveProps(nextProps) {
    const { initialModel, setModel, location } = nextProps;
    if (this.props.location.search !== location.search) {
      setModel(initialModel);
    }
  }

  async getTaxonomyData() {
    const { locale } = this.props;
    const [resourceTypes, subjects] = await Promise.all([
      fetchResourceTypes(locale),
      fetchSubjects(locale),
    ]);
    this.setState({
      subjects,
      resourceTypes: flattenResourceTypes(resourceTypes),
    });
  }

  handleSearch(evt) {
    evt.preventDefault();

    const { model, schema, setSubmitted, search } = this.props;
    if (!schema.isValid) {
      setSubmitted(true);
      return;
    }
    search({
      query: model.query,
      language: model.language || '',
      subjects: model.subjects,
      'resource-types': model.resourceTypes,
      types: 'articles', // To be removed
    });
  }

  removeTagItem(tag) {
    const { setModel, model } = this.props;
    setModel({ ...model, [tag.type]: '' });
  }

  emptySearch() {
    const { setModel } = this.props;
    setModel({ query: '', language: '', subjects: '', resourceTypes: '' });
  }

  render() {
    const { subjects, resourceTypes } = this.state;
    const { t, bindInput, schema, submitted, model } = this.props;

    const commonFieldProps = { bindInput, schema, submitted };
    return (
      <Fragment>
        <form onSubmit={this.handleSearch} {...searchFormClasses()}>
          <TextField
            name="query"
            fieldClassName={searchFormClasses('field', '50-width').className}
            placeholder={t('searchForm.types.query')}
            {...commonFieldProps}
          />
          <SelectObjectField
            name="subjects"
            options={subjects}
            idKey="id"
            labelKey="name"
            emptyField
            placeholder={t('searchForm.types.subjects')}
            fieldClassName={searchFormClasses('field', '50-width').className}
            {...commonFieldProps}
          />
          <SelectObjectField
            name="resourceTypes"
            options={resourceTypes}
            idKey="id"
            labelKey="name"
            emptyField
            placeholder={t('searchForm.types.resourceTypes')}
            fieldClassName={searchFormClasses('field', '50-width').className}
            {...commonFieldProps}
          />
          <SelectObjectField
            name="language"
            options={languages(t)}
            idKey="id"
            labelKey="name"
            emptyField
            placeholder={t('searchForm.types.language')}
            fieldClassName={searchFormClasses('field', '25-width').className}
            {...commonFieldProps}
          />
          <Field {...searchFormClasses('field', '25-width')}>
            <Button onClick={this.emptySearch} outline>
              {t('searchForm.empty')}
            </Button>
            <Button submit>{t('searchForm.btn')}</Button>
          </Field>
          <div {...searchFormClasses('tagline')}>
            <SearchTagGroup
              onRemoveItem={this.removeTagItem}
              {...{
                subjects,
                resourceTypes,
                model,
                languages,
              }}
            />
          </div>
        </form>
      </Fragment>
    );
  }
}

SearchContentForm.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
    query: PropTypes.string,
    language: PropTypes.string,
    subjects: PropTypes.string,
    resourceTypes: PropTypes.string,
  }),
  initialModel: PropTypes.shape({
    id: PropTypes.number,
    query: PropTypes.string,
    language: PropTypes.string,
    subjects: PropTypes.string,
    resourceTypes: PropTypes.string,
  }),
  setModel: PropTypes.func.isRequired,
  fields: PropTypes.objectOf(PropTypes.object).isRequired,
  schema: SchemaShape,
  submitted: PropTypes.bool.isRequired,
  bindInput: PropTypes.func.isRequired,
  setSubmitted: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
};

export default compose(injectT, reformed, validateSchema({}))(
  SearchContentForm,
);
