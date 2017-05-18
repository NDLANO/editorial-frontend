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
import { OneColumn } from 'ndla-ui';

import { actions as tagActions, getAllTags } from '../Tag/tagDucks';
import { getLocale } from '../Locale/localeSelectors';
import EditTopicArticle from './EditTopicArticle';
import CreateTopicArticle from './CreateTopicArticle';

class TopicArticlePage extends Component {

  componentWillMount() {
    const { fetchTags } = this.props;
    fetchTags();
  }

  render() {
    const { locale, tags, match } = this.props;

    return (
      <OneColumn cssModifier="narrow">
        <Switch>
          <Route
            path={`${match.url}/new`}
            render={() => (
              <CreateTopicArticle
                tags={tags}
                locale={locale}
              />
            )}
          />
          <Route
            path={`${match.url}/:articleId/edit`}
            render={props => (
              <EditTopicArticle
                articleId={props.match.params.articleId}
                tags={tags}
                locale={locale}
              />
            )}
          />
        </Switch>
      </OneColumn>
    );
  }
}

TopicArticlePage.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
  }).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  fetchTags: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
};

const mapDispatchToProps = {
  fetchTags: tagActions.fetchTags,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
  tags: getAllTags(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(TopicArticlePage);
