/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { PageContainer } from 'ndla-ui';
import { withRouter, Route, Switch } from 'react-router-dom';

import { MessageShape } from '../../shapes';
import Masthead from '../Masthead';
import Footer from './components/Footer';
import { getLocale } from '../../modules/locale/locale';
import { getMessages } from '../Messages/messagesSelectors';
import Alerts from '../Messages/Alerts';
import { injectT } from '../../i18n';
import ScrollToTop from './ScrollToTop';
import Login from '../Login/Login';
import Logout from '../Logout/Logout';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import WelcomePage from '../WelcomePage/WelcomePage';
import SearchPage from '../SearchPage/SearchPage';
import TopicArticlePage from '../TopicArticlePage/TopicArticlePage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import ForbiddenPage from '../ForbiddenPage/ForbiddenPage';

export class App extends React.Component {
  getChildContext() {
    return {
      locale: this.props.locale,
    };
  }

  render() {
    const { dispatch, messages, t, match: { params } } = this.props;

    return (
      <PageContainer>
        <Helmet
          title="NDLA"
          meta={[{ name: 'description', content: t('meta.description') }]}
        />
        <Masthead
          t={t}
          params={params}
          authenticated={this.props.authenticated}
          userName={this.props.userName}
        />
        <ScrollToTop />
        <Switch>
          <Route path="/" exact component={WelcomePage} />
          <Route path="/login" component={Login} />
          <Route path="/logout" component={Logout} />
          <PrivateRoute path="/search" component={SearchPage} />
          <PrivateRoute path="/topic-article/" component={TopicArticlePage} />
          <Route path="/forbidden" component={ForbiddenPage} />
          <Route component={NotFoundPage} />
        </Switch>
        <Footer t={t} />
        <Alerts dispatch={dispatch} messages={messages} />
      </PageContainer>
    );
  }
}

App.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subjectId: PropTypes.string,
      topicId: PropTypes.string,
    }).isRequired,
  }).isRequired,
  locale: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(MessageShape).isRequired,
  dispatch: PropTypes.func.isRequired,
  authenticated: PropTypes.bool.isRequired,
  userName: PropTypes.string,
};

App.childContextTypes = {
  locale: PropTypes.string,
};

const mapStateToProps = state => ({
  locale: getLocale(state),
  messages: getMessages(state),
  authenticated: state.session.authenticated,
  userName: state.session.user.name,
});

export default withRouter(connect(mapStateToProps)(injectT(App)));
