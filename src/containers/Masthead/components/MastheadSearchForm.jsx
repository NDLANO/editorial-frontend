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
import { colors, misc, spacing, fonts } from '@ndla/core';
import { Search } from '@ndla/icons/common';
import { injectT } from '@ndla/i18n';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { css } from '@emotion/core';
import { toEditArticle, to404 } from '../../../util/routeHelpers';

import { fetchTopicArticle } from '../../../modules/taxonomy';

import { fetchDraft, fetchNewArticleId } from '../../../modules/draft/draftApi';
import { resolveUrls } from '../../../modules/taxonomy/taxonomyApi';
import { getLocale } from '../../../modules/locale/locale';

const formCSS = css`
  display: flex;
  background: ${colors.brand.greyLightest};
  border-radius: ${misc.borderRadius};
  border: 1px solid transparent;
  ${fonts.sizes(16, 1.2)} font-weight: ${fonts.weight.semibold};
  padding: ${spacing.xsmall};
  padding-left: ${spacing.small};
  transition: all 200ms ease;

  input {
    padding: ${spacing.xsmall};
    background: transparent;
    border: 0;
    outline: none;
    color: ${colors.brand.primary};
    transition: width 200ms ease 100ms;
    width: 200px;

    &:focus {
      width: 400px;
    }
  }

  & > button {
    color: ${colors.brand.grey};
  }

  .c-icon {
    margin: 0 ${spacing.small};
  }

  &:focus-within {
    border: 1px solid ${colors.brand.primary};

    .c-icon {
      color: ${colors.brand.primary};
    }
  }

  &:hover,
  &:focus {
    &:not(:focus-within) {
      cursor: pointer;
      background: ${colors.brand.greyLighter};
      border: 1px solid ${colors.brand.greyLight};
    }
  }
`;

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
    this.handleTopicUrl = this.handleTopicUrl.bind(this);
    this.handleFrontendUrl = this.handleFrontendUrl.bind(this);
  }

  handleQueryChange(evt) {
    this.setState({ query: evt.target.value });
  }

  async handleNodeId(nodeId) {
    const { history, locale } = this.props;
    try {
      const newArticle = await fetchNewArticleId(nodeId);
      const article = await fetchDraft(newArticle.id);
      const supportedLanguage = article.supportedLanguages.find(
        language => language === locale,
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

  handleUrlPaste(frontendUrl) {
    const { history, locale } = this.props;

    // Removes search queries before split
    const ndlaUrl = frontendUrl.split(/\?/)[0];
    // Strip / from end if topic
    const cleanUrl = ndlaUrl.endsWith('/') ? ndlaUrl.slice(0, -1) : ndlaUrl;
    const splittedNdlaUrl = cleanUrl.split('/');

    const urlId = splittedNdlaUrl[splittedNdlaUrl.length - 1];

    if (
      !urlId.includes('urn:topic') &&
      Number.isNaN(parseFloat(urlId)) &&
      !splittedNdlaUrl.includes('subjects')
    ) {
      return;
    }

    this.setState({ query: '' });
    if (urlId.includes('urn:topic')) {
      this.handleTopicUrl(urlId);
    } else if (splittedNdlaUrl.includes('node')) {
      this.handleNodeId(urlId);
    } else if (splittedNdlaUrl.includes('subjects')) {
      this.handleFrontendUrl(cleanUrl);
    } else {
      history.push(toEditArticle(urlId, 'standard', locale));
    }
  }

  async handleTopicUrl(urlId) {
    const { locale, history } = this.props;
    try {
      const topicArticle = await fetchTopicArticle(urlId, locale);
      const arr = topicArticle.contentUri.split(':');
      const id = arr[arr.length - 1];
      const article = await fetchDraft(id);
      const supportedLanguage = article.supportedLanguages.find(
        language => language === locale,
      );
      history.push(
        toEditArticle(
          id,
          'topic-article',
          supportedLanguage || article.supportedLanguages[0],
        ),
      );
    } catch {
      history.push(to404());
    }
  }

  async handleFrontendUrl(url) {
    const { locale, history } = this.props;
    const splitted = url.split('subjects');
    const taxonomyUrl = splitted[splitted.length - 1];
    try {
      const newArticle = await resolveUrls(taxonomyUrl, locale);
      const splittedUri = newArticle.contentUri.split(':');
      const articleId = splittedUri[splittedUri.length - 1];
      const article = await fetchDraft(articleId);
      const supportedLanguage = article.supportedLanguages.find(
        language => language === locale,
      );

      history.push(
        toEditArticle(
          articleId,
          'standard',
          supportedLanguage || article.supportedLanguages[0],
        ),
      );
    } catch {
      history.push(to404());
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
      <form onSubmit={this.handleSubmit} css={formCSS}>
        <input
          type="text"
          onChange={this.handleQueryChange}
          value={this.state.query}
          placeholder={t('searchForm.placeholder')}
        />
        <Button submit stripped loading={searching}>
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
