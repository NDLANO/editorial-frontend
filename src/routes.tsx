/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { RouteObject } from "react-router-dom";
import H5pRedirect from "./components/H5pRedirect";
import { Layout } from "./components/Page/Layout";
import { ErrorElement } from "./components/RouteErrorElement";
import { ArticleRedirect } from "./containers/ArticlePage/ArticleRedirect";
import CreateFrontpageArticle from "./containers/ArticlePage/FrontpageArticlePage/CreateFrontpageArticle";
import { EditFrontpageArticlePage } from "./containers/ArticlePage/FrontpageArticlePage/EditFrontpageArticle";
import { GenericArticleRedirect } from "./containers/ArticlePage/GenericArticleRedirect";
import CreateLearningResource from "./containers/ArticlePage/LearningResourcePage/CreateLearningResource";
import { EditLearningResourcePage } from "./containers/ArticlePage/LearningResourcePage/EditLearningResource";
import CreateTopicArticle from "./containers/ArticlePage/TopicArticlePage/CreateTopicArticle";
import EditTopicArticle from "./containers/ArticlePage/TopicArticlePage/EditTopicArticle";
import { AudioRedirect } from "./containers/AudioUploader/AudioRedirect";
import { CreateAudioPage } from "./containers/AudioUploader/CreateAudio";
import { EditAudioPage } from "./containers/AudioUploader/EditAudio";
import ComparePage from "./containers/ComparePage/ComparePage";
import { ConceptRedirect } from "./containers/ConceptPage/ConceptRedirect";
import { CreateConceptPage } from "./containers/ConceptPage/CreateConcept";
import { EditConceptPage } from "./containers/ConceptPage/EditConcept";
import EditMarkupPage from "./containers/EditMarkupPage/EditMarkupPage";
import CreateSubjectpage from "./containers/EditSubjectFrontpage/CreateSubjectpage";
import EditSubjectpage from "./containers/EditSubjectFrontpage/EditSubjectpage";
import ForbiddenPage from "./containers/ForbiddenPage/ForbiddenPage";
import FrontpageEditPage from "./containers/FrontpageEditPage/FrontpageEditPage";
import { CreateGlossPage } from "./containers/GlossPage/CreateGloss";
import { EditGlossPage } from "./containers/GlossPage/EditGloss";
import { GlossRedirect } from "./containers/GlossPage/GlossRedirect";
import { CreateImagePage } from "./containers/ImageUploader/CreateImage";
import { EditImagePage } from "./containers/ImageUploader/EditImage";
import { ImageRedirect } from "./containers/ImageUploader/ImageRedirect";
import Login from "./containers/Login/Login";
import LoginFailure from "./containers/Login/LoginFailure";
import LoginProviders from "./containers/Login/LoginProviders";
import LoginSuccess from "./containers/Login/LoginSuccess";
import LogoutFederated from "./containers/Logout/LogoutFederated";
import LogoutProviders from "./containers/Logout/LogoutProviders";
import LogoutSession from "./containers/Logout/LogoutSession";
import NdlaFilmEditor from "./containers/NdlaFilm/NdlaFilmEditor";
import NodeDiffPage from "./containers/NodeDiff/NodeDiffPage";
import NotFoundPage from "./containers/NotFoundPage/NotFoundPage";
import { CreatePodcastPage } from "./containers/Podcast/CreatePodcast";
import { EditPodcastPage } from "./containers/Podcast/EditPodcast";
import { PodcastRedirect } from "./containers/Podcast/PodcastRedirect";
import { CreatePodcastSeriesPage } from "./containers/PodcastSeries/CreatePodcastSeries";
import { EditPodcastSeriesPage } from "./containers/PodcastSeries/EditPodcastSeries";
import { PodcastSeriesRedirect } from "./containers/PodcastSeries/PodcastSeriesRedirect";
import PreviewDraftPage from "./containers/PreviewDraftPage/PreviewDraftPage";
import PrivateRoute from "./containers/PrivateRoute/PrivateRoute";
import { AudioSearch } from "./containers/SearchPage/AudioSearch";
import { ContentSearch } from "./containers/SearchPage/ContentSearch";
import { ImageSearch } from "./containers/SearchPage/ImageSearch";
import { PodcastSeriesSearch } from "./containers/SearchPage/PodcastSeriesSearch";
import { SearchPageHeader } from "./containers/SearchPage/SearchPageHeader";
import ProgrammePage from "./containers/StructurePage/ProgrammePage";
import StructurePage from "./containers/StructurePage/StructurePage";
import TaxonomyVersionsPage from "./containers/TaxonomyVersions/TaxonomyVersionsPage";
import UpdateCodesPage from "./containers/UpdateCodes/UpdateCodesPage";
import WelcomePage from "./containers/WelcomePage/WelcomePage";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        element: <WelcomePage />,
      },
      {
        path: "login",
        children: [
          {
            index: true,
            element: <LoginProviders />,
          },
          {
            path: "*",
            element: <Login />,
          },
          {
            path: "success/*",
            element: <LoginSuccess />,
          },
          {
            path: "failure",
            element: <LoginFailure />,
          },
        ],
      },
      {
        path: "logout",
        children: [
          {
            index: true,
            element: <LogoutProviders />,
          },
          {
            path: "federated",
            element: <LogoutFederated />,
          },
          {
            path: "session",
            element: <LogoutSession />,
          },
        ],
      },
      {
        path: "subjectpage",
        children: [
          {
            path: ":elementId/:subjectpageId/edit/:selectedLanguage",
            element: <PrivateRoute component={<EditSubjectpage />} />,
          },
          {
            path: ":elementId/new/:selectedLanguage",
            element: <PrivateRoute component={<CreateSubjectpage />} />,
          },
        ],
      },
      {
        path: "search",
        element: <PrivateRoute component={<SearchPageHeader />} />,
        children: [
          {
            path: "content/*",
            element: <PrivateRoute component={<ContentSearch />} />,
          },
          {
            path: "audio/*",
            element: <PrivateRoute component={<AudioSearch />} />,
          },
          {
            path: "image/*",
            element: <PrivateRoute component={<ImageSearch />} />,
          },
          {
            path: "podcast-series/*",
            element: <PrivateRoute component={<PodcastSeriesSearch />} />,
          },
        ],
      },
      {
        path: "subject-matter",
        children: [
          {
            path: "topic-article",
            children: [
              {
                path: "new",
                element: <PrivateRoute component={<CreateTopicArticle />} />,
              },
              {
                path: ":id/edit",
                element: <PrivateRoute component={<ArticleRedirect />} />,
                children: [
                  {
                    path: ":selectedLanguage?",
                    element: <PrivateRoute component={<EditTopicArticle />} />,
                  },
                ],
              },
            ],
          },
          {
            path: "learning-resource",
            children: [
              {
                path: "new",
                element: <PrivateRoute component={<CreateLearningResource />} />,
              },
              {
                path: ":id/edit",
                element: <PrivateRoute component={<ArticleRedirect />} />,
                children: [
                  {
                    path: ":selectedLanguage?",
                    element: <PrivateRoute component={<EditLearningResourcePage />} />,
                  },
                ],
              },
            ],
          },
          {
            path: "frontpage-article",
            children: [
              {
                path: "new",
                element: <PrivateRoute component={<CreateFrontpageArticle />} />,
              },
              {
                path: ":id/edit",
                element: <PrivateRoute component={<ArticleRedirect />} />,
                children: [
                  {
                    path: ":selectedLanguage?",
                    element: <PrivateRoute component={<EditFrontpageArticlePage />} />,
                  },
                ],
              },
            ],
          },
          {
            path: "article/:id",
            element: <PrivateRoute component={<GenericArticleRedirect />} />,
          },
        ],
      },
      {
        path: "edit-markup/:draftId/:language/*",
        element: <PrivateRoute component={<EditMarkupPage />} />,
      },
      {
        path: "concept",
        children: [
          {
            path: "new",
            element: <PrivateRoute component={<CreateConceptPage />} />,
          },
          {
            path: ":id/edit",
            element: <PrivateRoute component={<ConceptRedirect />} />,
            children: [
              {
                path: ":selectedLanguage?",
                element: <PrivateRoute component={<EditConceptPage />} />,
              },
            ],
          },
        ],
      },
      {
        path: "gloss",
        children: [
          {
            path: "new",
            element: <PrivateRoute component={<CreateGlossPage />} />,
          },
          {
            path: ":id/edit",
            element: <PrivateRoute component={<GlossRedirect />} />,
            children: [
              {
                path: ":selectedLanguage?",
                element: <PrivateRoute component={<EditGlossPage />} />,
              },
            ],
          },
        ],
      },
      {
        path: "preview/:draftId/:language/*",
        element: <PrivateRoute component={<PreviewDraftPage />} />,
      },
      {
        path: "compare/:draftId/:language/*",
        element: <PrivateRoute component={<ComparePage />} />,
      },
      {
        path: "media",
        children: [
          {
            path: "image-upload",
            children: [
              {
                path: "new",
                element: <PrivateRoute component={<CreateImagePage />} />,
              },
              {
                path: ":id/edit",
                element: <PrivateRoute component={<ImageRedirect />} />,
                children: [
                  {
                    path: ":selectedLanguage?",
                    element: <PrivateRoute component={<EditImagePage />} />,
                  },
                ],
              },
            ],
          },
          {
            path: "audio-upload",
            children: [
              {
                path: "new",
                element: <PrivateRoute component={<CreateAudioPage />} />,
              },
              {
                path: ":id/edit",
                element: <PrivateRoute component={<AudioRedirect />} />,
                children: [
                  {
                    path: ":selectedLanguage?",
                    element: <PrivateRoute component={<EditAudioPage />} />,
                  },
                ],
              },
            ],
          },
          {
            path: "podcast-upload",
            children: [
              {
                path: "new",
                element: <PrivateRoute component={<CreatePodcastPage />} />,
              },
              {
                path: ":id/edit",
                element: <PrivateRoute component={<PodcastRedirect />} />,
                children: [
                  {
                    path: ":selectedLanguage?",
                    element: <PrivateRoute component={<EditPodcastPage />} />,
                  },
                ],
              },
            ],
          },

          {
            path: "podcast-series",
            children: [
              {
                path: "new",
                element: <PrivateRoute component={<CreatePodcastSeriesPage />} />,
              },
              {
                path: ":id/edit",
                element: <PrivateRoute component={<PodcastSeriesRedirect />} />,
                children: [
                  {
                    path: ":selectedLanguage?",
                    element: <PrivateRoute component={<EditPodcastSeriesPage />} />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "film/:selectedLanguage?",
        element: <PrivateRoute component={<NdlaFilmEditor />} />,
      },
      {
        path: "structure/*",
        element: <PrivateRoute component={<StructurePage />} />,
      },
      {
        path: "programme/*",
        element: <PrivateRoute component={<ProgrammePage />} />,
      },
      {
        path: "taxonomyVersions/*",
        element: <PrivateRoute component={<TaxonomyVersionsPage />} />,
      },
      {
        path: "nodeDiff/:nodeId",
        element: <PrivateRoute component={<NodeDiffPage />} />,
      },
      {
        path: "frontpage",
        element: <PrivateRoute component={<FrontpageEditPage />} />,
      },
      {
        path: "updateCodes",
        element: <PrivateRoute component={<UpdateCodesPage />} />,
      },
      {
        path: "forbidden",
        element: <ForbiddenPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  {
    path: "/h5p",
    errorElement: <ErrorElement />,
    element: <PrivateRoute component={<H5pRedirect />} />,
  },
];
