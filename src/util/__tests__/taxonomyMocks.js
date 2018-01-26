/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const resourceTypesMock = [
  {
    id: 'urn:resourcetype:subjectMaterial',
    name: 'Fagstoff',
    subtypes: [
      {
        id: 'urn:resourcetype:academicArticle',
        name: 'Fagartikkel',
      },
      {
        id: 'urn:resourcetype:movieAndClip',
        name: 'Film og filmklipp',
      },
      {
        id: 'urn:resourcetype:guidance',
        name: 'Veiledning',
      },
      {
        id: 'urn:resourcetype:dictionary',
        name: 'Oppslagsverk og ordliste',
      },
      {
        id: 'urn:resourcetype:toolAndTemplate',
        name: 'Verktøy og mal',
      },
      {
        id: 'urn:resourcetype:simulation',
        name: 'Simulering',
      },
      {
        id: 'urn:resourcetype:lectureAndPresentation',
        name: 'Forelesning og presentasjon',
      },
      {
        id: 'urn:resourcetype:drawingAndIllustration',
        name: 'Tegning og illustrasjon',
      },
    ],
  },
  {
    id: 'urn:resourcetype:tasksAndActivities',
    name: 'Oppgaver og aktiviteter',
    subtypes: [
      {
        id: 'urn:resourcetype:task',
        name: 'Oppgave',
      },
      {
        id: 'urn:resourcetype:exercise',
        name: 'Øvelse',
      },
      {
        id: 'urn:resourcetype:workAssignment',
        name: 'Arbeidsoppdrag',
      },
      {
        id: 'urn:resourcetype:game',
        name: 'Spill',
      },
      {
        id: 'urn:resourcetype:experiment',
        name: 'Forsøk',
      },
    ],
  },
  {
    id: 'urn:resourcetype:reviewResource',
    name: 'Vurderingsressurs',
    subtypes: [
      {
        id: 'urn:resourcetype:selfEvaluation',
        name: 'Egenvurdering',
      },
      {
        id: 'urn:resourcetype:teacherEvaluation',
        name: 'Lærervurdering',
      },
    ],
  },
  {
    id: 'urn:resourcetype:learningPath',
    name: 'Læringssti',
  },
  {
    id: 'urn:resourcetype:SourceMaterial',
    name: 'Kildemateriale',
    subtypes: [
      {
        id: 'urn:resourcetype:featureFilm',
        name: 'Spillefilm',
      },
      {
        id: 'urn:resourcetype:shortFilm',
        name: 'Kortfilm',
      },
      {
        id: 'urn:resourcetype:historicalMaterial',
        name: 'Historisk materiale',
      },
      {
        id: 'urn:resourcetype:literaryText',
        name: 'Litterære tekster',
      },
      {
        id: 'urn:resourcetype:paintingGraphicsPhoto',
        name: 'Malerier- grafikk -kunstfoto',
      },
    ],
  },
  {
    id: 'urn:resourcetype:externalResource',
    name: 'Ekstern læringsressurs',
    subtypes: [
      {
        id: 'urn:resourcetype:externalLink',
        name: 'Ekstern lenke',
      },
      {
        id: 'urn:resourcetype:sharedLearningResource',
        name: 'Delt læringsressurs',
      },
    ],
  },
  {
    id: 'urn:resourcetype:concept',
    name: 'Begrep',
  },
];

export const filtersMock = [
  {
    id: 'urn:filter:203679b7-7312-493c-97a2-5621437fa28e',
    name: 'VG1',
    connectionId: 'urn:resource-filter:0b6c66fe-c86f-4aa4-b5c0-8ebd26a53df4',
    relevanceId: 'urn:relevance:core',
  },
  {
    id: 'urn:filter:04b81e41-dc1a-4635-b139-8fe25036ae45',
    name: 'VG2',
    connectionId: 'urn:resource-filter:314662e7-9a7d-4e02-9a8c-76a8c744b9e7',
    relevanceId: 'urn:relevance:core',
  },
  {
    id: 'urn:filter:3b6061e1-b611-47b5-9e48-3346fa7e20c0',
    name: 'VG2-YF',
    connectionId: 'urn:resource-filter:c32f6276-8ff8-439d-ae3c-485e99e9d40a',
    relevanceId: 'urn:relevance:core',
  },
];

export const topicResourcesMock = [
  {
    id: 'urn:topic:1:171500',
    name: 'Økonomi og forbruk',
    contentUri: 'urn:article:81',
    path: '/subject:3/topic:1:55163/topic:1:171500',
  },
  {
    id: 'urn:topic:1:179518',
    name: 'Profesjonell kommunikasjon',
    contentUri: null,
    path: '/subject:4/topic:1:173324/topic:1:179518',
  },
  {
    id: 'urn:topic:1:173292',
    name: 'Det demokratiske systemet i Norge',
    contentUri: null,
    path: '/subject:9/topic:1:168542/topic:1:173292',
  },
];

