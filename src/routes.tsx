/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { RouteObject } from "react-router";
import { Layout } from "./components/Page/Layout";
import { ErrorElement } from "./components/RouteErrorElement";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorElement />,
    children: [
      {
        index: true,
        lazy: () => import("./containers/WelcomePage/WelcomePage"),
      },
      {
        path: "login",
        children: [
          {
            index: true,
            lazy: () => import("./containers/Login/LoginProviders"),
          },
          {
            path: "*",
            lazy: () => import("./containers/Login/Login"),
          },
          {
            path: "success/*",
            lazy: () => import("./containers/Login/LoginSuccess"),
          },
          {
            path: "failure",
            lazy: () => import("./containers/Login/LoginFailure"),
          },
        ],
      },
      {
        path: "logout",
        children: [
          {
            index: true,
            lazy: () => import("./containers/Logout/LogoutProviders"),
          },
          {
            path: "federated",
            lazy: () => import("./containers/Logout/LogoutFederated"),
          },
          {
            path: "session",
            lazy: () => import("./containers/Logout/LogoutSession"),
          },
        ],
      },
      {
        path: "subjectpage",
        children: [
          {
            path: ":elementId/:subjectpageId/edit/:selectedLanguage",
            lazy: () => import("./containers/EditSubjectFrontpage/EditSubjectpage"),
          },
          {
            path: ":elementId/new/:selectedLanguage",
            lazy: () => import("./containers/EditSubjectFrontpage/CreateSubjectpage"),
          },
        ],
      },
      {
        path: "search",
        lazy: () => import("./containers/SearchPage/SearchPageHeader"),
        children: [
          {
            path: "content/*",
            lazy: () => import("./containers/SearchPage/ContentSearch"),
          },
          {
            path: "audio/*",
            lazy: () => import("./containers/SearchPage/AudioSearch"),
          },
          {
            path: "image/*",
            lazy: () => import("./containers/SearchPage/ImageSearch"),
          },
          {
            path: "podcast-series/*",
            lazy: () => import("./containers/SearchPage/PodcastSeriesSearch"),
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
                lazy: () => import("./containers/ArticlePage/TopicArticlePage/CreateTopicArticle"),
              },
              {
                path: ":id/edit",
                lazy: () => import("./containers/ArticlePage/ArticleRedirect"),
                children: [
                  {
                    path: ":selectedLanguage?",
                    lazy: () => import("./containers/ArticlePage/TopicArticlePage/EditTopicArticle"),
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
                lazy: () => import("./containers/ArticlePage/LearningResourcePage/CreateLearningResource"),
              },
              {
                path: ":id/edit",
                lazy: () => import("./containers/ArticlePage/ArticleRedirect"),
                children: [
                  {
                    path: ":selectedLanguage?",
                    lazy: () => import("./containers/ArticlePage/LearningResourcePage/EditLearningResource"),
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
                lazy: () => import("./containers/ArticlePage/FrontpageArticlePage/CreateFrontpageArticle"),
              },
              {
                path: ":id/edit",
                lazy: () => import("./containers/ArticlePage/ArticleRedirect"),
                children: [
                  {
                    path: ":selectedLanguage?",
                    lazy: () => import("./containers/ArticlePage/FrontpageArticlePage/EditFrontpageArticle"),
                  },
                ],
              },
            ],
          },
          {
            path: "article/:id",
            lazy: () => import("./containers/ArticlePage/GenericArticleRedirect"),
          },
        ],
      },
      {
        path: "edit-markup/:draftId/:language/*",
        lazy: () => import("./containers/EditMarkupPage/EditMarkupPage"),
      },
      {
        path: "concept",
        children: [
          {
            path: "new",
            lazy: () => import("./containers/ConceptPage/CreateConcept"),
          },
          {
            path: ":id/edit",
            lazy: () => import("./containers/ConceptPage/ConceptRedirect"),
            children: [
              {
                path: ":selectedLanguage?",
                lazy: () => import("./containers/ConceptPage/EditConcept"),
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
            lazy: () => import("./containers/GlossPage/CreateGloss"),
          },
          {
            path: ":id/edit",
            lazy: () => import("./containers/GlossPage/GlossRedirect"),
            children: [
              {
                path: ":selectedLanguage?",
                lazy: () => import("./containers/GlossPage/EditGloss"),
              },
            ],
          },
        ],
      },
      {
        path: "preview/:draftId/:language/*",
        lazy: () => import("./containers/PreviewDraftPage/PreviewDraftPage"),
      },
      {
        path: "compare/:draftId/:language/*",
        lazy: () => import("./containers/ComparePage/ComparePage"),
      },
      {
        path: "media",
        children: [
          {
            path: "image-upload",
            children: [
              {
                path: "new",
                lazy: () => import("./containers/ImageUploader/CreateImage"),
              },
              {
                path: ":id/edit",
                lazy: () => import("./containers/ImageUploader/ImageRedirect"),
                children: [
                  {
                    path: ":selectedLanguage?",
                    lazy: () => import("./containers/ImageUploader/EditImage"),
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
                lazy: () => import("./containers/AudioUploader/CreateAudio"),
              },
              {
                path: ":id/edit",
                lazy: () => import("./containers/AudioUploader/AudioRedirect"),
                children: [
                  {
                    path: ":selectedLanguage?",
                    lazy: () => import("./containers/AudioUploader/EditAudio"),
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
                lazy: () => import("./containers/Podcast/CreatePodcast"),
              },
              {
                path: ":id/edit",
                lazy: () => import("./containers/Podcast/PodcastRedirect"),
                children: [
                  {
                    path: ":selectedLanguage?",
                    lazy: () => import("./containers/Podcast/EditPodcast"),
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
                lazy: () => import("./containers/PodcastSeries/CreatePodcastSeries"),
              },
              {
                path: ":id/edit",
                lazy: () => import("./containers/PodcastSeries/PodcastSeriesRedirect"),
                children: [
                  {
                    path: ":selectedLanguage?",
                    lazy: () => import("./containers/PodcastSeries/EditPodcastSeries"),
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "/learningpath/:id/edit/:language",
        lazy: () => import("./containers/LearningpathPage/EditLearningpathPage"),
      },
      {
        path: "/learningpath/new",
        lazy: () => import("./containers/LearningpathPage/CreateLearningpathPage"),
      },
      {
        path: "/learningpath/:id/preview/:language/:stepId?",
        lazy: () => import("./containers/LearningpathPreviewPage/LearningpathPreviewPage"),
      },
      {
        path: "film/:selectedLanguage?",
        lazy: () => import("./containers/NdlaFilm/NdlaFilmEditor"),
      },
      {
        path: "structure/*",
        lazy: () => import("./containers/StructurePage/StructurePage"),
      },
      {
        path: "programme/*",
        lazy: () => import("./containers/StructurePage/ProgrammePage"),
      },
      {
        path: "taxonomyVersions/*",
        lazy: () => import("./containers/TaxonomyVersions/TaxonomyVersionsPage"),
      },
      {
        path: "nodeDiff/:nodeId",
        lazy: () => import("./containers/NodeDiff/NodeDiffPage"),
      },
      {
        path: "frontpage",
        lazy: () => import("./containers/FrontpageEditPage/FrontpageEditPage"),
      },
      {
        path: "updateCodes",
        lazy: () => import("./containers/UpdateCodes/UpdateCodesPage"),
      },
      {
        path: "forbidden",
        lazy: () => import("./containers/ForbiddenPage/ForbiddenPage"),
      },
      {
        path: "*",
        lazy: () => import("./containers/NotFoundPage/NotFoundPage"),
      },
    ],
  },
  {
    path: "/h5p",
    errorElement: <ErrorElement />,
    lazy: () => import("./components/H5pRedirect"),
  },
];
