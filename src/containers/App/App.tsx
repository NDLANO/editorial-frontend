/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "@fontsource/source-sans-pro/index.css";
import "@fontsource/source-sans-pro/400-italic.css";
import "@fontsource/source-sans-pro/300.css";
import "@fontsource/source-sans-pro/300-italic.css";
import "@fontsource/source-sans-pro/600.css";
import "@fontsource/source-sans-pro/700.css";
import "@fontsource/source-code-pro/index.css";
import "@fontsource/source-code-pro/400-italic.css";
import "@fontsource/source-code-pro/700.css";
import "@fontsource/source-serif-pro/index.css";
import "@fontsource/source-serif-pro/400-italic.css";
import "@fontsource/source-serif-pro/700.css";
// import before all other imports component to make sure it is loaded before any emotion stuff.
import "../../style/index.css";

import { ReactElement } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Route, Routes } from "react-router-dom";
import styled from "@emotion/styled";
import { PageContainer } from "@ndla/ui";
import MediaPage from "./MediaPage";
import SearchPage from "./SearchPage";
import SubjectMatterPage from "./SubjectMatterPage";
import ErrorBoundary from "../../components/ErrorBoundary";
import { scheduleRenewal } from "../../util/authHelpers";
import ComparePage from "../ComparePage/ComparePage";
import ConceptPage from "../ConceptPage/ConceptPage";
import EditMarkupPage from "../EditMarkupPage/EditMarkupPage";
import Subjectpage from "../EditSubjectFrontpage/Subjectpage";
import ForbiddenPage from "../ForbiddenPage/ForbiddenPage";
import FrontpageEditPage from "../FrontpageEditPage/FrontpageEditPage";
import GlossPage from "../GlossPage/GlossPage";
import H5PPage from "../H5PPage/H5PPage";
import Login from "../Login/Login";
import Logout from "../Logout/Logout";
import Navigation from "../Masthead/components/Navigation";
import Messages from "../Messages/Messages";
import { MessagesProvider, useMessages } from "../Messages/MessagesProvider";
import NdlaFilm from "../NdlaFilm/NdlaFilm";
import NodeDiffPage from "../NodeDiff/NodeDiffPage";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import PreviewDraftPage from "../PreviewDraftPage/PreviewDraftPage";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import { getSessionStateFromLocalStorage, SessionProvider } from "../Session/SessionProvider";
import ProgrammePage from "../StructurePage/ProgrammePage";
import StructurePage from "../StructurePage/StructurePage";
import TaxonomyVersionsPage from "../TaxonomyVersions/TaxonomyVersionsPage";
import WelcomePage from "../WelcomePage/WelcomePage";

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
              <Helmet meta={[{ name: "description", content: t("meta.description") }]} />
              <StyledContent>
                <Navigation />
                <Routes>
                  <Route path="/" element={<WelcomePage />} />
                  <Route path="login/*" element={<Login />} />
                  <Route path="logout/*" element={<Logout />} />
                  <Route path="/subjectpage/*" element={<PrivateRoute component={<Subjectpage />} />} />
                  <Route path="search/*" element={<PrivateRoute component={<SearchPage />} />} />
                  <Route path="subject-matter/*" element={<PrivateRoute component={<SubjectMatterPage />} />} />
                  <Route
                    path="/edit-markup/:draftId/:language/*"
                    element={<PrivateRoute component={<EditMarkupPage />} />}
                  />
                  <Route path="/concept/*" element={<PrivateRoute component={<ConceptPage />} />} />
                  <Route path="/gloss/*" element={<PrivateRoute component={<GlossPage />} />} />
                  <Route path="/preview/:draftId/:language/*" element={<PreviewDraftPage />} />
                  <Route path="/compare/:draftId/:language/*" element={<ComparePage />} />
                  <Route path="/media/*" element={<PrivateRoute component={<MediaPage />} />} />
                  <Route path="/film/*" element={<PrivateRoute component={<NdlaFilm />} />} />
                  <Route path="/h5p/*" element={<PrivateRoute component={<H5PPage />} />} />
                  <Route path="/structure/*" element={<PrivateRoute component={<StructurePage />} />} />
                  <Route path="/programme/*" element={<PrivateRoute component={<ProgrammePage />} />} />
                  <Route path="/taxonomyVersions/*" element={<PrivateRoute component={<TaxonomyVersionsPage />} />} />
                  <Route path="/nodeDiff/:nodeId" element={<PrivateRoute component={<NodeDiffPage />} />} />
                  <Route path="/frontpage/" element={<PrivateRoute component={<FrontpageEditPage />} />} />
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
