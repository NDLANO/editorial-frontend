/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const phrases = {
  meta: {
    description: 'Norwegian Digital Learning Arena, Open Educational Resources',
  },
  welcomePage: {
    shortcuts: 'Shortcuts',
    searchTopicArticles: 'Search for topic description',
    createTopicArticle: 'Create topic description',
  },
  logo: {
    altText: 'The Norwegian Digital Learning Arena',
  },
  siteNav: {
    chooseSubject: 'Choose Subject',
    search: 'Search',
    login: 'Login',
    logout: 'Logout [{name}]',
  },
  loginFailure: {
    errorMessage: 'Sorry. Login failed.',
    loginLink: 'Click to try again.',
  },
  loginProviders: {
    description: 'Log in with',
  },
  logoutProviders: {
    localLogout: 'Logg ut av prouctionsystem',
    or: 'eller',
    federatedLogout: 'Log out of all providers',
    description:
      'N.B. All providers include the identityprovider (Google or Facebook).',
  },
  searchForm: {
    placeholder: 'Search articles',
    btn: 'Search',
    articleType: {
      all: 'All',
      standard: 'Standard',
      topicArticle: 'Topic description',
    },
    order: {
      relevance: 'Relevance',
      title: 'Alphabetical',
    },
  },
  subjectsPage: {
    subjects: 'Subjects',
  },
  subjectPage: {
    topics: 'Topics',
  },
  topicArticleForm: {
    save: 'Save',
    savedOk: 'Saved OK',
    createdOk: 'Created OK',
    metadata: 'Metadata',
    content: 'Content',
    visualElementTitle: {
      image: 'Image title',
    },
    visualElementCopyright: 'Origin',
    title: {
      create: 'You are now creating a topic description',
      update: 'You are now editing a topic description',
    },
    fields: {
      title: {
        label: 'Title',
      },
      introduction: {
        label: 'Introduction',
      },
      visualElement: {
        title: 'Add visual element',
        label: 'Visual element',
      },
      caption: {
        label: 'Caption',
        placeholder: 'Caption',
      },
      alt: {
        label: 'Alt-text',
        placeholder: 'Alt-text',
      },
      content: {
        label: 'Content',
        placeholder: 'Write here...',
      },
      tags: {
        label: 'Tags',
        description: '3 tags is required.',
        createNew: 'Create new tag',
        emptyList: 'No tags available',
        emptyFilter: 'No matching tags found',
      },
      metaDescription: {
        label: 'Meta description',
        description: 'The description will be viewable in search.',
      },
      authors: {
        label: 'Author',
        createNew: 'Add new author',
        emptyFilter: ' ',
        emptyList: ' ',
      },
    },
    description: {
      metaDescription: 'The description will be viewable in search.',
    },
  },
  form: {
    remainingCharacters:
      'Max {maxLength, number} characters and you have {remaining, number} remaining.',
  },
  validation: {
    isRequired: '{label} is required.',
    maxLength:
      '{label} must not have more than {maxLength, number} characters.',
    minLength: '{length} must have at least {minLength, number} characters.',
    minItems:
      '{label} must have at least {minItems, plural, one{one} other{# unique}} {labelLowerCase}.',
  },
  searchPage: {
    noHits: 'Your search - {query} - did not match any articles. ',
  },
  footer: {
    aboutNDLA: 'About NDLA',
    selectLanguage: 'Choose language (språk): ',
    footerInfo: 'This webapplication is developed by NDLA as Open Source code.',
    footerEditiorInChief: 'Editor in chief: ',
    footerManagingEditor: 'Managing editor: ',
  },
  notFound: {
    description: 'The page cannot be found',
  },
  forbiddenPage: {
    description: 'You do not have access to this page',
  },
};

export default phrases;
