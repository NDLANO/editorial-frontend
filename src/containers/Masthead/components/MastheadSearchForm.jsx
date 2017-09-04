/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BEMHelper from 'react-bem-helper';
import { Button } from 'ndla-ui';
import { Search } from 'ndla-ui/icons';
import { injectT } from 'ndla-i18n';

const classes = new BEMHelper({
  name: 'search-form',
  prefix: 'masthead-',
});

class MastheadSearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.query,
    };
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleQueryChange(evt) {
    this.setState({ query: evt.target.value });
  }

  handleSubmit(evt) {
    evt.preventDefault();
    this.props.onSearchQuerySubmit(this.state.query);
  }

  render() {
    const { show, searching, t } = this.props;
    return (
      <form onSubmit={this.handleSubmit} {...classes(show ? '' : 'hidden')}>
        <input
          type="text"
          {...classes('query')}
          onChange={this.handleQueryChange}
          value={this.state.query}
          placeholder={t('searchForm.placeholder')}
        />
        <Button submit stripped loading={searching} {...classes('button')}>
          <Search className="c-icon--medium" />
        </Button>
      </form>
    );
  }
}

MastheadSearchForm.propTypes = {
  show: PropTypes.bool.isRequired,
  query: PropTypes.string,
  searching: PropTypes.bool.isRequired,
  onSearchQuerySubmit: PropTypes.func.isRequired,
};

MastheadSearchForm.defaultProps = {
  show: false,
  query: '',
};

export default injectT(MastheadSearchForm);
