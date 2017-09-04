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
    createLearningResource: 'Create learning resource',
    createAudioFile: 'Upload audiofile',
    createImage: 'Upload image',
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
  imageSearch: {
    placeholder: 'Search images',
    buttonTitle: 'Search',
  },
  videoSearch: {
    searchPlaceholder: 'Search videos',
    searchButtonTitle: 'Search',
    loadMoreVideos: 'Load more videos',
    noResults: 'No videos found',
    addVideo: 'Use video',
    previewVideo: 'Preview',
  },
  h5pSearch: {
    fetchError: 'Sorry, an error occurd while loading the H5P client.',
  },
  audioSearch: {
    searchPlaceholder: 'Search in audio files',
    searchButtonTitle: 'Search',
    useAudio: 'Chose audio',
    noResults: 'No audio files found',
  },
  topicArticleForm: {
    save: 'Save',
    savedOk: 'Saved OK',
    createdOk: 'Created OK',
    metadata: 'Metadata',
    content: 'Content',
    visualElementTitle: {
      image: 'Image title',
      brightcove: 'Videotittel',
      h5p: 'H5P title',
    },
    visualElementCopyright: 'Origin',
    info: {
      lastUpdated: 'Last updated: {updated}',
    },
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
        deleteEmbedOnSave:
          'WARNING: Figure in content block will be removed on save',
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
  audioForm: {
    save: 'Save',
    abort: 'Abort',
    savedOk: 'Saved OK',
    createdOk: 'Created OK',
    metadata: 'Metadata',
    content: 'Content',
    copyrightAccordion: 'License and authors',
    title: {
      create: 'You are now creating a audio file',
      update: 'You are now editing a audio file',
    },
    fields: {
      title: {
        label: 'Title',
      },
      origin: {
        label: 'Origin',
      },
      tags: {
        label: 'Tags',
        description: '3 tags is required.',
        createNew: 'Create new tag',
        emptyList: 'No tags available',
        emptyFilter: 'No matching tags found',
      },
      authors: {
        label: 'Author',
        description: 'At least 1 author is required.',
        createNew: 'Add new author',
        emptyFilter: ' ',
        emptyList: ' ',
      },
      license: {
        label: 'Lisens',
      },
      audioFile: {
        label: 'Audiofile',
      },
    },
  },
  imageEditor: {
    remove: {
      crop: 'Remove crop',
      focalPoint: 'Remove focal point',
    },
  },
  imageForm: {
    save: 'Save',
    abort: 'Abort',
    savedOk: 'Saved OK',
    createdOk: 'Created OK',
    metadata: 'Metadata',
    content: 'Content',
    copyrightAccordion: 'License and authors',
    title: {
      create: 'You are now creating an image',
      update: 'You are now editing an image',
    },
    fields: {
      title: {
        label: 'Title',
      },
      alttext: {
        label: 'Alternative image text',
        placeholder: 'Alt-text',
      },
      caption: {
        label: 'Caption',
        placeholder: 'Caption',
      },
      origin: {
        label: 'Origin',
      },
      tags: {
        label: 'Tags',
        description: '3 tags is required.',
        createNew: 'Create new tag',
        emptyList: 'No tags available',
        emptyFilter: 'No matching tags found',
      },
      authors: {
        label: 'Author',
        description: 'At least 1 author is required.',
        createNew: 'Add new author',
        emptyFilter: ' ',
        emptyList: ' ',
      },
      license: {
        label: 'Lisens',
      },
      imageFile: {
        label: 'Image',
      },
    },
  },
  learningResourceForm: {
    save: 'Save',
    abort: 'Abort',
    savedOk: 'Saved OK',
    createdOk: 'Created OK',
    metadata: 'Metadata',
    content: 'Content',
    copyrightAccordion: 'License and authors',
    visualElementTitle: {
      image: 'Image title',
    },
    visualElementCopyright: 'Origin',
    title: {
      create: 'You are now creating a learning resource',
      update: 'You are now editing a learning resource',
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
        figure: {
          caption: {
            brightcove: 'Video caption',
            image: 'Image caption',
          },
          alt: 'Alt text',
          notSupported: 'Media type {mediaType} is not supported.',
        },
        link: {
          save: 'Save',
          abort: 'Abort',
          removeUrl: 'Remove link',
          urlError: 'Link has to come from ndla.no',
          url: 'Link',
          text: 'Text',
          addTitle: 'Add link',
          changeTitle: 'Change link',
        },
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
      contributors: {
        label: 'Contributor',
        createNew: 'Add new contributor',
        emptyFilter: ' ',
        emptyList: ' ',
      },
      licensees: {
        label: 'Licensee',
        createNew: 'Add new licensee',
        emptyFilter: ' ',
        emptyList: ' ',
      },
      authors: {
        label: 'Author',
        createNew: 'Add new author',
        emptyFilter: ' ',
        emptyList: ' ',
      },
      license: {
        label: 'Lisens',
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
  errorMessage: {
    title: 'Oops, something went wrong',
    description: 'Sorry, an error occurd.',
    back: 'Back',
    goToFrontPage: 'Go to frontpage',
  },
  notFound: {
    description: 'The page cannot be found',
  },
  forbiddenPage: {
    description: 'You do not have access to this page',
  },
};

export default phrases;
