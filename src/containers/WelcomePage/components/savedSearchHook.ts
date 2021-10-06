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

export const useSavedSearchUrl = (searchObject: any, locale: string): SearchUrlQueryData => {
  const subject = searchObject['subjects'] || '';
  const resourceType = searchObject['resource-types'] || '';
  const userId = searchObject['users'] || '';
  const searchHook = getSearchHookFromType(searchObject['type']);
  const { data: subjectData, isLoading: subjectLoading } = useSubject(subject, locale, {
    enabled: !!subject,
  });
  const { data: resourceTypeData, isLoading: resourceTypeLoading } = useResourceType(
    resourceType,
    locale,
    {
      enabled: !!resourceType,
    },
  );
  const { data: userData, isLoading: auth0UsersLoading } = useAuth0Users(userId, {
    enabled: !!userId,
  });
  const { data: searchResultData, isLoading: resultsLoading } = searchHook(searchObject);

  const loading = subjectLoading && resourceTypeLoading && auth0UsersLoading && resultsLoading;

  return {
    loading,
    data: {
      subject: subjectData,
      resourceType: resourceTypeData,
      user: userData,
      searchResult: searchResultData,
    },
  };
};
