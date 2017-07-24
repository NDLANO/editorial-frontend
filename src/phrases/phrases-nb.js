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
  topicArticleForm: {
    save: 'Lagre',
    savedOk: 'Lagret OK',
    createdOk: 'Opprettet OK',
    metadata: 'Metadata',
    visualElementTitle: {
      image: 'Bildetittel',
    },
    visualElementCopyright: 'Opphav',
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
        label: 'Bildetekst',
        placeholder: 'Bildetekst',
      },
      alt: {
        label: 'Alt-tekst',
        placeholder: 'Alt-tekst',
      },
      content: {
        label: 'Innhold',
        placeholder: 'Innhold',
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
  form: {
    remainingCharacters:
      'Max {maxLength, number} tegn og du har {remaining, number} igjen.',
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
