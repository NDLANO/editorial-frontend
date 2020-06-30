/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// import before all other imports component to make sure it is loaded befor any emotion stuff.
import '../../style/index.css';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Content, PageContainer } from '@ndla/ui';
import { withRouter, Route, Switch } from 'react-router-dom';
import { injectT } from '@ndla/i18n';
import { MessageShape } from '../../shapes';
import Navigation from '../Masthead/components/Navigation';
import { getLocale } from '../../modules/locale/locale';
import { getMessages } from '../Messages/messagesSelectors';
import Messages from '../Messages/Messages';
import Login from '../Login/Login';
import Logout from '../Logout/Logout';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import WelcomePage from '../WelcomePage/WelcomePage';
import SearchPage from './SearchPage';
import AgreementPage from '../AgreementPage/AgreementPage';
import NotFoundPage from '../NotFoundPage/NotFoundPage';
import ForbiddenPage from '../ForbiddenPage/ForbiddenPage';
import SubjectMatterPage from './SubjectMatterPage';
import MediaPage from './MediaPage';
import StructurePage from '../StructurePage/StructurePage';
import ErrorBoundary from '../../components/ErrorBoundary';
import EditMarkupPage from '../EditMarkupPage/EditMarkupPage';
import PreviewDraftPage from '../PreviewDraftPage/PreviewDraftPage';
import NdlaFilmEditor from '../NdlaFilm/NdlaFilmEditor';
import ConceptPage from '../ConceptPage/ConceptPage';
import H5PPage from '../H5PPage/H5PPage';
import Subjectpage from '../EditSubjectFrontpage/Subjectpage';

export const FirstLoadContext = React.createContext(true);

export class App extends React.Component {
  constructor() {
    super();
    this.state = {
      firstLoad: true,
    };
  }

  componentDidMount() {
    this.listenForHistoryChanges();
  }

  getChildContext() {
    return {
      locale: this.props.locale,
    };
  }

  listenForHistoryChanges = () => {
    const { history } = this.props;
    history.listen(() => {
      this.setState({ firstLoad: false });
    });
  };

  render() {
    const {
      authenticated,
      dispatch,
      locale,
      messages,
      t,
      userName,
    } = this.props;
    return (
      <ErrorBoundary>
        <FirstLoadContext.Provider value={this.state.firstLoad}>
          <PageContainer background>
            <Helmet
              meta={[{ name: 'description', content: t('meta.description') }]}
            />
            <Content>
              <Navigation authenticated={authenticated} userName={userName} />
              <Switch>
                <Route
                  path="/"
                  exact
                  component={() => <WelcomePage locale={locale} />}
                />
                <Route path="/login" component={Login} />
                <Route path="/logout" component={Logout} />
                <PrivateRoute path="/subjectpage" component={Subjectpage} />
                <PrivateRoute path="/search" component={SearchPage} />
                <PrivateRoute
                  path="/subject-matter"
                  component={SubjectMatterPage}
                />
                <PrivateRoute
                  path="/edit-markup/:draftId/:language"
                  component={EditMarkupPage}
                />
                <PrivateRoute path="/concept" component={ConceptPage} />

                <Route
                  path="/preview/:draftId/:language"
                  component={PreviewDraftPage}
                />
                <PrivateRoute path="/media" component={MediaPage} />
                <PrivateRoute path="/agreement" component={AgreementPage} />
                <PrivateRoute path="/film" component={NdlaFilmEditor} />
                <PrivateRoute path="/h5p" component={H5PPage} />
                <PrivateRoute
                  path="/structure/:subject?/:topic?/:subtopics(.*)?"
                  component={StructurePage}
                />
                <Route path="/forbidden" component={ForbiddenPage} />
                <Route component={NotFoundPage} />
              </Switch>
            </Content>
            <Messages dispatch={dispatch} messages={messages} />
          </PageContainer>
        </FirstLoadContext.Provider>
      </ErrorBoundary>
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
  history: PropTypes.shape({
    listen: PropTypes.func.isRequired,
  }).isRequired,
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
