/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { HelmetWithTracker } from '@ndla/tracker';
import { SearchFolder } from '@ndla/icons/editor';
import styled from '@emotion/styled';
import { getAccessToken, getAccessTokenPersonal } from '../../util/authHelpers';
import { isValid } from '../../util/jwtHelper';
import SaveSearchUrl from './components/SaveSearchUrl';
import Footer from '../App/components/Footer';
import LastUsedItems from './components/LastUsedItems';
import { useUserData } from '../../modules/draft/draftQueries';
import { StyledColumnHeader } from './styles';
import WelcomeHeader from './components/WelcomeHeader';
import { GridContainer, GridHeader, LeftColumn, RightColumn } from '../../components/Layout/Layout';
import { NAVIGATION_HEADER_MARGIN } from '../../constants';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - ${NAVIGATION_HEADER_MARGIN});
`;

export const WelcomePage = () => {
  const { t } = useTranslation();
  const { data } = useUserData({
    enabled: isValid(getAccessToken()) && getAccessTokenPersonal(),
  });
  const lastUsed = data?.latestEditedArticles;

  localStorage.setItem('lastPath', '');

  return (
    <Wrapper>
      <GridContainer>
        <HelmetWithTracker title={t('htmlTitles.welcomePage')} />
        <GridHeader>
          <WelcomeHeader />
        </GridHeader>
        <LeftColumn>
          <LastUsedItems lastUsed={lastUsed} />
        </LeftColumn>
        <RightColumn>
          <StyledColumnHeader>
            <SearchFolder className="c-icon--medium" />
            <span>{t('welcomePage.savedSearch')}</span>
          </StyledColumnHeader>
          <SaveSearchUrl />
        </RightColumn>
      </GridContainer>

      <Footer showLocaleSelector />
    </Wrapper>
  );
};

export default WelcomePage;
