/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@ndla/button';
import { colors } from '@ndla/core';
import { Search } from '@ndla/icons/common';
import { injectT } from '@ndla/i18n';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { css } from 'react-emotion';
import { toEditArticle, to404 } from '../../../util/routeHelpers';

import { fetchTopicArticle } from '../../../modules/taxonomy';

import { fetchDraft, fetchNewArticleId } from '../../../modules/draft/draftApi';
import { getLocale } from '../../../modules/locale/locale';
import { editorialMastheadClasses } from '../MastheadContainer';

export class MastheadSearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.query,
    };
    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUrlPaste = this.handleUrlPaste.bind(this);
    this.handleNodeId = this.handleNodeId.bind(this);
  }

  handleQueryChange(evt) {
    this.setState({ query: evt.target.value });
  }

  async handleNodeId(nodeId) {
    const { history, locale } = this.props;
    try {
      const newArticle = await fetchNewArticleId(nodeId);
      const article = await fetchDraft(newArticle.id);
      const [supportedLanguage] = article.supportedLanguages.filter(
        item => item === locale,
      );

      history.push(
        toEditArticle(
          newArticle.id,
          'standard',
          supportedLanguage || article.supportedLanguages[0],
        ),
      );
    } catch (error) {
      history.push(to404());
    }
  }

  handleUrlPaste(ndlaUrl) {
    const { history, locale } = this.props;

    // Removes search queries before split
    const splittedNdlaUrl = ndlaUrl.split(/\?/)[0].split('/');

    const urlId = splittedNdlaUrl[splittedNdlaUrl.length - 1];
    if (!urlId.includes('urn:topic') && Number.isNaN(parseFloat(urlId))) return;

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
      this.handleNodeId(urlId);
    } else {
      history.push(toEditArticle(urlId, 'standard', locale));
    }
  }

  handleSubmit(evt) {
    evt.preventDefault();
    const { query } = this.state;
    const isNDLAUrl = /^https:\/(.*).ndla.no\/(article|subjects|nb|nn|en)\/(node|\d*)(\/|\d*)/.test(
      query,
    );
    const isNodeId =
      query.length > 2 &&
      /#\d+/g.test(query) &&
      !Number.isNaN(parseFloat(query.substring(1)));

    if (isNDLAUrl) {
      this.handleUrlPaste(query);
    } else if (isNodeId) {
      this.handleNodeId(query.substring(1));
    } else {
      this.props.onSearchQuerySubmit(query);
    }
  }

  render() {
    const { searching, t } = this.props;

    return (
      <form onSubmit={this.handleSubmit} {...editorialMastheadClasses('form')}>
        <input
          type="text"
          {...editorialMastheadClasses('form-query')}
          onChange={this.handleQueryChange}
          value={this.state.query}
          placeholder={t('searchForm.placeholder')}
        />
        <Button
          submit
          stripped
          css={css`
            color: ${colors.brand.grey};
          `}
          loading={searching}>
          <Search className="c-icon--medium" />
        </Button>
      </form>
    );
  }
}

MastheadSearchForm.propTypes = {
  locale: PropTypes.string.isRequired,
  query: PropTypes.string,
  searching: PropTypes.bool.isRequired,
  onSearchQuerySubmit: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

MastheadSearchForm.defaultProps = {
  query: '',
};

const mapStateToProps = state => ({
  locale: getLocale(state),
});

export default withRouter(
  connect(mapStateToProps)(injectT(MastheadSearchForm)),
);
