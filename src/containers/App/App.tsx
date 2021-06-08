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
// @ts-ignore
import { Content, PageContainer } from '@ndla/ui';
import { withRouter, Route, Switch, RouteComponentProps } from 'react-router-dom';
import { injectT, tType } from '@ndla/i18n';
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
import NdlaFilm from '../NdlaFilm/NdlaFilm';
import ConceptPage from '../ConceptPage/ConceptPage';
import H5PPage from '../H5PPage/H5PPage';
import Subjectpage from '../EditSubjectFrontpage/Subjectpage';
import Zendesk from './Zendesk';
import { LocaleType, ReduxState } from '../../interfaces';
import { LOCALE_VALUES } from '../../constants';

export const FirstLoadContext = React.createContext(true);
export const LocaleContext = React.createContext<LocaleType>('nb');
export const UserAccessContext = React.createContext<string | undefined>(undefined);

interface InternalState {
  firstLoad: boolean;
}

interface Props {}

const mapStateToProps = (state: ReduxState) => ({
  locale: getLocale(state),
  messages: getMessages(state),
  authenticated: state.session.authenticated,
  userName: state.session.user.name,
  userAccess: state.session.user.scope,
});

const reduxConnector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof reduxConnector>;

type ActualProps = Props & RouteComponentProps & PropsFromRedux & tType;

class App extends React.Component<ActualProps, InternalState> {
  constructor(props: ActualProps) {
    super(props);
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
    const { authenticated, dispatch, locale, messages, t, userName, userAccess } = this.props;

    return (
      <ErrorBoundary>
        <UserAccessContext.Provider value={userAccess}>
          <LocaleContext.Provider value={locale}>
            <FirstLoadContext.Provider value={this.state.firstLoad}>
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
              </PageContainer>
            </FirstLoadContext.Provider>
          </LocaleContext.Provider>
        </UserAccessContext.Provider>
      </ErrorBoundary>
    );
  }

  static childContextTypes = {
    locale: PropTypes.oneOf(LOCALE_VALUES),
  };
}

export default reduxConnector(withRouter(injectT(App)));
