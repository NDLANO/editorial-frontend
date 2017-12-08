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
  language: {
    en: 'Engelsk',
    nb: 'Bokmål',
    nn: 'Nynorsk',
  },
  welcomePage: {
    shortcuts: 'Snarveier',
    searchTopicArticles: 'Søk etter emnebeskrivelse',
    createTopicArticle: 'Opprett emnebeskrivelse',
    searchLearningResource: 'Søk etter læringsressurs',
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
    placeholder: 'Søk etter artikler, aktiviteter eller oppgaver',
    btn: 'Søk',
    articleType: {
      all: 'Alle',
      standard: 'Standard',
      learningResource: 'Læringsressurs',
      topicArticle: 'Emnebeskrivelse',
      image: 'Bilde',
      audio: 'Lyd',
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
    useImage: 'Bruk bildet',
  },
  videoSearch: {
    searchPlaceholder: 'Søk i videoer',
    searchButtonTitle: 'Søk',
    loadMoreVideos: 'Last flere videor',
    noResults: 'Ingen videor funnet.',
    addVideo: 'Bruk video',
    previewVideo: 'Forhåndsvis',
    publishedDate: 'Publisert dato',
    duration: 'Varighet',
    interactioncount: 'Visninger',
  },
  h5pSearch: {
    fetchError:
      'Vi beklager, men en feil oppsto under lasting av H5P klienten.',
  },
  displayOembed: {
    errorMessage: 'En feil oppsto ved visning av oEmbed innhold.',
    notSupported: 'oEmbed av type {type} og kilde {provider} er ikke støttet.',
  },
  audioSearch: {
    searchPlaceholder: 'Søk i lydfiler',
    searchButtonTitle: 'Søk',
    useAudio: 'Velg lyd',
    noResults: 'Ingen resultater funnet',
  },
  noEmbedMessage: {
    deleteOnSave: 'Element av type {type} vil bli fjernet ved lagring.',
  },
  topicArticleForm: {
    visualElementTitle: {
      image: 'Bildetittel',
      h5p: 'H5P tittel',
      brightcove: 'Videotittel',
      external: 'Innholdstekst',
    },
    visualElementCopyright: 'Opphav',
    removeVisualElement: 'Fjern element',
    info: {
      lastUpdated: 'Sist oppdatert: {updated}',
    },
    title: {
      create: 'Du oppretter nå en emnebeskrivelse på {title}({key})',
      update: 'Du redigerer nå en emnebeskrivelse på {title}({key})',
    },
    fields: {
      caption: {
        label: {
          image: 'Bildetekst',
          brightcove: 'Videotekst',
          external: 'Innholdstekst',
        },
        placeholder: {
          image: 'Bildetekst',
          brightcove: 'Videotekst',
          external: 'Innholdstekst',
        },
      },
      alt: {
        label: 'Alt-tekst',
        placeholder: 'Alt-tekst',
      },
    },
  },
  audioForm: {
    title: {
      create: 'Du oppretter nå en lyd fil',
      update: 'Du redigerer nå en lyd fil',
    },
  },
  imageEditor: {
    remove: {
      crop: 'Fjern utsnitt',
      focalPoint: 'Fjern fokuspunkt',
    },
  },
  imageForm: {
    title: {
      create: 'Du oppretter nå et bilde',
      update: 'Du redigerer nå et bilde',
    },
  },
  learningResourceForm: {
    metaImage: {
      title: 'Bildetittel',
      copyright: 'Opphav',
      change: 'Bytt metabilde',
    },
    title: {
      create: 'Du oppretter nå en læringsressurs på {title}({key})',
      update: 'Du redigerer nå en læringsressurs på {title}({key})',
    },
    validation: {
      missingEmbedData:
        'En eller flere inkluderte lyd, bilde, eller video elementer mangler beskrivende tekst eller alternativ tekst.',
    },
    fields: {
      rightAside: 'Høyrespalte',
      metaImage: {
        title: 'Metabilde',
        label: 'Metabilde',
      },
      footnotes: {
        edition: 'Utgave',
        publisher: 'Utgiver',
      },
    },
  },
  form: {
    metadataSection: 'Metadata',
    contentSection: 'Innhold',
    workflowSection: 'Arbeidsflyt',
    copyrightSection: 'Lisens og bruker',
    save: 'Lagre',
    abort: 'Avbryt',
    savedOk: 'Lagret OK',
    createdOk: 'Opprettet OK',
    variant: {
      create: 'Lag variant +',
    },
    remainingCharacters:
      'Maks {maxLength, number} tegn og du har {remaining, number} igjen.',
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
    content: {
      label: 'Innhold',
      placeholder: 'Innhold',
      figure: {
        notSupported: 'Mediatype {mediaType} er ikke støttet.',
      },
      link: {
        goTo: 'Gå til',
        change: 'Endre',
        remove: 'Fjern lenke',
        href: 'Lenke',
        newTab: 'Åpne lenke i ny fane',
        text: 'Tekst',
        addTitle: 'Legg til lenke',
        changeTitle: 'Endre lenke',
      },
      footnote: {
        title: 'Tittel',
        year: 'År',
        authors: {
          label: 'Forfatter',
          description: 'Obligatorisk med minst 1 forfatter.',
          createOption: 'Opprett ny forfatter',
          emptyFilter: ' ',
          emptyList: ' ',
        },
        edition: 'Utgave',
        publisher: 'Utgiver',
        addTitle: 'Legg til fotnote',
        editTitle: 'Rediger fotnote',
        removeFootnote: 'Fjern fotnote',
      },
      table: {
        'row-remove': 'Fjern rad',
        'row-add': 'Legg til rad',
        'column-add': 'Legg til kolonne',
        'column-remove': 'Fjern kolonne',
        'table-remove': 'Fjern tabell',
      },
    },
    tags: {
      label: 'Nøkkelord',
      description: 'Obligatorisk med 3 nøkkelord.',
      createOption: 'Opprett nytt nøkkelord',
      emptyFilter: 'Fant ingen passende nøkkelord',
      emptyList: 'Det er ingen tagger i denne listen',
    },
    metaDescription: {
      label: 'Metabeskrivelse',
      description: 'Beskrivelsen blir synlig i søk.',
    },
    rightsholders: {
      label: 'Rettighetshaver',
      createOption: 'Opprett ny rettighetshaver',
      emptyFilter: ' ',
      emptyList: ' ',
    },
    processors: {
      label: 'Bearbeider',
      createOption: 'Opprett ny bearbeider',
      emptyFilter: ' ',
      emptyList: ' ',
    },
    creators: {
      label: 'Opphavsperson',
      createOption: 'Opprett ny opphavsperson',
      description: 'Obligatorisk med minst 1 opphavsperson.',
      emptyFilter: ' ',
      emptyList: ' ',
    },
    license: {
      label: 'Lisens',
    },
    origin: {
      label: 'Opphav',
    },
    image: {
      file: 'Bilde',
      caption: {
        label: 'Bildetekst',
        placeholder: 'Bildetekst',
      },
      alt: {
        label: 'Alt-tekst',
        placeholder: 'Alt-tekst',
      },
    },
    video: {
      caption: {
        label: 'Videotekst',
        placeholder: 'Videotekst',
      },
    },
    audio: {
      file: 'Lydfil',
      caption: {
        label: 'Lydtekst',
        placeholder: 'Lydtekst',
      },
    },
  },
  validation: {
    isRequired: '{label} er påkrevd.',
    isNumeric: '{label} må inneholde tall.',
    maxLength: '{label} kan ikke ha mer enn {maxLength, number} tegn.',
    minLength: '{label} må ha minst {minLength, number} tegn.',
    url: '{label} må inneholde en gyldig lenke.',
    minItems:
      '{label} feltet må minst inneholde {minItems, plural, one{en} other{# ulike}} {labelLowerCase}.',
  },
  searchPage: {
    articlesNoHits: 'Ingen artikler samsvarte med søket ditt på: {query}',
    imagesNoHits: 'Ingen bilder samsvarte med søket ditt på: {query}',
    audiosNoHits: 'Ingen lydfiler samsvarte med søket ditt på: {query}',
  },
  footer: {
    aboutNDLA: 'Om NDLA',
    selectLanguage: 'Velg språk (language): ',
    footerInfo: 'Nettstedet er utarbeidet av NDLA som åpen kildekode.',
    footerEditiorInChief: 'Ansvarlig redaktør: ',
    footerManagingEditor: 'Utgaveansvarlig: ',
  },
  errorMessage: {
    title: 'Oops, noe gikk galt',
    description: 'Vi beklager, men en feil oppsto.',
    back: 'Tilbake',
    goToFrontPage: 'Gå til forsiden',
  },
  notFound: {
    description: 'Denne siden finnes ikke.',
  },
  forbiddenPage: {
    description: 'Du har ikke tilgang til denne siden',
  },
};

export default phrases;
