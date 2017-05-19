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
    shortcuts: 'Snarveier',
    searchTopicArticles: 'Søk etter emneartikler',
    createTopicArticle: 'Opprett emneartikler',
  },
  logo: {
    altText: 'Nasjonal digital læringsarena',
  },
  siteNav: {
    chooseSubject: 'Velg fag',
    search: 'Søk',
  },
  searchForm: {
    placeholder: 'Søk etter artikler',
    btn: 'Søk',
    articleType: {
      all: 'Alle',
      standard: 'Standard',
      topicArticle: 'Emne artikkel',
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
  topicArticleForm: {
    save: 'Lagre',
    fields: {
      title: {
        label: 'Tittel',
      },
      introduction: {
        label: 'Ingress',
      },
      visualElement: {
        label: 'Visuelt element',
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
