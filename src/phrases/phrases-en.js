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
  language: {
    en: 'English',
    nb: 'Norwegian - Bokmål',
    nn: 'Norwegian - Nynorsk',
  },
  welcomePage: {
    shortcuts: 'Shortcuts',
    searchTopicArticles: 'Search for topic description',
    createTopicArticle: 'Create topic description',
    searchLearningResource: 'Search learning resource',
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
      learningResource: 'Learning resource',
      topicArticle: 'Topic description',
      image: 'Image',
      audio: 'Audio',
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
    publishedDate: 'Published date',
    duration: 'Duration',
    interactioncount: 'Views',
  },
  h5pSearch: {
    fetchError: 'Sorry, an error occurd while loading the H5P client.',
  },
  displayOembed: {
    errorMessage: 'An error occurd when displaying oEmbed.',
    notSupported:
      'oEmbed of type {type} and provider {provider} is not supported.',
  },
  audioSearch: {
    searchPlaceholder: 'Search in audio files',
    searchButtonTitle: 'Search',
    useAudio: 'Chose audio',
    noResults: 'No audio files found',
  },
  noEmbedMessage: {
    deleteOnSave: 'Element of type {type} will be deleted on save.',
  },
  topicArticleForm: {
    visualElementTitle: {
      image: 'Image title',
      video: 'Video title',
      brightcove: 'Video title',
      external: 'Content title',
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
      caption: {
        label: {
          image: 'Video caption',
          brightcove: 'Video caption',
          external: 'Content caption',
        },
        placeholder: {
          image: 'Image caption',
          brightcove: 'Video caption',
          external: 'Content caption',
        },
      },
      alt: {
        label: 'Alt-text',
        placeholder: 'Alt-text',
      },
    },
  },
  audioForm: {
    title: {
      create: 'You are now creating a audio file',
      update: 'You are now editing a audio file',
    },
  },
  imageEditor: {
    remove: {
      crop: 'Remove crop',
      focalPoint: 'Remove focal point',
    },
  },
  imageForm: {
    title: {
      create: 'You are now creating an image',
      update: 'You are now editing an image',
    },
  },
  learningResourceForm: {
    visualElementTitle: {
      image: 'Image title',
    },
    visualElementCopyright: 'Origin',
    title: {
      create: 'You are now creating a learning resource on {title}({key})',
      update: 'You are now editing a learning resource on {title}({key})',
    },
    validation: {
      missingEmbedData:
        'One or more inlcuded video, image, or audio elements is missing caption or alternative text.',
    },
    fields: {
      rightAside: 'Right column',
      footnotes: {
        metaImage: {
          title: 'Meta image',
          label: 'Meta image',
        },
        edition: 'Edition',
        publisher: 'Publisher',
      },
    },
  },
  form: {
    metadataSection: 'Metadata',
    contentSection: 'Content',
    copyrightSection: 'License and authors',
    save: 'Save',
    abort: 'Abort',
    savedOk: 'Saved OK',
    createdOk: 'Created OK',
    variant: {
      create: 'Create variant +',
    },
    remainingCharacters:
      'Max {maxLength, number} characters and you have {remaining, number} remaining.',
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
    content: {
      label: 'Content',
      placeholder: 'Write here...',
      figure: {
        notSupported: 'Media type {mediaType} is not supported.',
      },
      link: {
        goTo: 'Go to',
        change: 'Change',
        remove: 'Remove link',
        href: 'Link',
        text: 'Text',
        addTitle: 'Add link',
        changeTitle: 'Change link',
      },
      footnote: {
        title: 'Title',
        year: 'Year',
        authors: {
          label: 'Author',
          description: 'Required with at least one author.',
          createOption: 'Create new author',
          emptyFilter: ' ',
          emptyList: ' ',
        },
        edition: 'Edition',
        publisher: 'Publisher',
        addTitle: 'Add footnote',
        editTitle: 'Edit footnote',
        removeFootnote: 'Remove footnote',
      },
    },
    tags: {
      label: 'Tags',
      description: '3 tags is required.',
      createOption: 'Create new tag',
      emptyList: 'No tags available',
      emptyFilter: 'No matching tags found',
    },
    metaDescription: {
      label: 'Meta description',
      description: 'The description will be viewable in search.',
    },
    contributors: {
      label: 'Contributor',
      createOption: 'Add new contributor',
      emptyFilter: ' ',
      emptyList: ' ',
    },
    licensees: {
      label: 'Licensee',
      createOption: 'Add new licensee',
      emptyFilter: ' ',
      emptyList: ' ',
    },
    authors: {
      label: 'Author',
      createOption: 'Add new author',
      description: 'Required with at least one author.',
      emptyFilter: ' ',
      emptyList: ' ',
    },
    license: {
      label: 'Lisens',
    },
    origin: {
      label: 'Origin',
    },
    caption: {
      label: 'Caption',
      placeholder: 'Caption',
    },
    image: {
      file: 'Image',
      alt: {
        label: 'Alt-text',
        placeholder: 'Alt-text',
      },
      caption: {
        label: 'Image caption',
        placeholder: 'Image caption',
      },
    },
    video: {
      caption: {
        label: 'Video caption',
        placeholder: 'Video caption',
      },
    },
    audio: {
      file: 'Audio file',
      caption: {
        label: 'Audio caption',
        placeholder: 'Audio caption',
      },
    },
  },
  validation: {
    isRequired: '{label} is required.',
    isNumeric: '{label} must contain digits.',
    url: '{label} must contain a valid link.',
    maxLength:
      '{label} must not have more than {maxLength, number} characters.',
    minLength: '{length} must have at least {minLength, number} characters.',
    minItems:
      '{label} must have at least {minItems, plural, one{one} other{# unique}} {labelLowerCase}.',
  },
  searchPage: {
    articlesNoHits: 'Your search - {query} - did not match any articles.',
    imagesNoHits: 'Your search - {query} - did not match any images.',
    audiosNoHits: 'Your search - {query} - did not match any audio files.',
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
