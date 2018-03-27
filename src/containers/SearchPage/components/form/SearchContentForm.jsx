/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
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
import { SchemaShape, LicensesArrayOf } from '../../../../shapes';

import { searchFormClasses } from './SearchForm';

export const getInitialModel = (query = {}) => ({
  title: query.title || '',
  language: query.language || '',
});

const languages = [
  { key: 'nb', title: 'Norsk' },
  { key: 'nn', title: 'Nynorsk' },
  { key: 'en', title: 'Engelsk' },
];

class SearchContentForm extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.emptySearch = this.emptySearch.bind(this);
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
      language: model.language,
    });
  }

  emptySearch() {
    const { setModel } = this.props;
    setModel({ title: '', language: '' });
  }

  render() {
    const { t, bindInput, schema, submitted, isSaving } = this.props;

    const commonFieldProps = { bindInput, schema, submitted };
    return (
      <form onSubmit={this.handleSearch} {...searchFormClasses()}>
        <TextField
          name="title"
          fieldClassName={searchFormClasses('field', '50-width').className}
          placeholder="Tittel"
          {...commonFieldProps}
        />
        <SelectObjectField
          name="language"
          options={languages}
          idKey="key"
          labelKey="title"
          emptyField
          placeholder="Språk"
          fieldClassName={searchFormClasses('field', '25-width').className}
          {...commonFieldProps}
        />
        <Field {...searchFormClasses('field', '25-width')}>
          <Button onClick={this.emptySearch} outline disabled={isSaving}>
            Tøm
          </Button>
          <Button>Søk</Button>
        </Field>
      </form>
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
    language: PropTypes.string,
  }),
  setModel: PropTypes.func.isRequired,
  fields: PropTypes.objectOf(PropTypes.object).isRequired,
  schema: SchemaShape,
  licenses: LicensesArrayOf,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  submitted: PropTypes.bool.isRequired,
  bindInput: PropTypes.func.isRequired,
  revision: PropTypes.number,
  setSubmitted: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  isSaving: PropTypes.bool.isRequired,
  showSaved: PropTypes.bool.isRequired,
};

export default compose(injectT, reformed, validateSchema({}))(
  SearchContentForm,
);
