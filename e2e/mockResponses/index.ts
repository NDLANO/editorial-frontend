/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const brightcoveTokenMock = {
  access_token: "test",
  token_type: "Bearer",
  expires_in: 300,
};

export const userDataMock = {
  userId: "test_user_id",
  latestEditedArticles: ["532"],
  favoriteSubjects: ["urn:subject:1:c8d6ed8b-d376-4c7b-b73a-3a1d48c3a357"],
};

export const copyrightMock = {
  license: {
    license: "CC-BY-NC-ND-4.0",
    description: "Creative Commons Attribution-NonCommercial-NoDerivs 4.0 International",
    url: "https://creativecommons.org/licenses/by-nc-nd/4.0/",
  },
  origin: "Test User",
  creators: [
    {
      type: "Writer",
      name: "Test writer",
    },
    {
      type: "writer",
      name: "Test writeerrr",
    },
  ],
  processors: [],
  rightsholders: [],
};

export const responsiblesMock = [
  {
    created_at: "2021-06-14T12:48:29.655Z",
    email: "test.user@knowit.no",
    email_verified: true,
    family_name: "User",
    given_name: "Test ",
    identities: [
      {
        provider: "google-oauth2",
        access_token: "secret_token",
        expires_in: 3599,
        user_id: "user_id",
        connection: "google-oauth2",
        isSocial: true,
      },
    ],
    locale: "no",
    name: "Ed Test",
    nickname: "test.user",
    picture: "https://lh3.googleusercontent.com/a/AAcHTtdP-YafscMocsuVKilO3ynXklOb0KEeMseHVvF6f9WS=s96-c",
    updated_at: "2023-07-07T09:03:55.779Z",
    user_id: "google-oauth2|test_user",
    last_login: "2023-07-07T09:03:55.778Z",
    last_ip: "test_ip",
    logins_count: 416,
    app_metadata: {
      ndla_id: "Gxfx7B-MXoFdgVZZ6p611C6w",
      roles: [
        "articles:write",
        "audio:admin",
        "audio:write",
        "concept:admin",
        "concept:write",
        "drafts:admin",
        "drafts:html",
        "drafts:publish",
        "drafts:write",
        "frontpage:write",
        "images:write",
        "learningpath:admin",
        "learningpath:publish",
        "learningpath:write",
        "taxonomy:admin",
        "taxonomy:write",
      ],
      permissions: [
        "drafts:publish",
        "concept:admin",
        "drafts:html",
        "learningpath:publish",
        "frontpage:admin",
        "images:write",
        "learningpath:write",
        "drafts:responsible",
        "articles:write",
        "concept:responsible",
        "concept:write",
        "learningpath:admin",
        "drafts:write",
        "frontpage:write",
        "taxonomy:write",
        "audio:write",
        "taxonomy:admin",
        "audio:admin",
        "drafts:admin",
      ],
      isOrWasEdUser: true,
    },
  },
];

export const getNoteUsersMock = [
  {
    email: "asdasd@knowit.no",
    email_verified: true,
    name: "Ed Test",
    given_name: "Test",
    family_name: "test",
    picture: "",
    locale: "no",
    updated_at: "2021-03-23T09:23:42.899Z",
    user_id: "",
    nickname: "tt",
    identities: [
      {
        provider: "test",
        access_token: "test",
        expires_in: 3599,
        user_id: "1337",
        connection: "test",
        isSocial: true,
      },
    ],
    created_at: "2020-12-14T14:08:59.594Z",
    last_login: "2021-03-22T14:54:16.407Z",
    last_ip: "12.34.56.78",
    logins_count: 1337,
    app_metadata: { ndla_id: "Gxfx7B-MXoFdgVZZ6p611C6w", roles: ["drafts:admin"] },
  },
];

export const taxonomyNodeSubjectMock = {
  id: "urn:subject:test",
  name: "test fag",
  contentUri: null,
  path: "/subject:test",
  paths: ["/subject:test"],
  metadata: { grepCodes: [], visible: true, customFields: {} },
  relevanceId: "urn:relevance:core",
  translations: [],
  supportedLanguages: [],
  breadcrumbs: ["test"],
  resourceTypes: [],
  nodeType: "SUBJECT",
  contextId: "12e482391",
  url: "/test_12e482391",
  contexts: [],
};

export const editorMock = [
  {
    name: "Ed Test",
    app_metadata: {
      ndla_id: "Gxfx7B-MXoFdgVZZ6p611C6w",
    },
  },
];
