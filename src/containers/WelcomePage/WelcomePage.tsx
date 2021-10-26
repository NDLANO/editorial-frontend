/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useContext, useEffect, useState } from 'react';
import BEMHelper from 'react-bem-helper';
//@ts-ignore
import { OneColumn } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { HelmetWithTracker } from '@ndla/tracker';
import { SearchFolder, LastUsed } from '@ndla/icons/editor';
import styled from '@emotion/styled';
import { NAVIGATION_HEADER_MARGIN } from '../../constants';
import { getAccessToken, getAccessTokenPersonal } from '../../util/authHelpers';
import { isValid } from '../../util/jwtHelper';
import { fetchUserData } from '../../modules/draft/draftApi';
import { UserAccessContext } from '../App/App';

import LastUsedContent from './components/LastUsedContent';
import SaveSearchUrl from './components/SaveSearchUrl';
import Footer from '../App/components/Footer';

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
  const { t, i18n } = useTranslation();
  const [lastUsed, setLastUsed] = useState<string[]>([]);
  const locale = i18n.language;
  const userAccess: string | undefined = useContext(UserAccessContext);

  const token = getAccessToken();
  const isAccessTokenPersonal = getAccessTokenPersonal();

  useEffect(() => {
    const fetchLastUsed = async () => {
      if (isValid(token) && isAccessTokenPersonal) {
        const result = await fetchUserData();
        const lastUsed = result.latestEditedArticles || [];
        setLastUsed(lastUsed);
      }
    };
    fetchLastUsed();
  }, [isAccessTokenPersonal, token]);

  localStorage.setItem('lastPath', '');

  return (
    <Fragment>
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
            <div>
              <div {...classes('column-header')}>
                <LastUsed className="c-icon--medium" />
                <span>{t('welcomePage.lastUsed')}</span>
              </div>
              {lastUsed.length ? (
                lastUsed.map((result: string) => {
                  return (
                    <LastUsedContent
                      key={result}
                      articleId={parseInt(result)}
                      locale={locale}
                      userAccess={userAccess}
                    />
                  );
                })
              ) : (
                <span>{t('welcomePage.emptyLastUsed')}</span>
              )}
            </div>
            <div>
              <div {...classes('column-header')}>
                <SearchFolder className="c-icon--medium" />
                <span>{t('welcomePage.savedSearch')}</span>
              </div>
              <SaveSearchUrl locale={locale} />
            </div>
          </div>
        </OneColumn>
        <Footer showLocaleSelector />
      </ContentWrapper>
    </Fragment>
  );
};

export default WelcomePage;
