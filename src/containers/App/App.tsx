/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import '@fontsource/source-sans-pro/index.css';
import '@fontsource/source-sans-pro/400-italic.css';
import '@fontsource/source-sans-pro/300.css';
import '@fontsource/source-sans-pro/300-italic.css';
import '@fontsource/source-sans-pro/600.css';
import '@fontsource/source-sans-pro/700.css';
import '@fontsource/source-code-pro/index.css';
import '@fontsource/source-code-pro/400-italic.css';
import '@fontsource/source-code-pro/700.css';
import '@fontsource/source-serif-pro/index.css';
import '@fontsource/source-serif-pro/400-italic.css';
import '@fontsource/source-serif-pro/700.css';
// import before all other imports component to make sure it is loaded before any emotion stuff.
import '../../style/index.css';

import { ReactElement } from 'react';
import { Helmet } from 'react-helmet-async';
import loadable from '@loadable/component';
import { PageContainer } from '@ndla/ui';
import { Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import Navigation from '../Masthead/components/Navigation';
import ErrorBoundary from '../../components/ErrorBoundary';
import { scheduleRenewal } from '../../util/authHelpers';
import Zendesk from './Zendesk';
import config from '../../config';
import { MessagesProvider, useMessages } from '../Messages/MessagesProvider';
import Messages from '../Messages/Messages';
import { getSessionStateFromLocalStorage, SessionProvider } from '../Session/SessionProvider';
const Login = loadable(() => import('../Login/Login'));
const Logout = loadable(() => import('../Logout/Logout'));
const PrivateRoute = loadable(() => import('../PrivateRoute/PrivateRoute'));
const WelcomePage = loadable(() => import('../WelcomePage/WelcomePage'));
const SearchPage = loadable(() => import('./SearchPage'));
const NotFoundPage = loadable(() => import('../NotFoundPage/NotFoundPage'));
const ForbiddenPage = loadable(() => import('../ForbiddenPage/ForbiddenPage'));
const SubjectMatterPage = loadable(() => import('./SubjectMatterPage'));
const MediaPage = loadable(() => import('./MediaPage'));
const StructurePage = loadable(() => import('../StructurePage/StructurePage'));
const ProgrammePage = loadable(() => import('../StructurePage/ProgrammePage'));
const EditMarkupPage = loadable(() => import('../EditMarkupPage/EditMarkupPage'));
const PreviewDraftPage = loadable(() => import('../PreviewDraftPage/PreviewDraftPage'));
const NdlaFilm = loadable(() => import('../NdlaFilm/NdlaFilm'));
const ConceptPage = loadable(() => import('../ConceptPage/ConceptPage'));
const GlossPage = loadable(() => import('../GlossPage/GlossPage'));
const Subjectpage = loadable(() => import('../EditSubjectFrontpage/Subjectpage'));
const H5PPage = loadable(() => import('../H5PPage/H5PPage'));
const TaxonomyVersionsPage = loadable(() => import('../TaxonomyVersions/TaxonomyVersionsPage'));
const PublishRequestsPage = loadable(() => import('../PublishRequests/PublishRequestsPage'));
const NodeDiffPage = loadable(() => import('../NodeDiff/NodeDiffPage'));
const FrontpageEditPage = loadable(() => import('../FrontpageEditPage/FrontpageEditPage'));

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const App = () => {
  const { t } = useTranslation();

  return (
    <ErrorBoundary>
      <MessagesProvider>
        <SessionProvider initialValue={getSessionStateFromLocalStorage()}>
          <AuthInitializer>
            <PageContainer>
              <Zendesk />
              <Helmet meta={[{ name: 'description', content: t('meta.description') }]} />
              <StyledContent>
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
                  <Route path="/concept/*" element={<PrivateRoute component={<ConceptPage />} />} />
                  <Route path="/gloss/*" element={<PrivateRoute component={<GlossPage />} />} />
                  <Route path="/preview/:draftId/:language/*" element={<PreviewDraftPage />} />
                  <Route path="/media/*" element={<PrivateRoute component={<MediaPage />} />} />
                  <Route path="/film/*" element={<PrivateRoute component={<NdlaFilm />} />} />
                  <Route path="/h5p/*" element={<PrivateRoute component={<H5PPage />} />} />
                  <Route
                    path="/structure/*"
                    element={<PrivateRoute component={<StructurePage />} />}
                  />
                  <Route
                    path="/programme/*"
                    element={<PrivateRoute component={<ProgrammePage />} />}
                  />
                  <Route
                    path="/taxonomyVersions/*"
                    element={<PrivateRoute component={<TaxonomyVersionsPage />} />}
                  />
                  <Route
                    path="/publishRequests/*"
                    element={<PrivateRoute component={<PublishRequestsPage />} />}
                  />
                  <Route
                    path="/nodeDiff/:nodeId"
                    element={<PrivateRoute component={<NodeDiffPage />} />}
                  />
                  <Route
                    path="/frontpage/"
                    element={<PrivateRoute component={<FrontpageEditPage />} />}
                  />
                  <Route path="/forbidden" element={<ForbiddenPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </StyledContent>
              <Messages />
            </PageContainer>
          </AuthInitializer>
        </SessionProvider>
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
