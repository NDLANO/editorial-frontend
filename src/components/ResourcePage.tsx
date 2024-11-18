/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentType } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { mq, breakpoints } from "@ndla/core";
import { Spinner } from "@ndla/primitives";
import { HelmetWithTracker } from "@ndla/tracker";
import { NynorskTranslateProvider } from "./NynorskTranslateProvider";
import { useWideArticle } from "./WideArticleEditorProvider";
import { MAX_PAGE_WIDTH, MAX_PAGE_WIDTH_WITH_COMMENTS } from "../constants";
import Footer from "../containers/App/components/FooterWrapper";
import NotFoundPage from "../containers/NotFoundPage/NotFoundPage";
import { usePreviousLocation } from "../util/routeHelpers";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const PageContent = styled.div`
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  ${mq.range({ until: breakpoints.wide })} {
    padding-left: 24px;
    padding-right: 24px;
  }
  max-width: ${MAX_PAGE_WIDTH}px;
  &[data-article="true"] {
    max-width: ${MAX_PAGE_WIDTH_WITH_COMMENTS}px;
  }
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
  useHook: (params: { id: number; language?: string }, options?: Partial<UseQueryOptions<T>>) => UseQueryResult<T>;
  createUrl: string;
  titleTranslationKey?: string;
  isArticle?: boolean;
}

const ResourcePage = <T extends BaseResource>({
  CreateComponent,
  EditComponent,
  useHook,
  createUrl,
  titleTranslationKey,
  className,
  isArticle,
}: Props<T>) => {
  const { t } = useTranslation();
  const previousLocation = usePreviousLocation();
  const { isWideArticle } = useWideArticle();
  return (
    <Wrapper>
      <PageContent className={className} data-wide={isWideArticle} data-article={isArticle}>
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
  useHook: (params: { id: number; language?: string }, options?: Partial<UseQueryOptions<T>>) => UseQueryResult<T>;
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
  const { id } = useParams<"id">();
  const parsedId = Number(id);
  const { data, error, isLoading } = useHook({ id: parsedId, language: undefined }, { enabled: !!parsedId });
  if (isLoading) return <Spinner />;
  if (error || !data || !parsedId) return <NotFoundPage />;
  const supportedLanguage = data.supportedLanguages.find((l) => l === locale) ?? data.supportedLanguages[0];

  return (
    <Routes>
      <Route
        path="/:selectedLanguage/"
        element={<EditComponentWrapper isNewlyCreated={isNewlyCreated} Component={Component} />}
      />
      <Route path="/" element={<Navigate replace state={{ from: pathname }} to={supportedLanguage} />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

interface EditComponentWrapperProps {
  isNewlyCreated?: boolean;
  Component: ComponentType<ResourceComponentProps>;
}

const EditComponentWrapper = ({ isNewlyCreated, Component }: EditComponentWrapperProps) => {
  const { selectedLanguage } = useParams<"selectedLanguage">();

  return (
    <NynorskTranslateProvider>
      <Component key={selectedLanguage} isNewlyCreated={isNewlyCreated} />
    </NynorskTranslateProvider>
  );
};

export default ResourcePage;
