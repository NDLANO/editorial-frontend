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
    hello: 'Hello world',
  },
  logo: {
    altText: 'The Norwegian Digital Learning Arena',
  },
  siteNav: {
    chooseSubject: 'Choose Subject',
    search: 'Search',
  },
  searchForm: {
    placeholder: 'Search articles',
    btn: 'Search',
    order: {
      relevance: 'Relevance',
      title: 'Alphabetical',
    },
  },
  topicArticleForm: {
    save: 'Save',
    labels: {
      title: 'Title',
      introduction: 'Introduction',
      metaDescription: 'Meta description',
    },
    fields: {
      content: {
        label: 'Content',
        placeholder: 'Write here...',
      },
      tags: {
        label: 'Tags',
        createNew: 'Create new tag',
        emptyList: 'No tags available',
        emptyFilter: 'No matching tags found',
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
    remainingCharacters: 'Max {maxLength, number} characters and you have {remaining, number} remaining.',
  },
  validation: {
    isRequired: '{label} is required.',
    maxLength: '{label} must not have more than {maxLength, number} characters.',
    minLength: '{length} must have at least {minLength, number} characters.',
    minItems: '{label} must have at least {minItems, plural, one{one} other{# unique}} {labelLowerCase}.',
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
};

export default phrases;
