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
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { toEditArticle, to404 } from '../../../util/routeHelpers';
import {
  fetchTopicArticle,
  fetchNewArticleId,
} from '../../../modules/article/articleApi';
import { getLocale } from '../../../modules/locale/locale';

const classes = new BEMHelper({
  name: 'search-form',
  prefix: 'masthead-',
});

export class MastheadSearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.query,
    };
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUrlPaste = this.handleUrlPaste.bind(this);
  }

  handleQueryChange(evt) {
    this.setState({ query: evt.target.value });
  }

  handleUrlPaste(ndlaUrl) {
    const { history, locale } = this.props;

    // Removes search queries before split
    const splittedNdlaUrl = ndlaUrl.split(/\?/)[0].split('/');

    const urlId = splittedNdlaUrl[splittedNdlaUrl.length - 1];
    if (!urlId.includes('urn:topic') && isNaN(urlId)) return;

    this.setState({ query: '' });
    if (urlId.includes('urn:topic')) {
      fetchTopicArticle(urlId, locale).then(topicArticle => {
        const arr = topicArticle.contentUri.split(':');
        const id = arr[arr.length - 1];
        history.push(toEditArticle(id, 'topic-article', locale));
      });
    } else if (
      splittedNdlaUrl.includes('ndla.no') &&
      splittedNdlaUrl.includes('node')
    ) {
      fetchNewArticleId(urlId)
        .then(response => {
          history.push(toEditArticle(response.id, 'standard', locale));
        })
        .catch(() => {
          history.push(to404());
        });
    } else {
      history.push(toEditArticle(urlId, 'standard', locale));
    }
  }

  handleSubmit(evt) {
    evt.preventDefault();
    const isNDLAUrl = /^https:\/(.*).ndla.no\/(article|subjects|nb|nn|en)\/(node|\d*)(\/|\d*)/.test(
      this.state.query,
    );
    if (isNDLAUrl) {
      this.handleUrlPaste(this.state.query);
    } else {
      this.props.onSearchQuerySubmit(this.state.query);
    }
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
  locale: PropTypes.string.isRequired,
  query: PropTypes.string,
  searching: PropTypes.bool.isRequired,
  onSearchQuerySubmit: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

MastheadSearchForm.defaultProps = {
  show: false,
  query: '',
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default withRouter(
  connect(mapStateToProps)(injectT(MastheadSearchForm)),
);
