/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const phrases = {
  meta: {
    description: 'Kvalitetssikrede fritt tilgjengelige nettbaserte læremidler for videregående opplæring',
  },
  welcomePage: {
    hello: 'Hello verden',
    subjects: 'Fag',
    search: 'Søk',
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
    loginLink: 'Logg inn',
  },
  loginProviders: {
    description: 'Logg inn i NDLA med',
  },
  logoutProviders: {
    federatedLogout: 'Logg helt ut av autentiseringstjenesten (Google/Facebook/Twitter). Forlater denne applikasjonen.',
    localLogout: 'Logg ut av NDLA applikasjonen',
  },
  searchForm: {
    placeholder: 'Søk etter artikler',
    btn: 'Søk',
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
  topicArticleForm: {
    save: 'Lagre',
    labels: {
      title: 'Tittel',
      introduction: 'Ingress',
      metaDescription: 'Metabeskrivelse',
      content: 'Innhold',
    },
    fields: {
      content: {
        label: 'Innhold',
        placeholder: 'Innhold',
      },
      tags: {
        label: 'Nøkkelord',
        createNew: 'Opprett nytt nøkkelord',
        emptyFilter: 'Fant ingen passende nøkkelord',
        emptyList: 'Det er ingen tagger i denne listen',
      },
      authors: {
        label: 'Forfatter',
        createNew: 'Opprett ny bidragsyter',
        emptyFilter: ' ',
        emptyList: ' ',
      },
    },
    description: {
      metaDescription: 'Beskrivelsen blir synlig i søk.',
    },
  },
  form: {
    remainingCharacters: 'Max {maxLength, number} tegn og du har {remaining, number} igjen.',
  },
  validation: {
    isRequired: '{label} er påkrevd.',
    maxLength: '{label} kan ikke ha mer enn {maxLength, number} tegn.',
    minLength: '{label} må ha minst {minLength, number} tegn.',
    minItems: '{label} feltet må minst inneholde {minItems, plural, one{en} other{# ulike}} {labelLowerCase}.',
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
};

export default phrases;
