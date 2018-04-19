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
import reformed from '../../../../components/reformed';
import validateSchema from '../../../../components/validateSchema';
import {
  Field,
  TextField,
  SelectObjectField,
} from '../../../../components/Fields';
import { SchemaShape } from '../../../../shapes';
import SearchTag from './SearchTag';

import { searchFormClasses } from './SearchForm';

export const getInitialModel = (query = {}) => ({
  title: query.query || '',
  language: query.language || 'all',
});

const languages = t => [
  { key: 'nb', title: t('language.nb') },
  { key: 'nn', title: t('language.nn') },
  { key: 'en', title: t('language.en') },
];

class SearchContentForm extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.emptySearch = this.emptySearch.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { initialModel, setModel, location } = nextProps;
    if (this.props.location.search !== location.search) {
      setModel(initialModel);
    }
  }

  handleSearch(evt) {
    evt.preventDefault();

    const { model, schema, setSubmitted, search } = this.props;
    if (!schema.isValid) {
      setSubmitted(true);
      return;
    }
    search({
      query: model.title,
      language: model.language || 'all',
      types: 'articles',
    });
  }

  emptySearch() {
    const { setModel } = this.props;
    setModel({ query: '', language: '' });
  }

  render() {
    const { t, bindInput, schema, submitted } = this.props;

    const commonFieldProps = { bindInput, schema, submitted };
    return (
      <Fragment>
        <form onSubmit={this.handleSearch} {...searchFormClasses()}>
          <TextField
            name="title"
            fieldClassName={searchFormClasses('field', '50-width').className}
            placeholder={t('searchForm.types.title')}
            {...commonFieldProps}
          />
          <SelectObjectField
            name="language"
            options={languages(t)}
            idKey="key"
            labelKey="title"
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
        </form>
        <div>
          <SearchTag tag={{ name: 'Test' }} />
        </div>
      </Fragment>
    );
  }
}

SearchContentForm.propTypes = {
  model: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    language: PropTypes.string,
  }),
  initialModel: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    language: PropTypes.string,
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
