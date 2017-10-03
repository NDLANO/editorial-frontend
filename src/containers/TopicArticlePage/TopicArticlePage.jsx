/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { OneColumn, Hero } from 'ndla-ui';

import {
  actions as tagActions,
  getAllTagsByLanguage,
} from '../../modules/tag/tag';
import { getSaving } from '../../modules/article/article';
import { getLocale } from '../../modules/locale/locale';
import EditTopicArticle from './EditTopicArticle';
import CreateTopicArticle from './CreateTopicArticle';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

class TopicArticlePage extends Component {
  componentWillMount() {
    const { fetchTags } = this.props;
    fetchTags();
  }

  render() {
    const { locale, tags, match, history, isSaving } = this.props;

    return (
      <div>
        <Hero alt />
        <OneColumn>
          <Switch>
            <Route
              path={`${match.url}/new`}
              render={() =>
                <CreateTopicArticle
                  history={history}
                  locale={locale}
                  tags={tags}
                  isSaving={isSaving}
                />}
            />
            <Route
              path={`${match.url}/:articleId/edit`}
              render={props =>
                <EditTopicArticle
                  articleId={props.match.params.articleId}
                  tags={tags}
                  locale={locale}
                  isSaving={isSaving}
                />}
            />
            <Route component={NotFoundPage} />
          </Switch>
        </OneColumn>
      </div>
    );
  }
}

TopicArticlePage.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchTags: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
};

const mapDispatchToProps = {
  fetchTags: tagActions.fetchTags,
};

const mapStateToProps = state => {
  const locale = getLocale(state);
  const getAllTagsSelector = getAllTagsByLanguage(locale);
  return {
    locale,
    tags: getAllTagsSelector(state),
    isSaving: getSaving(state),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopicArticlePage);
