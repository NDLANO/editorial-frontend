/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { SingleValue } from '@ndla/select';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { SafeLinkButton } from '@ndla/safelink';
import queryString from 'query-string';

const StyledSafeLinkButton = styled(SafeLinkButton)`
  height: fit-content;
`;

interface Props {
  ndlaId?: string;
  filterSubject?: SingleValue;
  searchEnv: 'content' | 'concept';
}

const GoToSearch = ({ ndlaId, filterSubject, searchEnv }: Props) => {
  const { t } = useTranslation();

  const onSearch = () => {
    const query = queryString.stringify({
      ...(filterSubject && { subjects: filterSubject.value }),
      ...(ndlaId && { 'responsible-ids': ndlaId }),
    });

    return `/search/${searchEnv}?${query}`;
  };

  return (
    <StyledSafeLinkButton to={onSearch()} size="small">
      {t('welcomePage.goToSearch')}
    </StyledSafeLinkButton>
  );
};

export default GoToSearch;
