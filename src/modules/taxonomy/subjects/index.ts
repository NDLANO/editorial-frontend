/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { apiResourceUrl, httpFunctions } from '../../../util/apiHelpers';
import { taxonomyApi } from '../../../config';
import { SubjectType } from '../taxonomyApiInterfaces';
import { resolveVoidOrRejectWithError } from '../../../util/resolveJsonOrRejectWithError';
import { WithTaxonomyVersion } from '../../../interfaces';
import { useSubjects } from './subjectsQueries';
import { SubjectPutBody } from './subjectApiInterfaces';

const subjectsUrl = apiResourceUrl(`${taxonomyApi}/subjects`);
const { fetchAndResolve, putAndResolve } = httpFunctions;

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

export { fetchSubjects, fetchSubject, updateSubject, useSubjects };
