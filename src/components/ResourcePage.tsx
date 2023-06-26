/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentType } from 'react';
import loadable from '@loadable/component';
import { useTranslation } from 'react-i18next';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { HelmetWithTracker } from '@ndla/tracker';
import styled from '@emotion/styled';
import { usePreviousLocation } from '../util/routeHelpers';
import Footer from '../containers/App/components/Footer';
import Spinner from './Spinner';
import { NynorskTranslateProvider } from './NynorskTranslateProvider';
import { useFrontpageArticle } from '../containers/ArticlePage/FrontpageArticlePage/components/FrontpageArticleProvider';
import { FRONTPAGE_ARTICLE_WIDTH } from '../containers/ArticlePage/styles';
import { MAX_PAGE_WIDTH } from '../constants';

const NotFoundPage = loadable(() => import('../containers/NotFoundPage/NotFoundPage'));

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const PageContent = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 24px;
  padding-right: 24px;

  &[data-wide='true'] {
    max-width: ${FRONTPAGE_ARTICLE_WIDTH}px;
  }
  max-width: ${MAX_PAGE_WIDTH}px;
`;
interface ResourceComponentProps {
  isNewlyCreated?: boolean;
}

interface BaseResource {
  supportedLanguages: string[];
}

interface Props<T extends BaseResource> {
  CreateComponent: ComponentType;
  EditComponent: ComponentType<ResourceComponentProps>;
  className?: string;
  useHook: (
    params: { id: number; language?: string },
    options?: UseQueryOptions<T>,
  ) => UseQueryResult<T>;
  createUrl: string;
  titleTranslationKey?: string;
}

const ResourcePage = <T extends BaseResource>({
  CreateComponent,
  EditComponent,
  useHook,
  createUrl,
  titleTranslationKey,
  className,
}: Props<T>) => {
  const { t } = useTranslation();
  const previousLocation = usePreviousLocation();
  const { isFrontpageArticle } = useFrontpageArticle();

  return (
    <Wrapper>
      <PageContent className={className} data-wide={isFrontpageArticle}>
        {titleTranslationKey && <HelmetWithTracker title={t(titleTranslationKey)} />}
        <Routes>
          <Route path="new" element={<CreateComponent />} />
          <Route
            path=":id/edit/*"
            element={
              <EditResourceRedirect
                Component={EditComponent}
                useHook={useHook}
                isNewlyCreated={previousLocation === createUrl}
              />
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </PageContent>
      <Footer showLocaleSelector={false} />
    </Wrapper>
  );
};

interface EditResourceRedirectProps<T extends BaseResource> {
  isNewlyCreated: boolean;
  useHook: (
    params: { id: number; language?: string },
    options?: UseQueryOptions<T>,
  ) => UseQueryResult<T>;
  Component: ComponentType<ResourceComponentProps>;
}

const EditResourceRedirect = <T extends BaseResource>({
  isNewlyCreated,
  useHook,
  Component,
}: EditResourceRedirectProps<T>) => {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const locale = i18n.language;
  const { id } = useParams<'id'>();
  const parsedId = Number(id);
  const { data, error, isInitialLoading } = useHook(
    { id: parsedId, language: undefined },
    { enabled: !!parsedId },
  );
  if (isInitialLoading) return <Spinner />;
  if (error || !data || !parsedId) return <NotFoundPage />;
  const supportedLanguage =
    data.supportedLanguages.find((l) => l === locale) ?? data.supportedLanguages[0];

  return (
    <Routes>
      <Route
        path="/:selectedLanguage/"
        element={<EditComponentWrapper isNewlyCreated={isNewlyCreated} Component={Component} />}
      />
      <Route
        path="/"
        element={<Navigate replace state={{ from: pathname }} to={supportedLanguage} />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

interface EditComponentWrapperProps {
  isNewlyCreated?: boolean;
  Component: ComponentType<ResourceComponentProps>;
}

const EditComponentWrapper = ({ isNewlyCreated, Component }: EditComponentWrapperProps) => {
  const { selectedLanguage } = useParams<'selectedLanguage'>();

  return (
    <NynorskTranslateProvider>
      <Component key={selectedLanguage} isNewlyCreated={isNewlyCreated} />
    </NynorskTranslateProvider>
  );
};

export default ResourcePage;
