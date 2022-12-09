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
import { mq, breakpoints } from '@ndla/core';
import { NAVIGATION_HEADER_MARGIN } from '../../constants';
import { getAccessToken, getAccessTokenPersonal } from '../../util/authHelpers';
import { isValid } from '../../util/jwtHelper';
import SaveSearchUrl from './components/SaveSearchUrl';
import Footer from '../App/components/Footer';
import LastUsedItems from './components/LastUsedItems';
import { useUserData } from '../../modules/draft/draftQueries';
import { StyledColumnHeader } from './styles';
import WelcomeHeader from './components/WelcomeHeader';

const gridGap = '1.5em';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - ${NAVIGATION_HEADER_MARGIN});
  overflow: auto;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: ${gridGap};
`;

const GridHeader = styled.div`
  grid-column: 2 / 12;
`;
const GridContent = styled.div`
  grid-column: 3 / 11;
`;

const TwoColumn = styled.div`
  grid-template-columns: 1fr;
  display: grid;
  grid-gap: ${gridGap};
  ${mq.range({ from: breakpoints.tabletWide })} {
    grid-template-columns: 1fr 1fr;
  }
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
        <GridContent>
          <TwoColumn>
            <LastUsedItems lastUsed={lastUsed} />
            <div>
              <StyledColumnHeader>
                <SearchFolder className="c-icon--medium" />
                <span>{t('welcomePage.savedSearch')}</span>
              </StyledColumnHeader>
              <SaveSearchUrl />
            </div>
          </TwoColumn>
        </GridContent>
      </GridContainer>
      <Footer showLocaleSelector />
    </Wrapper>
  );
};

export default WelcomePage;
