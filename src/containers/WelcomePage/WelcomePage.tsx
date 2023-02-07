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
import { mq, breakpoints, spacing } from '@ndla/core';
import { NAVIGATION_HEADER_MARGIN } from '../../constants';
import { getAccessToken, getAccessTokenPersonal } from '../../util/authHelpers';
import { isValid } from '../../util/jwtHelper';
import SaveSearchUrl from './components/SaveSearchUrl';
import Footer from '../App/components/Footer';
import LastUsedItems from './components/LastUsedItems';
import { useUserData } from '../../modules/draft/draftQueries';
import { StyledColumnHeader } from './styles';
import WorkList from './components/WorkList';
import WelcomeHeader from './components/WelcomeHeader';
import { useSession } from '../Session/SessionProvider';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - ${NAVIGATION_HEADER_MARGIN});
`;

const GridContainer = styled.div`
  ${mq.range({ from: '0px', until: breakpoints.tabletWide })} {
    padding: ${spacing.nsmall};
    display: flex;
    flex-direction: column;
    gap: ${spacing.nsmall};
  }
  ${mq.range({ from: breakpoints.tabletWide })} {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-gap: 1em;
    max-width: 1400px;
    justify-self: center;
    align-self: center;
    width: 100%;
  }
`;

const MainArea = styled.div`
  grid-column: 2 / 12;
`;

const LeftColumn = styled.div`
  grid-column: 2 / 7;
`;
const RightColumn = styled.div`
  grid-column: 7 / 12;
`;

export const WelcomePage = () => {
  const { t } = useTranslation();
  const { data } = useUserData({
    enabled: isValid(getAccessToken()) && getAccessTokenPersonal(),
  });
  const { ndlaId } = useSession();
  const lastUsed = data?.latestEditedArticles?.map(l => Number(l)) ?? [];

  localStorage.setItem('lastPath', '');

  return (
    <Wrapper>
      <GridContainer>
        <HelmetWithTracker title={t('htmlTitles.welcomePage')} />
        <MainArea>
          <WelcomeHeader />
        </MainArea>
        <MainArea>{ndlaId && <WorkList ndlaId={ndlaId} />}</MainArea>
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
