/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC, Fragment, useEffect, useState } from 'react';
import BEMHelper from 'react-bem-helper';
//@ts-ignore
import { OneColumn } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { HelmetWithTracker } from '@ndla/tracker';
import { SearchFolder, LastUsed } from '@ndla/icons/editor';
import { RightArrow } from '@ndla/icons/action';
import styled from '@emotion/styled';
import Footer from '../App/components/Footer';
import { NAVIGATION_HEADER_MARGIN } from '../../constants';
import {
  getNdlaId,
  getAccessToken,
  getAccessTokenPersonal,
} from '../../util/authHelpers';
import { isValid } from '../../util/jwtHelper';
import { search } from '../../modules/search/searchApi';
import { ContentResultType, TranslateType } from '../../interfaces';

import LastUsedContent from './components/LastUsedContent';
import SaveSearchUrl from './components/SaveSearchUrl';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: calc(100vh - ${NAVIGATION_HEADER_MARGIN});
`;

export const classes = new BEMHelper({
  name: 'welcome',
  prefix: 'c-',
});

interface Props {
  locale: string;
  t: TranslateType;
}

export const WelcomePage: FC<Props> = ({ locale, t }) => {
  const [lastUsed, setLastUsed] = useState<ContentResultType[]>([]);

  const token = getAccessToken();
  const isAccessTokenPersonal = getAccessTokenPersonal();

  const fetchLastUsed = async () => {
    if (isValid(token) && isAccessTokenPersonal) {
      const lastUsed = await search({
        users: getNdlaId(),
        sort: '-lastUpdated',
      });
      setLastUsed(lastUsed.results);
    }
  };

  useEffect(() => {
    fetchLastUsed();
  }, []);

  localStorage.setItem('lastPath', '');

  return (
    <Fragment>
      <ContentWrapper>
        <HelmetWithTracker title={t('htmlTitles.welcomePage')} />
        <OneColumn>
          <div {...classes('header')}>
            <a href="#guidelines" {...classes('header-link')}>
              {t('welcomePage.guidelines')}
              <RightArrow className="c-icon--large" />
            </a>
            <img
              {...classes('header-image')}
              src="/welcome-image.jpg"
              alt="illustration"
            />
          </div>
          <div {...classes('two-column')}>
            <div>
              <div {...classes('column-header')}>
                <LastUsed className="c-icon--medium" />
                <span>{t('welcomePage.lastUsed')}</span>
              </div>
              {false && lastUsed.length ? (
                lastUsed.map((result: ContentResultType) => (
                  <LastUsedContent
                    key={result.id}
                    articleId={result.id}
                    content={result}
                    locale={locale}
                  />
                ))
              ) : (
                <span>{t('welcomePage.emptyLastUsed')}</span>
              )}
            </div>
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
    </Fragment>
  );
};

export default injectT(WelcomePage);
