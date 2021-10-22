/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// import before all other imports component to make sure it is loaded before any emotion stuff.
import '../../style/index.css';

import React from 'react';
import PropTypes from 'prop-types';
import { connect, ConnectedProps } from 'react-redux';
import Helmet from 'react-helmet';
import loadable from '@loadable/component';
import { Content, PageContainer } from '@ndla/ui';
import { configureTracker } from '@ndla/tracker';
import { withRouter, Route, Switch, RouteComponentProps } from 'react-router-dom';
import { withTranslation, WithTranslation } from 'react-i18next';
import Navigation from '../Masthead/components/Navigation';
import { getLocale } from '../../modules/locale/locale';
import { getMessages } from '../Messages/messagesSelectors';
import Messages from '../Messages/Messages';
import ErrorBoundary from '../../components/ErrorBoundary';

import Zendesk from './Zendesk';
import { LocaleType, ReduxState } from '../../interfaces';
import { LOCALE_VALUES } from '../../constants';
import config from '../../config';
import { MessagesProvider } from '../Messages/MessagesProvider';
import { NewMessages } from '../Messages/NewMessages';
const Login = loadable(() => import('../Login/Login'));
const Logout = loadable(() => import('../Logout/Logout'));
const PrivateRoute = loadable(() => import('../PrivateRoute/PrivateRoute'));
const WelcomePage = loadable(() => import('../WelcomePage/WelcomePage'));
const SearchPage = loadable(() => import('./SearchPage'));
const AgreementPage = loadable(() => import('../AgreementPage/AgreementPage'));
const NotFoundPage = loadable(() => import('../NotFoundPage/NotFoundPage'));
const ForbiddenPage = loadable(() => import('../ForbiddenPage/ForbiddenPage'));
const SubjectMatterPage = loadable(() => import('./SubjectMatterPage'));
const MediaPage = loadable(() => import('./MediaPage'));
const StructurePage = loadable(() => import('../StructurePage/StructurePage'));
const EditMarkupPage = loadable(() => import('../EditMarkupPage/EditMarkupPage'));
const PreviewDraftPage = loadable(() => import('../PreviewDraftPage/PreviewDraftPage'));
const NdlaFilm = loadable(() => import('../NdlaFilm/NdlaFilm'));
const ConceptPage = loadable(() => import('../ConceptPage/ConceptPage'));
const Subjectpage = loadable(() => import('../EditSubjectFrontpage/Subjectpage'));
const H5PPage = loadable(() => import('../H5PPage/H5PPage'));

export const FirstLoadContext = React.createContext(true);
export const LocaleContext = React.createContext<LocaleType>('nb');
export const UserAccessContext = React.createContext<string | undefined>(undefined);
export const AuthenticatedContext = React.createContext<boolean>(false);

interface InternalState {
  firstLoad: boolean;
}

interface Props {
  isClient?: boolean;
}

const mapStateToProps = (state: ReduxState) => ({
  locale: getLocale(state),
  messages: getMessages(state),
  authenticated: state.session.authenticated,
  userName: state.session.user.name,
  userAccess: state.session.user.scope,
});

const reduxConnector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof reduxConnector>;

type ActualProps = Props & RouteComponentProps & PropsFromRedux & WithTranslation;

class App extends React.Component<ActualProps, InternalState> {
  constructor(props: ActualProps) {
    super(props);
    if (props.isClient) {
      configureTracker({
        listen: props.history.listen,
        gaTrackingId: config.gaTrackingId,
        googleTagManagerId: config.googleTagManagerId,
      });
    }
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
    const { authenticated, dispatch, messages, t, userName, userAccess } = this.props;

    return (
      <ErrorBoundary>
        <UserAccessContext.Provider value={userAccess}>
          <AuthenticatedContext.Provider value={authenticated}>
            <LocaleContext.Provider value={this.props.i18n.language as LocaleType}>
              <FirstLoadContext.Provider value={this.state.firstLoad}>
                <MessagesProvider>
                  <PageContainer background>
                    <Zendesk authenticated={authenticated} />
                    <Helmet meta={[{ name: 'description', content: t('meta.description') }]} />
                    <Content>
                      <Navigation authenticated={authenticated} userName={userName} />
                      <Switch>
                        <Route path="/" exact component={WelcomePage} />
                        <Route path="/login" component={Login} />
                        <Route path="/logout" component={Logout} />
                        <PrivateRoute path="/subjectpage" component={Subjectpage} />
                        <PrivateRoute path="/search" component={SearchPage} />
                        <PrivateRoute path="/subject-matter" component={SubjectMatterPage} />
                        <PrivateRoute
                          path="/edit-markup/:draftId/:language"
                          component={EditMarkupPage}
                        />
                        <PrivateRoute path="/concept" component={ConceptPage} />
                        <Route path="/preview/:draftId/:language" component={PreviewDraftPage} />
                        <PrivateRoute path="/media" component={MediaPage} />
                        <PrivateRoute path="/agreement" component={AgreementPage} />
                        <PrivateRoute path="/film" component={NdlaFilm} />
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
                    <NewMessages />
                  </PageContainer>
                </MessagesProvider>
              </FirstLoadContext.Provider>
            </LocaleContext.Provider>
          </AuthenticatedContext.Provider>
        </UserAccessContext.Provider>
      </ErrorBoundary>
    );
  }

  static childContextTypes = {
    locale: PropTypes.oneOf(LOCALE_VALUES),
  };
}

export default reduxConnector(withRouter(withTranslation()(App)));
