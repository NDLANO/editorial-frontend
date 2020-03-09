/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Fragment, useEffect, useState } from 'react';
import BEMHelper from 'react-bem-helper';
import PropTypes from 'prop-types';
import { OneColumn } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { HelmetWithTracker } from '@ndla/tracker';
import { SearchFolder, LastUsed } from '@ndla/icons/editor';
import { RightArrow } from '@ndla/icons/action';
import styled from '@emotion/styled';
import Footer from '../App/components/Footer';
import { NAVIGATION_HEADER_MARGIN } from '../../constants';
import { getNdlaId } from '../../util/authHelpers';
import { search } from '../../modules/search/searchApi';
import LastUsedContent from './components/LastUsedContent';

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

export const WelcomePage = ({ locale, t }) => {
  const [lastUsed, setLastUsed] = useState(undefined);

  const fetchLastUsed = async () => {
    const lastUsed = await search({
      users: getNdlaId(),
      sort: '-lastUpdated',
    });
    setLastUsed(lastUsed);
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

              {lastUsed ? (
                lastUsed.results.map(result => (
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
              <span>{t('welcomePage.emptySavedSearch')}</span>
            </div>
          </div>
        </OneColumn>
        <Footer showLocaleSelector />
      </ContentWrapper>
    </Fragment>
  );
};

WelcomePage.propTypes = {
  locale: PropTypes.string.isRequired,
};

export default injectT(WelcomePage);
