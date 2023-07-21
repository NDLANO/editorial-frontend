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

export const draftUpdateMock = {
  "id": 800,
  "oldNdlaUrl": "//red.ndla.no/node/167916",
  "revision": 5,
  "status": {
    "current": "IN_PROGRESS",
    "other": [
      "PUBLISHED"
    ]
  },
  "title": {
    "title": "TEST",
    "language": "nb"
  },
  "content": {
    "content": "<section><p>CONTENTS</p></section>",
    "language": "nb"
  },
  "copyright": {
    "license": {
      "license": "CC-BY-SA-4.0",
      "description": "Creative Commons Attribution-ShareAlike 4.0 International",
      "url": "https://creativecommons.org/licenses/by-sa/4.0/"
    },
    "creators": [
      {
        "type": "Writer",
        "name": "Test user"
      }
    ],
    "processors": [],
    "rightsholders": []
  },
  "tags": {
    "tags": [
      "administrative rutiner",
      "garanti",
      "klager",
      "reklamasjon"
    ],
    "language": "nb"
  },
  "requiredLibraries": [],
  "introduction": {
    "introduction": "INGRESS",
    "language": "nb"
  },
  "metaDescription": {
    "metaDescription": "123",
    "language": "nb"
  },
  "metaImage": {
    "url": "https://api.test.ndla.no/image-api/raw/id/23264",
    "alt": "Kunde med handleposer",
    "language": "nb"
  },
  "created": "2016-06-28T09:27:41Z",
  "updated": "2023-07-21T13:31:12Z",
  "updatedBy": "f-jBTU8O8kYbUW20lMeIuTSv",
  "published": "2017-03-07T18:52:45Z",
  "articleType": "standard",
  "supportedLanguages": [
    "nb",
    "nn"
  ],
  "notes": [
    {
      "note": "Status endret",
      "user": "f-jBTU8O8kYbUW20lMeIuTSv",
      "status": {
        "current": "IN_PROGRESS",
        "other": [
          "PUBLISHED"
        ]
      },
      "timestamp": "2023-07-21T08:39:17Z"
    }
  ],
  "editorLabels": [],
  "grepCodes": [],
  "conceptIds": [],
  "availability": "everyone",
  "relatedContent": [],
  "revisions": [
    {
      "id": "87c2a25e-ae26-475e-a1e0-96c0db46a0f1",
      "revisionDate": "2030-01-01T00:00:00Z",
      "note": "Automatisk revisjonsdato satt av systemet.",
      "status": "needs-revision"
    }
  ],
  "responsible": {
    "responsibleId": "f-jBTU8O8kYbUW20lMeIuTSv",
    "lastUpdated": "2023-07-21T08:39:17Z"
  },
  "comments": [],
  "prioritized": false,
  "started": true
}
