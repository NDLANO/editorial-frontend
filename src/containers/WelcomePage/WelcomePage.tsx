/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import BEMHelper from 'react-bem-helper';
//@ts-ignore
import { OneColumn } from '@ndla/ui';
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

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - ${NAVIGATION_HEADER_MARGIN});
  overflow: auto;
`;

export const classes = new BEMHelper({
  name: 'welcome',
  prefix: 'c-',
});

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
        <div {...classes('header')}>
          {/* <a href="#guidelines" {...classes('header-link')}>
              {t('welcomePage.guidelines')}
              <RightArrow className="c-icon--large" />
            </a> */}
          <img {...classes('header-image')} src="/welcome-image.jpg" alt="illustration" />
        </div>
        <div {...classes('two-column')}>
          <LastUsedItems lastUsed={lastUsed} />
          <div>
            <div {...classes('column-header')}>
              <SearchFolder className="c-icon--medium" />
              <span>{t('welcomePage.savedSearch')}</span>
            </div>
            <SaveSearchUrl />
          </div>
        </div>
      </OneColumn>
      <Footer showLocaleSelector />
    </ContentWrapper>
  );
};

export default WelcomePage;
