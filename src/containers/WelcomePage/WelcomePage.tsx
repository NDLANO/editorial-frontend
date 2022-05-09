/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { OneColumn } from '@ndla/ui';
import { spacing } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import { HelmetWithTracker } from '@ndla/tracker';
import { SearchFolder } from '@ndla/icons/editor';
import styled from '@emotion/styled';
import { NAVIGATION_HEADER_MARGIN } from '../../constants';
import { getAccessToken, getAccessTokenPersonal } from '../../util/authHelpers';
import { isValid } from '../../util/jwtHelper';

import SaveSearchUrl from './components/SaveSearchUrl';
import Footer from '../App/components/Footer';
import LastUsedItems from './components/LastUsedItems';
import { useUserData } from '../../modules/draft/draftQueries';
import { StyledColumnHeader } from './styles';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - ${NAVIGATION_HEADER_MARGIN});
  overflow: auto;
`;

const StyledHeader = styled.div`
  width: 100%;
  height: 200px;
  overflow: hidden;
  display: flex;
  align-items: center;
`;

const StyledHeaderImage = styled.img`
  margin-top: -250px;
`;

const StyledTwoColumn = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  width: 80%;
  margin-top: ${spacing.large};
  & > div {
    flex: 1;
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
    <ContentWrapper>
      <HelmetWithTracker title={t('htmlTitles.welcomePage')} />
      <OneColumn>
        <StyledHeader>
          {/* <a href="#guidelines" {...classes('header-link')}>
              {t('welcomePage.guidelines')}
              <RightArrow className="c-icon--large" />
            </a> */}
          <StyledHeaderImage src="/welcome-image.jpg" alt="illustration" />
        </StyledHeader>
        <StyledTwoColumn>
          <LastUsedItems lastUsed={lastUsed} />
          <div>
            <StyledColumnHeader>
              <SearchFolder className="c-icon--medium" />
              <span>{t('welcomePage.savedSearch')}</span>
            </StyledColumnHeader>
            <SaveSearchUrl />
          </div>
        </StyledTwoColumn>
      </OneColumn>
      <Footer showLocaleSelector />
    </ContentWrapper>
  );
};

export default WelcomePage;
