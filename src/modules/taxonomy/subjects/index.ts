/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { apiResourceUrl, httpFunctions } from '../../../util/apiHelpers';
import { taxonomyApi } from '../../../config';
import { SubjectTopic, SubjectType } from '../taxonomyApiInterfaces';
import {
  resolveLocation,
  resolveVoidOrRejectWithError,
} from '../../../util/resolveJsonOrRejectWithError';
import { WithTaxonomyVersion } from '../../../interfaces';
import { useSubject, useSubjects } from './subjectsQueries';
import { SubjectPutBody, SubjectTopicPostBody } from './subjectApiInterfaces';

const subjectsUrl = apiResourceUrl(`${taxonomyApi}/subjects`);
const subjectTopicsUrl = apiResourceUrl(`${taxonomyApi}/subject-topics`);
const { fetchAndResolve, postAndResolve, putAndResolve } = httpFunctions;

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
  return fetchAndResolve({
    url: subjectsUrl,
    taxonomyVersion,
    queryParams: { key, value, language },
  });
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
    url: `${subjectsUrl}/${id}`,
    queryParams: { language },
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
  return fetchAndResolve({
    url: `${subjectsUrl}/${subject}/topics`,
    taxonomyVersion,
    queryParams: { language, recursive: true },
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

export {
  fetchSubjects,
  fetchSubject,
  fetchSubjectTopics,
  addSubjectTopic,
  updateSubject,
  useSubjects,
  useSubject,
};
