/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// import before all other imports component to make sure it is loaded before any emotion stuff.
import '../../style/index.css';

import { ReactElement, useContext, useEffect } from 'react';
import Helmet from 'react-helmet';
import loadable from '@loadable/component';
import { History } from 'history';
import { Content, PageContainer } from '@ndla/ui';
import { configureTracker } from '@ndla/tracker';
import { Route, Routes, UNSAFE_NavigationContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navigation from '../Masthead/components/Navigation';
import ErrorBoundary from '../../components/ErrorBoundary';
import { scheduleRenewal } from '../../util/authHelpers';
import Zendesk from './Zendesk';
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

interface Props {
  isClient?: boolean;
}

const App = ({ isClient }: Props) => {
  const { t } = useTranslation();
  // Listen has been partially removed.
  const navigator = useContext(UNSAFE_NavigationContext).navigator as History;

  useEffect(() => {
    if (isClient) {
      configureTracker({
        listen: navigator.listen,
        gaTrackingId: config.gaTrackingId,
        googleTagManagerId: config.googleTagManagerId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ErrorBoundary>
      <MessagesProvider>
        <LicensesProvider>
          <SessionProvider initialValue={getSessionStateFromLocalStorage()}>
            <AuthInitializer>
              <PageContainer background>
                <Zendesk />
                <Helmet meta={[{ name: 'description', content: t('meta.description') }]} />
                <Content>
                  <Navigation />
                  <Routes>
                    <Route path="/" element={<WelcomePage />} />
                    <Route path="login/*" element={<Login />} />
                    <Route path="logout/*" element={<Logout />} />
                    <Route
                      path="/subjectpage/*"
                      element={<PrivateRoute component={<Subjectpage />} />}
                    />
                    <Route path="search/*" element={<PrivateRoute component={<SearchPage />} />} />
                    <Route
                      path="subject-matter/*"
                      element={<PrivateRoute component={<SubjectMatterPage />} />}
                    />
                    <Route
                      path="/edit-markup/:draftId/:language/*"
                      element={<PrivateRoute component={<EditMarkupPage />} />}
                    />
                    <Route
                      path="/concept/*"
                      element={<PrivateRoute component={<ConceptPage />} />}
                    />
                    <Route path="/preview/:draftId/:language/*" element={<PreviewDraftPage />} />
                    <Route path="/media/*" element={<PrivateRoute component={<MediaPage />} />} />
                    <Route
                      path="/agreement/*"
                      element={<PrivateRoute component={<AgreementPage />} />}
                    />
                    <Route path="/film/*" element={<PrivateRoute component={<NdlaFilm />} />} />
                    <Route path="/h5p/*" element={<PrivateRoute component={<H5PPage />} />} />
                    <Route
                      path="/structure/*"
                      element={<PrivateRoute component={<StructurePage />} />}
                    />
                    <Route path="/forbidden" element={<ForbiddenPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Content>
                <Messages />
              </PageContainer>
            </AuthInitializer>
          </SessionProvider>
        </LicensesProvider>
      </MessagesProvider>
    </ErrorBoundary>
  );
};

const AuthInitializer = ({ children }: { children: ReactElement }) => {
  const { createMessage } = useMessages();
  scheduleRenewal(createMessage, true);
  return children;
};

export default App;
