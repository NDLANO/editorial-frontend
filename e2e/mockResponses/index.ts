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