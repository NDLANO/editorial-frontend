export const zendeskMock = { token: 'test_token' };

export const brightcoveTokenMock = {
  access_token: 'test',
  token_type: 'Bearer',
  expires_in: 300,
};

export const userDataMock = {
  userId: 'test_user_id',
  latestEditedArticles: ['532'],
};

export const responsiblesMock = [
  {
    created_at: '2021-06-14T12:48:29.655Z',
    email: 'test.user@knowit.no',
    email_verified: true,
    family_name: 'User',
    given_name: 'Test ',
    identities: [
      {
        provider: 'google-oauth2',
        access_token: 'secret_token',
        expires_in: 3599,
        user_id: 'user_id',
        connection: 'google-oauth2',
        isSocial: true,
      },
    ],
    locale: 'no',
    name: 'Test User',
    nickname: 'test.user',
    picture:
      'https://lh3.googleusercontent.com/a/AAcHTtdP-YafscMocsuVKilO3ynXklOb0KEeMseHVvF6f9WS=s96-c',
    updated_at: '2023-07-07T09:03:55.779Z',
    user_id: 'google-oauth2|test_user',
    last_login: '2023-07-07T09:03:55.778Z',
    last_ip: 'test_ip',
    logins_count: 416,
    app_metadata: {
      ndla_id: '-2CqVRhF5aohP2yWCI93fdSc',
      roles: [
        'articles:write',
        'audio:admin',
        'audio:write',
        'concept:admin',
        'concept:write',
        'drafts:admin',
        'drafts:html',
        'drafts:publish',
        'drafts:write',
        'frontpage:write',
        'images:write',
        'learningpath:admin',
        'learningpath:publish',
        'learningpath:write',
        'taxonomy:admin',
        'taxonomy:write',
      ],
      permissions: [
        'drafts:publish',
        'concept:admin',
        'drafts:html',
        'learningpath:publish',
        'frontpage:admin',
        'images:write',
        'learningpath:write',
        'drafts:responsible',
        'articles:write',
        'concept:responsible',
        'concept:write',
        'learningpath:admin',
        'drafts:write',
        'frontpage:write',
        'taxonomy:write',
        'audio:write',
        'taxonomy:admin',
        'audio:admin',
        'drafts:admin',
      ],
      isOrWasEdUser: true,
    },
  },
];

export const draftMock = {
  id: 800,
  oldNdlaUrl: '//red.ndla.no/node/22149',
  revision: 10,
  status: {
    current: 'PROPOSAL',
    other: ['IMPORTED', 'PUBLISHED'],
  },
  title: {
    title: 'Forskningsprosessen',
    language: 'nb',
  },
  content: {
    content: '<section><p> TEST </p></section>',
    language: 'nb',
  },
  copyright: {
    license: {
      license: 'CC-BY-NC-ND-4.0',
      description: 'Creative Commons Attribution-NonCommercial-NoDerivs 4.0 International',
      url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    },
    origin: 'Ragna Marie Tørdal',
    creators: [
      {
        type: 'Writer',
        name: 'Elisabet Romedal',
      },
      {
        type: 'writer',
        name: 'Olav Kristensen',
      },
    ],
    processors: [],
    rightsholders: [],
  },
  tags: {
    tags: ['empiri', 'forskningsprosess', 'forskningsprosjekt'],
    language: 'nb',
  },
  requiredLibraries: [],
  introduction: {
    introduction: ' TEST ',
    language: 'nb',
  },
  metaDescription: {
    metaDescription: 'TEST meta description',
    language: 'nb',
  },
  metaImage: {
    url: 'https://test.api.ndla.no/image-api/raw/id/43392',
    alt: 'Test. Foto.',
    language: 'nb',
  },
  created: '2010-09-06T21:40:09Z',
  updated: '2019-10-09T17:39:49Z',
  updatedBy: 'fsexOCfJFGOKuy1C2e71OsvQwq0NWKAK',
  published: '2018-03-05T15:56:12Z',
  articleType: 'standard',
  supportedLanguages: ['nb', 'nn'],
  notes: [
    {
      note: 'Status endret',
      user: 'fsexOCfJFGOKuy1C2e71OsvQwq0NWKAK',
      status: {
        current: 'PROPOSAL',
        other: ['IMPORTED', 'PUBLISHED'],
      },
      timestamp: '2019-10-09T17:39:47Z',
    },
  ],
  conceptIds: [],
  revisions: [
    {
      revisionDate: '2030-01-01T00:00:00Z',
      note: 'Automatisk revisjonsdato satt av systemet.',
      status: 'needs-revision',
    },
  ],
};
