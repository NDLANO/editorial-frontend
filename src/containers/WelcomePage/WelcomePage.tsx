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
import { useMemo } from 'react';
import { breakpoints } from '@ndla/core';
import { getAccessToken, getAccessTokenPersonal } from '../../util/authHelpers';
import SaveSearchUrl from './components/SaveSearchUrl';
import { isValid } from '../../util/jwtHelper';
import Footer from '../App/components/Footer';
import LastUsedItems from './components/LastUsedItems';
import { StyledColumnHeader } from './styles';
import { useUserData } from '../../modules/draft/draftQueries';
import WorkList from './components/worklist/WorkList';
import WelcomeHeader from './components/WelcomeHeader';
import { GridContainer, Column } from '../../components/Layout/Layout';
import { useSession } from '../Session/SessionProvider';
import Revisions from './components/Revisions';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;

export const WelcomePage = () => {
  const { t } = useTranslation();

  const { data } = useUserData({
    enabled: isValid(getAccessToken()) && getAccessTokenPersonal(),
  });
  const { ndlaId } = useSession();

  const lastUsedResources = useMemo(
    () => data?.latestEditedArticles?.map((a) => Number(a)) ?? [],
    [data?.latestEditedArticles],
  );
  localStorage.setItem('lastPath', '');

  return (
    <Wrapper>
      <GridContainer breakpoint={breakpoints.desktop}>
        <HelmetWithTracker title={t('htmlTitles.welcomePage')} />
        <Column>
          <WelcomeHeader />
        </Column>
        <Column>{ndlaId && <WorkList ndlaId={ndlaId} />}</Column>
        <Column colEnd={6}>
          {ndlaId && (
            <LastUsedItems
              lastUsedResources={lastUsedResources}
              lastUsedConcepts={data?.latestEditedConcepts}
            />
          )}
          {ndlaId && (
            <>
              <StyledColumnHeader>
                <SearchFolder className="c-icon--medium" />
                <span>{t('welcomePage.savedSearch')}</span>
              </StyledColumnHeader>
              <SaveSearchUrl />
            </>
          )}
        </Column>
        <Column colStart={6}>{ndlaId && <Revisions ndlaId={ndlaId} userData={data} />}</Column>
      </GridContainer>

      <Footer showLocaleSelector />
    </Wrapper>
  );
};

export default WelcomePage;
