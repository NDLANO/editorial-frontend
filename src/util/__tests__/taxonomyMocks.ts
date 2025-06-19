/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const resourceTypesMock = [
  {
    id: "urn:resourcetype:subjectMaterial",
    name: "Fagstoff",
    subtypes: [
      {
        id: "urn:resourcetype:academicArticle",
        name: "Fagartikkel",
      },
      {
        id: "urn:resourcetype:movieAndClip",
        name: "Film og filmklipp",
      },
      {
        id: "urn:resourcetype:guidance",
        name: "Veiledning",
      },
      {
        id: "urn:resourcetype:dictionary",
        name: "Oppslagsverk og ordliste",
      },
      {
        id: "urn:resourcetype:toolAndTemplate",
        name: "Verktøy og mal",
      },
      {
        id: "urn:resourcetype:simulation",
        name: "Simulering",
      },
      {
        id: "urn:resourcetype:lectureAndPresentation",
        name: "Forelesning og presentasjon",
      },
      {
        id: "urn:resourcetype:drawingAndIllustration",
        name: "Tegning og illustrasjon",
      },
    ],
  },
  {
    id: "urn:resourcetype:tasksAndActivities",
    name: "Oppgaver og aktiviteter",
    subtypes: [
      {
        id: "urn:resourcetype:task",
        name: "Oppgave",
      },
      {
        id: "urn:resourcetype:exercise",
        name: "Øvelse",
      },
      {
        id: "urn:resourcetype:workAssignment",
        name: "Arbeidsoppdrag",
      },
      {
        id: "urn:resourcetype:game",
        name: "Spill",
      },
      {
        id: "urn:resourcetype:experiment",
        name: "Forsøk",
      },
    ],
  },
  {
    id: "urn:resourcetype:reviewResource",
    name: "Vurderingsressurs",
    subtypes: [
      {
        id: "urn:resourcetype:selfEvaluation",
        name: "Egenvurdering",
      },
      {
        id: "urn:resourcetype:teacherEvaluation",
        name: "Lærervurdering",
      },
    ],
  },
  {
    id: "urn:resourcetype:learningPath",
    name: "Læringssti",
  },
  {
    id: "urn:resourcetype:SourceMaterial",
    name: "Kildemateriale",
    subtypes: [
      {
        id: "urn:resourcetype:featureFilm",
        name: "Spillefilm",
      },
      {
        id: "urn:resourcetype:shortFilm",
        name: "Kortfilm",
      },
      {
        id: "urn:resourcetype:historicalMaterial",
        name: "Historisk materiale",
      },
      {
        id: "urn:resourcetype:literaryText",
        name: "Litterære tekster",
      },
      {
        id: "urn:resourcetype:paintingGraphicsPhoto",
        name: "Malerier- grafikk -kunstfoto",
      },
    ],
  },
  {
    id: "urn:resourcetype:concept",
    name: "Forklaring",
    subtypes: [
      {
        id: "urn:resourcetype:conceptArticle",
        name: "Forklaringsartikkel",
      },
    ],
  },
];

export const flattenedResourceTypes = [
  {
    id: "urn:resourcetype:academicArticle",
    name: "Fagartikkel",
    typeId: "urn:resourcetype:subjectMaterial",
    typeName: "Fagstoff",
  },
  {
    id: "urn:resourcetype:movieAndClip",
    name: "Film og filmklipp",
    typeId: "urn:resourcetype:subjectMaterial",
    typeName: "Fagstoff",
  },
  {
    id: "urn:resourcetype:guidance",
    name: "Veiledning",
    typeId: "urn:resourcetype:subjectMaterial",
    typeName: "Fagstoff",
  },
  {
    id: "urn:resourcetype:dictionary",
    name: "Oppslagsverk og ordliste",
    typeId: "urn:resourcetype:subjectMaterial",
    typeName: "Fagstoff",
  },
  {
    id: "urn:resourcetype:toolAndTemplate",
    name: "Verktøy og mal",
    typeId: "urn:resourcetype:subjectMaterial",
    typeName: "Fagstoff",
  },
  {
    id: "urn:resourcetype:simulation",
    name: "Simulering",
    typeId: "urn:resourcetype:subjectMaterial",
    typeName: "Fagstoff",
  },
  {
    id: "urn:resourcetype:lectureAndPresentation",
    name: "Forelesning og presentasjon",
    typeId: "urn:resourcetype:subjectMaterial",
    typeName: "Fagstoff",
  },
  {
    id: "urn:resourcetype:drawingAndIllustration",
    name: "Tegning og illustrasjon",
    typeId: "urn:resourcetype:subjectMaterial",
    typeName: "Fagstoff",
  },
  {
    id: "urn:resourcetype:task",
    name: "Oppgave",
    typeId: "urn:resourcetype:tasksAndActivities",
    typeName: "Oppgaver og aktiviteter",
  },
  {
    id: "urn:resourcetype:exercise",
    name: "Øvelse",
    typeId: "urn:resourcetype:tasksAndActivities",
    typeName: "Oppgaver og aktiviteter",
  },
  {
    id: "urn:resourcetype:workAssignment",
    name: "Arbeidsoppdrag",
    typeId: "urn:resourcetype:tasksAndActivities",
    typeName: "Oppgaver og aktiviteter",
  },
  {
    id: "urn:resourcetype:game",
    name: "Spill",
    typeId: "urn:resourcetype:tasksAndActivities",
    typeName: "Oppgaver og aktiviteter",
  },
  {
    id: "urn:resourcetype:experiment",
    name: "Forsøk",
    typeId: "urn:resourcetype:tasksAndActivities",
    typeName: "Oppgaver og aktiviteter",
  },
  {
    id: "urn:resourcetype:selfEvaluation",
    name: "Egenvurdering",
    typeId: "urn:resourcetype:reviewResource",
    typeName: "Vurderingsressurs",
  },
  {
    id: "urn:resourcetype:teacherEvaluation",
    name: "Lærervurdering",
    typeId: "urn:resourcetype:reviewResource",
    typeName: "Vurderingsressurs",
  },
  {
    id: "urn:resourcetype:featureFilm",
    name: "Spillefilm",
    typeId: "urn:resourcetype:SourceMaterial",
    typeName: "Kildemateriale",
  },
  {
    id: "urn:resourcetype:shortFilm",
    name: "Kortfilm",
    typeId: "urn:resourcetype:SourceMaterial",
    typeName: "Kildemateriale",
  },
  {
    id: "urn:resourcetype:historicalMaterial",
    name: "Historisk materiale",
    typeId: "urn:resourcetype:SourceMaterial",
    typeName: "Kildemateriale",
  },
  {
    id: "urn:resourcetype:literaryText",
    name: "Litterære tekster",
    typeId: "urn:resourcetype:SourceMaterial",
    typeName: "Kildemateriale",
  },
  {
    id: "urn:resourcetype:paintingGraphicsPhoto",
    name: "Malerier- grafikk -kunstfoto",
    typeId: "urn:resourcetype:SourceMaterial",
    typeName: "Kildemateriale",
  },
  {
    id: "urn:resourcetype:conceptArticle",
    name: "Forklaringsartikkel",
    typeId: "urn:resourcetype:concept",
    typeName: "Forklaring",
  },
  { id: "learningpath", name: "Læringssti" },
  { id: "topic-article", name: "Emne" },
  { id: "frontpage-article", name: "Forsideartikkel" },
  { id: "concept", name: "Forklaring" },
  { id: "gloss", name: "Glose" },
];
