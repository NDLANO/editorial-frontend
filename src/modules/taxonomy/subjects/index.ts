/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
import { apiResourceUrl, httpFunctions } from '../../../util/apiHelpers';
import { taxonomyApi } from '../../../config';
import {
  TaxNameTranslation,
  SubjectTopic,
  SubjectType,
  TaxonomyMetadata,
} from '../taxonomyApiInterfaces';
import {
  resolveLocation,
  resolveVoidOrRejectWithError,
} from '../../../util/resolveJsonOrRejectWithError';
import { LocaleType, WithTaxonomyVersion } from '../../../interfaces';
import { useSubject, useSubjects } from './subjectsQueries';
import {
  SubjectMetadataPutBody,
  SubjectNameTranslationPutBody,
  SubjectPostBody,
  SubjectPutBody,
  SubjectTopicPostBody,
  SubjectTopicPutBody,
} from './subjectApiInterfaces';

const subjectsUrl = apiResourceUrl(`${taxonomyApi}/subjects`);
const subjectTopicsUrl = apiResourceUrl(`${taxonomyApi}/subject-topics`);
const { fetchAndResolve, postAndResolve, putAndResolve, deleteAndResolve } = httpFunctions;

const stringifyQuery = (object: Record<string, any> = {}) => {
  const stringified = `?${queryString.stringify(object)}`;
  return stringified === '?' ? '' : stringified;
};

interface FetchSubjectsParams extends WithTaxonomyVersion {
  language: string;
  metadataFilter?: { key: string; value?: string };
}

const fetchSubjects = ({
  language,
  taxonomyVersion,
  metadataFilter,
}: FetchSubjectsParams): Promise<SubjectType[]> => {
  const { key, value } = metadataFilter ?? {};
  const query = stringifyQuery({ key, value, language });
  return fetchAndResolve({ url: `${subjectsUrl}${query}`, taxonomyVersion });
};

interface FetchSubjectParams extends WithTaxonomyVersion {
  id: string;
  language?: string;
}

const fetchSubject = ({
  id,
  language,
  taxonomyVersion,
}: FetchSubjectParams): Promise<SubjectType> => {
  return fetchAndResolve({
    url: `${subjectsUrl}/${id}${stringifyQuery({ language })}`,
    taxonomyVersion,
  });
};

interface FetchSubjectTopicsParams extends WithTaxonomyVersion {
  subject: string;
  language: string;
}

const fetchSubjectTopics = ({
  subject,
  language,
  taxonomyVersion,
}: FetchSubjectTopicsParams): Promise<SubjectTopic[]> => {
  const query = stringifyQuery({ language, recursive: true });
  return fetchAndResolve({ url: `${subjectsUrl}/${subject}/topics${query}`, taxonomyVersion });
};

interface SubjectPostParams extends WithTaxonomyVersion {
  body: SubjectPostBody;
}

const addSubject = ({ body, taxonomyVersion }: SubjectPostParams): Promise<string> => {
  return postAndResolve({
    url: subjectsUrl,
    taxonomyVersion,
    body: JSON.stringify(body),
    alternateResolve: resolveLocation,
  });
};

interface SubjectTopicPostParams extends WithTaxonomyVersion {
  body: SubjectTopicPostBody;
}

const addSubjectTopic = ({ body, taxonomyVersion }: SubjectTopicPostParams): Promise<string> => {
  return postAndResolve({
    url: subjectTopicsUrl,
    taxonomyVersion,
    body: JSON.stringify(body),
    alternateResolve: resolveLocation,
  });
};

interface SubjectTopicPutParams extends WithTaxonomyVersion {
  connectionId: string;
  body: SubjectTopicPutBody;
}

const updateSubjectTopic = ({
  connectionId,
  taxonomyVersion,
  body,
}: SubjectTopicPutParams): Promise<void> => {
  return putAndResolve({
    url: `${subjectTopicsUrl}/${connectionId}`,
    taxonomyVersion,
    body: JSON.stringify(body),
    alternateResolve: resolveVoidOrRejectWithError,
  });
};

interface SubjectPutParams extends WithTaxonomyVersion {
  id: string;
  body: SubjectPutBody;
}

const updateSubject = ({ id, body, taxonomyVersion }: SubjectPutParams): Promise<void> => {
  return putAndResolve({
    url: `${subjectsUrl}/${id}`,
    taxonomyVersion,
    body: JSON.stringify({ name: body.name, contentUri: body.contentUri }),
    alternateResolve: resolveVoidOrRejectWithError,
  });
};

interface SubjectDeleteParams extends WithTaxonomyVersion {
  id: string;
}

const deleteSubject = ({ id, taxonomyVersion }: SubjectDeleteParams): Promise<void> => {
  return deleteAndResolve({
    url: `${subjectsUrl}/${id}`,
    taxonomyVersion,
    alternateResolve: resolveVoidOrRejectWithError,
  });
};

interface SubjectMetadataPutParams extends WithTaxonomyVersion {
  subjectId: string;
  body: SubjectMetadataPutBody;
}

const updateSubjectMetadata = ({
  subjectId,
  body,
  taxonomyVersion,
}: SubjectMetadataPutParams): Promise<TaxonomyMetadata> => {
  return putAndResolve({
    url: `${subjectsUrl}/${subjectId}/metadata`,
    taxonomyVersion,
    body: JSON.stringify(body),
  });
};

interface SubjectNameTranslationsGetParams extends WithTaxonomyVersion {
  subjectId: string;
}

const fetchSubjectNameTranslations = ({
  subjectId,
  taxonomyVersion,
}: SubjectNameTranslationsGetParams): Promise<TaxNameTranslation[]> => {
  return fetchAndResolve({ url: `${subjectsUrl}/${subjectId}/translations`, taxonomyVersion });
};

interface SubjectNameTranslationPutParams extends WithTaxonomyVersion {
  subjectId: string;
  language: LocaleType;
  body: SubjectNameTranslationPutBody;
}

const updateSubjectNameTranslation = ({
  subjectId,
  language,
  body,
  taxonomyVersion,
}: SubjectNameTranslationPutParams): Promise<void> => {
  return putAndResolve({
    url: `${subjectsUrl}/${subjectId}/translations/${language}`,
    taxonomyVersion,
    body: JSON.stringify({ name: body.name }),
    alternateResolve: resolveVoidOrRejectWithError,
  });
};

interface SubjectNameTranslationDeleteParams extends WithTaxonomyVersion {
  subjectId: string;
  language: LocaleType;
}

const deleteSubjectNameTranslation = ({
  subjectId,
  language,
  taxonomyVersion,
}: SubjectNameTranslationDeleteParams): Promise<void> => {
  return deleteAndResolve({
    url: `${subjectsUrl}/${subjectId}/translations/${language}`,
    taxonomyVersion,
    alternateResolve: resolveVoidOrRejectWithError,
  });
};

export {
  fetchSubjects,
  fetchSubject,
  fetchSubjectTopics,
  addSubject,
  addSubjectTopic,
  updateSubjectTopic,
  updateSubjectMetadata,
  updateSubject,
  deleteSubject,
  fetchSubjectNameTranslations,
  updateSubjectNameTranslation,
  deleteSubjectNameTranslation,
  useSubjects,
  useSubject,
};