export const flattenedResourceTypes = [
  {
    id: 'urn:resourcetype:academicArticle',
    name: 'Fagartikkel',
    typeId: 'urn:resourcetype:subjectMaterial',
    typeName: 'Fagstoff',
  },
  {
    id: 'urn:resourcetype:movieAndClip',
    name: 'Film og filmklipp',
    typeId: 'urn:resourcetype:subjectMaterial',
    typeName: 'Fagstoff',
  },
  {
    id: 'urn:resourcetype:guidance',
    name: 'Veiledning',
    typeId: 'urn:resourcetype:subjectMaterial',
    typeName: 'Fagstoff',
  },
  {
    id: 'urn:resourcetype:dictionary',
    name: 'Oppslagsverk og ordliste',
    typeId: 'urn:resourcetype:subjectMaterial',
    typeName: 'Fagstoff',
  },
  {
    id: 'urn:resourcetype:toolAndTemplate',
    name: 'Verktøy og mal',
    typeId: 'urn:resourcetype:subjectMaterial',
    typeName: 'Fagstoff',
  },
  {
    id: 'urn:resourcetype:simulation',
    name: 'Simulering',
    typeId: 'urn:resourcetype:subjectMaterial',
    typeName: 'Fagstoff',
  },
  {
    id: 'urn:resourcetype:lectureAndPresentation',
    name: 'Forelesning og presentasjon',
    typeId: 'urn:resourcetype:subjectMaterial',
    typeName: 'Fagstoff',
  },
  {
    id: 'urn:resourcetype:drawingAndIllustration',
    name: 'Tegning og illustrasjon',
    typeId: 'urn:resourcetype:subjectMaterial',
    typeName: 'Fagstoff',
  },
  {
    id: 'urn:resourcetype:task',
    name: 'Oppgave',
    typeId: 'urn:resourcetype:tasksAndActivities',
    typeName: 'Oppgaver og aktiviteter',
  },
  {
    id: 'urn:resourcetype:exercise',
    name: 'Øvelse',
    typeId: 'urn:resourcetype:tasksAndActivities',
    typeName: 'Oppgaver og aktiviteter',
  },
  {
    id: 'urn:resourcetype:workAssignment',
    name: 'Arbeidsoppdrag',
    typeId: 'urn:resourcetype:tasksAndActivities',
    typeName: 'Oppgaver og aktiviteter',
  },
  {
    id: 'urn:resourcetype:game',
    name: 'Spill',
    typeId: 'urn:resourcetype:tasksAndActivities',
    typeName: 'Oppgaver og aktiviteter',
  },
  {
    id: 'urn:resourcetype:experiment',
    name: 'Forsøk',
    typeId: 'urn:resourcetype:tasksAndActivities',
    typeName: 'Oppgaver og aktiviteter',
  },
  {
    id: 'urn:resourcetype:selfEvaluation',
    name: 'Egenvurdering',
    typeId: 'urn:resourcetype:reviewResource',
    typeName: 'Vurderingsressurs',
  },
  {
    id: 'urn:resourcetype:teacherEvaluation',
    name: 'Lærervurdering',
    typeId: 'urn:resourcetype:reviewResource',
    typeName: 'Vurderingsressurs',
  },
  { id: 'urn:resourcetype:learningPath', name: 'Læringssti' },
  {
    id: 'urn:resourcetype:featureFilm',
    name: 'Spillefilm',
    typeId: 'urn:resourcetype:SourceMaterial',
    typeName: 'Kildemateriale',
  },
  {
    id: 'urn:resourcetype:shortFilm',
    name: 'Kortfilm',
    typeId: 'urn:resourcetype:SourceMaterial',
    typeName: 'Kildemateriale',
  },
  {
    id: 'urn:resourcetype:historicalMaterial',
    name: 'Historisk materiale',
    typeId: 'urn:resourcetype:SourceMaterial',
    typeName: 'Kildemateriale',
  },
  {
    id: 'urn:resourcetype:literaryText',
    name: 'Litterære tekster',
    typeId: 'urn:resourcetype:SourceMaterial',
    typeName: 'Kildemateriale',
  },
  {
    id: 'urn:resourcetype:paintingGraphicsPhoto',
    name: 'Malerier- grafikk -kunstfoto',
    typeId: 'urn:resourcetype:SourceMaterial',
    typeName: 'Kildemateriale',
  },
  {
    id: 'urn:resourcetype:externalLink',
    name: 'Ekstern lenke',
    typeId: 'urn:resourcetype:externalResource',
    typeName: 'Ekstern læringsressurs',
  },
  {
    id: 'urn:resourcetype:sharedLearningResource',
    name: 'Delt læringsressurs',
    typeId: 'urn:resourcetype:externalResource',
    typeName: 'Ekstern læringsressurs',
  },
  { id: 'urn:resourcetype:concept', name: 'Begrep' },
];
