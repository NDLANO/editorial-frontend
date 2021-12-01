/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// import before all other imports component to make sure it is loaded before any emotion stuff.
import '../../style/index.css';

import { Component, createContext, ReactElement } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import loadable from '@loadable/component';
import { Content, PageContainer } from '@ndla/ui';
import { configureTracker } from '@ndla/tracker';
import { withRouter, Route, Switch, RouteComponentProps } from 'react-router-dom';
import { withTranslation, CustomWithTranslation } from 'react-i18next';
import Navigation from '../Masthead/components/Navigation';
import ErrorBoundary from '../../components/ErrorBoundary';
import { scheduleRenewal } from '../../util/authHelpers';

import Zendesk from './Zendesk';
import { LOCALE_VALUES } from '../../constants';
import config from '../../config';
import { MessagesProvider, useMessages } from '../Messages/MessagesProvider';
import Messages from '../Messages/Messages';
import { LicensesProvider } from '../Licenses/LicensesProvider';
import { getSessionStateFromLocalStorage, SessionProvider } from '../Session/SessionProvider';
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

export const FirstLoadContext = createContext(true);

interface InternalState {
  firstLoad: boolean;
}

interface Props {
  isClient?: boolean;
}

type ActualProps = Props & RouteComponentProps & CustomWithTranslation;

class App extends Component<ActualProps, InternalState> {
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
      locale: this.props.i18n.language,
    };
  }

  listenForHistoryChanges = () => {
    const { history } = this.props;
    history.listen(() => {
      this.setState({ firstLoad: false });
    });
  };

  render() {
    const { t } = this.props;

    return (
      <ErrorBoundary>
        <FirstLoadContext.Provider value={this.state.firstLoad}>
          <MessagesProvider>
            <LicensesProvider>
              <SessionProvider initialValue={getSessionStateFromLocalStorage()}>
                <AuthInitializer>
                  <PageContainer background>
                    <Zendesk />
                    <Helmet meta={[{ name: 'description', content: t('meta.description') }]} />
                    <Content>
                      <Navigation />
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
                          path="/structure/:root?/:child?/:children(.*)?"
                          component={StructurePage}
                        />
                        <Route path="/forbidden" component={ForbiddenPage} />
                        <Route component={NotFoundPage} />
                      </Switch>
                    </Content>
                    <Messages />
                  </PageContainer>
                </AuthInitializer>
              </SessionProvider>
            </LicensesProvider>
          </MessagesProvider>
        </FirstLoadContext.Provider>
      </ErrorBoundary>
    );
  }

  static childContextTypes = {
    locale: PropTypes.oneOf(LOCALE_VALUES),
  };
}

const AuthInitializer = ({ children }: { children: ReactElement }) => {
  const { createMessage } = useMessages();
  scheduleRenewal(createMessage, true);
  return children;
};

export default withRouter(withTranslation()(App));
