/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const phrases = {
  meta: {
    description:
      'Kvalitetssikrede fritt tilgjengelige nettbaserte læremidler for videregående opplæring',
  },
  welcomePage: {
    shortcuts: 'Snarveier',
    searchTopicArticles: 'Søk etter emnebeskrivelse',
    createTopicArticle: 'Opprett emnebeskrivelse',
    createLearningResource: 'Opprett læringsressurs',
    createAudioFile: 'Last opp lydfil',
    createImage: 'Last opp bilde',
  },
  logo: {
    altText: 'Nasjonal digital læringsarena',
  },
  siteNav: {
    chooseSubject: 'Velg fag',
    search: 'Søk',
    login: 'Logg inn',
    logout: 'Logg ut [{name}]',
  },
  loginFailure: {
    errorMessage: 'Beklager. Innlogging feilet.',
    loginLink: 'Klikk for å prøve igjen.',
  },
  loginProviders: {
    description: 'Logg inn i produksjonssystem med',
  },
  logoutProviders: {
    localLogout: 'Logg ut av produksjonssystem',
    or: 'eller',
    federatedLogout: 'Logg ut av alle tjenester',
    description:
      'N.B. Alle tjenester inkluderer autentiseringstjenesten (Google eller Facebook).',
  },
  searchForm: {
    placeholder: 'Søk etter artikler',
    btn: 'Søk',
    articleType: {
      all: 'Alle',
      standard: 'Standard',
      topicArticle: 'Emnebeskrivelse',
    },
    order: {
      relevance: 'Relevans',
      title: 'Alfabetisk',
    },
  },
  subjectsPage: {
    subjects: 'Fag',
  },
  subjectPage: {
    topics: 'Emner',
  },
  imageSearch: {
    placeholder: 'Søk i bilder',
    buttonTitle: 'Søk',
  },
  videoSearch: {
    searchPlaceholder: 'Søk i videoer',
    searchButtonTitle: 'Søk',
    loadMoreVideos: 'Last flere videor',
    noResults: 'Ingen videor funnet.',
    addVideo: 'Bruk video',
    previewVideo: 'Forhåndsvis',
  },
  audioSearch: {
    searchPlaceholder: 'Søk i lydfiler',
    searchButtonTitle: 'Søk',
    useAudio: 'Velg lyd',
    noResults: 'Ingen resultater funnet',
  },
  topicArticleForm: {
    save: 'Lagre',
    savedOk: 'Lagret OK',
    createdOk: 'Opprettet OK',
    metadata: 'Metadata',
    content: 'Innhold',
    visualElementTitle: {
      image: 'Bildetittel',
      video: 'Videotittel',
    },
    visualElementCopyright: 'Opphav',
    info: {
      lastUpdated: 'Sist oppdatert: {updated}',
    },
    title: {
      create: 'Du oppretter nå en emnebeskrivelse',
      update: 'Du redigerer nå en emnebeskrivelse',
    },
    fields: {
      title: {
        label: 'Tittel',
      },
      introduction: {
        label: 'Ingress',
      },
      visualElement: {
        title: 'Legg til visuelt element',
        label: 'Visuelt element',
      },
      caption: {
        label: {
          image: 'Bildetekst',
          video: 'Videotekst',
          brightcove: 'Videotekst',
        },
        placeholder: {
          image: 'Bildetekst',
          video: 'Videotekst',
          brightcove: 'Videotekst',
        },
      },
      alt: {
        label: 'Alt-tekst',
        placeholder: 'Alt-tekst',
      },
      content: {
        label: 'Innhold',
        placeholder: 'Innhold',
        deleteEmbedOnSave:
          'ADVARSEL: Figur i innholdsblokk vil bli fjernet ved lagring',
      },
      tags: {
        label: 'Nøkkelord',
        description: 'Obligatorisk med 3 nøkkelord.',
        createNew: 'Opprett nytt nøkkelord',
        emptyFilter: 'Fant ingen passende nøkkelord',
        emptyList: 'Det er ingen tagger i denne listen',
      },
      metaDescription: {
        label: 'Metabeskrivelse',
        description: 'Beskrivelsen blir synlig i søk.',
      },
      authors: {
        label: 'Forfatter',
        createNew: 'Opprett ny bidragsyter',
        emptyFilter: ' ',
        emptyList: ' ',
      },
    },
  },
  audioForm: {
    title: {
      create: 'Du oppretter nå en lyd fil',
      update: 'Du redigerer nå en lyd fil',
    },
    save: 'Lagre',
    abort: 'Avbryt',
    savedOk: 'Lagret OK',
    createdOk: 'Opprettet OK',
    metadata: 'Metadata',
    content: 'Innhold',
    copyrightAccordion: 'Lisens og bruker',
    fields: {
      title: {
        label: 'Tittel',
      },
      origin: {
        label: 'Opphav',
      },
      tags: {
        label: 'Nøkkelord',
        description: 'Obligatorisk med 3 nøkkelord.',
        createNew: 'Opprett nytt nøkkelord',
        emptyFilter: 'Fant ingen passende nøkkelord',
        emptyList: 'Det er ingen tagger i denne listen',
      },
      authors: {
        label: 'Opphavsperson',
        description: 'Obligatorisk med minst 1 opphavsperson.',
        createNew: 'Opprett ny opphavsperson',
        emptyFilter: ' ',
        emptyList: ' ',
      },
      license: {
        label: 'Lisens',
      },
      audioFile: {
        label: 'Lydfil',
      },
    },
  },
  imageForm: {
    title: {
      create: 'Du oppretter nå et bilde',
      update: 'Du redigerer nå et bilde',
    },
    save: 'Lagre',
    abort: 'Avbryt',
    savedOk: 'Lagret OK',
    createdOk: 'Opprettet OK',
    metadata: 'Metadata',
    content: 'Innhold',
    copyrightAccordion: 'Lisens og bruker',
    fields: {
      title: {
        label: 'Tittel',
      },
      alttext: {
        label: 'Alternativ bilde tekst',
        placeholder: 'Alt-tekst',
      },
      caption: {
        label: 'Bilde tekst',
        placeholder: 'Bilde tekst',
      },
      origin: {
        label: 'Opphav',
      },
      tags: {
        label: 'Nøkkelord',
        description: 'Obligatorisk med 3 nøkkelord.',
        createNew: 'Opprett nytt nøkkelord',
        emptyFilter: 'Fant ingen passende nøkkelord',
        emptyList: 'Det er ingen tagger i denne listen',
      },
      authors: {
        label: 'Opphavsperson',
        description: 'Obligatorisk med minst 1 opphavsperson.',
        createNew: 'Opprett ny opphavsperson',
        emptyFilter: ' ',
        emptyList: ' ',
      },
      license: {
        label: 'Lisens',
      },
      imageFile: {
        label: 'Bilde',
      },
    },
  },
  learningResourceForm: {
    save: 'Lagre',
    abort: 'Avbryt',
    savedOk: 'Lagret OK',
    createdOk: 'Opprettet OK',
    metadata: 'Metadata',
    content: 'Innhold',
    copyrightAccordion: 'Lisens og bruker',
    metaImageTitle: {
      image: 'Bildetittel',
    },
    metaImageCopyright: 'Opphav',
    title: {
      create: 'Du oppretter nå en læringsressurs',
      update: 'Du redigerer nå en læringsressurs',
    },
    fields: {
      title: {
        label: 'Tittel',
      },
      introduction: {
        label: 'Ingress',
      },
      metaImage: {
        title: 'Metabilde',
        label: 'Metabilde',
      },
      caption: {
        label: {
          image: 'Bildetekst',
        },
        placeholder: {
          image: 'Bildetekst',
        },
      },
      alt: {
        label: 'Alt-tekst',
        placeholder: 'Alt-tekst',
      },
      content: {
        label: 'Innhold',
        placeholder: 'Innhold',
        figure: {
          caption: {
            brightcove: 'Videotekst',
            image: 'Bildetekst',
          },
          alt: 'Alt tekst',
          notSupported: 'Mediatype {mediaType} er ikke støttet.',
        },
      },
      tags: {
        label: 'Nøkkelord',
        description: 'Obligatorisk med 3 nøkkelord.',
        createNew: 'Opprett nytt nøkkelord',
        emptyFilter: 'Fant ingen passende nøkkelord',
        emptyList: 'Det er ingen tagger i denne listen',
      },
      metaDescription: {
        label: 'Metabeskrivelse',
        description: 'Beskrivelsen blir synlig i søk.',
      },
      contributors: {
        label: 'Bidragsyter',
        createNew: 'Opprett ny bidragsyter',
        emptyFilter: ' ',
        emptyList: ' ',
      },
      licensees: {
        label: 'Rettighetshaver',
        createNew: 'Opprett ny rettighetshaver',
        emptyFilter: ' ',
        emptyList: ' ',
      },
      authors: {
        label: 'Opphavsperson',
        createNew: 'Opprett ny opphavsperson',
        emptyFilter: ' ',
        emptyList: ' ',
      },
      license: {
        label: 'Lisens',
      },
    },
  },
  form: {
    remainingCharacters:
      'Maks {maxLength, number} tegn og du har {remaining, number} igjen.',
  },
  validation: {
    isRequired: '{label} er påkrevd.',
    maxLength: '{label} kan ikke ha mer enn {maxLength, number} tegn.',
    minLength: '{label} må ha minst {minLength, number} tegn.',
    minItems:
      '{label} feltet må minst inneholde {minItems, plural, one{en} other{# ulike}} {labelLowerCase}.',
  },
  searchPage: {
    noHits: 'Ingen artikler samsvarte med søket ditt på: {query}',
  },
  footer: {
    aboutNDLA: 'Om NDLA',
    selectLanguage: 'Velg språk (language): ',
    footerInfo: 'Nettstedet er utarbeidet av NDLA som åpen kildekode.',
    footerEditiorInChief: 'Ansvarlig redaktør: ',
    footerManagingEditor: 'Utgaveansvarlig: ',
  },
  notFound: {
    description: 'Denne siden finnes ikke.',
  },
  forbiddenPage: {
    description: 'Du har ikke tilgang til denne siden',
  },
};

export default phrases;
