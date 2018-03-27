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
import { Link } from 'react-router-dom';
import reformed from '../../../../components/reformed';
import validateSchema from '../../../../components/validateSchema';
import { Field, TextField } from '../../../../components/Fields';
import { SchemaShape, LicensesArrayOf } from '../../../../shapes';

import { formClasses } from '../../../Form';

export const getInitialModel = (query = {}) => ({
  title: query.title || '',
});

class SearchMediaForm extends Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(evt) {
    evt.preventDefault();

    const { model, schema, setSubmitted, search } = this.props;
    if (!schema.isValid) {
      setSubmitted(true);
      return;
    }

    search({
      title: model.title,
    });
  }

  render() {
    const {
      t,
      bindInput,
      schema,
      model,
      submitted,
      tags,
      isSaving,
      showSaved,
    } = this.props;

    const commonFieldProps = { bindInput, schema, submitted };
    return (
      <form onSubmit={this.handleSearch} {...formClasses()}>
        <Field right>
          <Link
            to={'/'}
            className="c-button c-button--outline c-abort-button"
            disabled={isSaving}>
            {t('form.abort')}
          </Link>
          <TextField name="title" placeholder="Tittel" {...commonFieldProps} />
          <Button isSaving={isSaving} t={t} showSaved={showSaved}>
            Søk
          </Button>
        </Field>
      </form>
    );
  }
}

SearchMediaForm.propTypes = {
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

export default compose(injectT, reformed, validateSchema({}))(SearchMediaForm);
