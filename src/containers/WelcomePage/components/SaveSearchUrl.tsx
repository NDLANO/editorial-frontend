/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { getAccessToken, getAccessTokenPersonal } from '../../../util/authHelpers';
import { isValid } from '../../../util/jwtHelper';
import SavedSearch from './SavedSearch';
import { useUpdateUserDataMutation, useUserData } from '../../../modules/draft/draftQueries';

export const getSavedSearchRelativeUrl = (inputValue: string) => {
  const relativeUrl = inputValue.split('search')[1];
  return '/search'.concat(relativeUrl);
};

const SaveSearchUrl = () => {
  const { t } = useTranslation();
  const { data } = useUserData({
    enabled: isValid(getAccessToken()) && getAccessTokenPersonal(),
  });

  const userDataMutation = useUpdateUserDataMutation();

  if (!data) return null;

  const savedSearches = data.savedSearches ?? [];

  const deleteSearch = (index: number) => {
    const reduced_array = savedSearches.filter((_, idx) => idx !== index);
    userDataMutation.mutate({ savedSearches: reduced_array });
  };

  return (
    <>
      {savedSearches.length ? (
        savedSearches.map((search, index) => (
          <SavedSearch
            key={search}
            deleteSearch={deleteSearch}
            search={search}
            index={index}
            userData={data}
          />
        ))
      ) : (
        <span>{t('welcomePage.emptySavedSearch')}</span>
      )}
    </>
  );
};

export default SaveSearchUrl;
