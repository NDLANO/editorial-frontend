/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import uniq from 'lodash/uniq';
import { ResourceType } from '@ndla/types-taxonomy';
import { Auth0UserData, SearchResultBase } from '../../../interfaces';
import { useAuth0Users } from '../../../modules/auth0/auth0Queries';
import { useResourceType } from '../../../modules/taxonomy/resourcetypes';
import { useSubject } from '../../../modules/taxonomy/subjects';
import { SubjectType } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { getSearchHookFromType } from '../../../util/searchHelpers';

interface SearchUrlData {
  subject?: SubjectType;
  resourceType?: ResourceType;
  user?: Auth0UserData;
  responsible?: Auth0UserData;
  searchResult?: SearchResultBase<any>;
}

interface SearchUrlQueryData {
  data: SearchUrlData;
  loading: boolean;
}

export const useSavedSearchUrl = (
  searchObject: any,
  locale: string,
  taxonomyVersion: string,
): SearchUrlQueryData => {
  const subject = searchObject['subjects'] || '';
  const resourceType = searchObject['resource-types'] || '';
  if (searchObject['users']) {
    searchObject['users'] = searchObject['users'].replaceAll('"', '');
  }
  const userId = searchObject['users'] || '';
  const responsibleId = searchObject['responsible-ids'];

  const searchHook = getSearchHookFromType(searchObject['type']);
  const { data: subjectData, isInitialLoading: subjectLoading } = useSubject(
    { id: subject, language: locale, taxonomyVersion },
    { enabled: !!subject && !subject.includes(',') },
  );
  const { data: resourceTypeData, isInitialLoading: resourceTypeLoading } = useResourceType(
    { id: resourceType, language: locale, taxonomyVersion },
    { enabled: !!resourceType },
  );
  const { data: userData, isInitialLoading: auth0UsersLoading } = useAuth0Users(
    { uniqueUserIds: `${uniq([userId, responsibleId]).join(',')}` },
    { enabled: !!userId },
  );
  const { data: searchResultData, isInitialLoading: resultsLoading } = searchHook(searchObject);

  const loading = subjectLoading && resourceTypeLoading && auth0UsersLoading && resultsLoading;

  const [user, responsible] = userData ?? [];

  return {
    loading,
    data: {
      subject: subjectData,
      resourceType: resourceTypeData,
      user: user,
      responsible: userId === responsibleId ? user : responsible,
      searchResult: searchResultData,
    },
  };
};
