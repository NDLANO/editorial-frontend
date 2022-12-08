/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isFavouritesSearch } from '../../SearchPage/components/form/SearchContentForm';
import { Auth0UserData, SearchResultBase } from '../../../interfaces';
import { useAuth0Users } from '../../../modules/auth0/auth0Queries';
import { useResourceType } from '../../../modules/taxonomy/resourcetypes';
import { useSubject } from '../../../modules/taxonomy/subjects';
import { ResourceType, SubjectType } from '../../../modules/taxonomy/taxonomyApiInterfaces';
import { getSearchHookFromType } from '../../../util/searchHelpers';

interface SearchUrlData {
  subject?: SubjectType;
  resourceType?: ResourceType;
  user?: Auth0UserData[];
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
  favouriteSubject?: SubjectType,
): SearchUrlQueryData => {
  const subject = searchObject['subjects'] ?? '';
  const resourceType = searchObject['resource-types'] || '';
  if (searchObject['users']) {
    searchObject['users'] = searchObject['users'].replaceAll('"', '');
  }
  const userId = searchObject['users'] || '';
  const searchHook = getSearchHookFromType(searchObject['type']);
  const { data: subjectData, isLoading: subjectLoading } = useSubject(
    { id: subject, language: locale, taxonomyVersion },
    { enabled: subject.includes('favourites') ? false : !!subject },
  );
  const { data: resourceTypeData, isLoading: resourceTypeLoading } = useResourceType(
    { id: resourceType, language: locale, taxonomyVersion },
    { enabled: !!resourceType },
  );
  const { data: userData, isLoading: auth0UsersLoading } = useAuth0Users(
    { uniqueUserIds: userId },
    { enabled: !!userId },
  );
  searchObject['subjects'] = isFavouritesSearch(searchObject['subjects'], favouriteSubject?.id);
  const { data: searchResultData, isLoading: resultsLoading } = searchHook(searchObject);

  const loading = subjectLoading && resourceTypeLoading && auth0UsersLoading && resultsLoading;

  return {
    loading,
    data: {
      subject: searchObject['subjects'].includes(',') ? favouriteSubject : subjectData,
      resourceType: resourceTypeData,
      user: userData,
      searchResult: searchResultData,
    },
  };
};
