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
import { UseQueryOptions, UseQueryResult } from 'react-query';
import { OneColumn } from '@ndla/ui';
import { HelmetWithTracker } from '@ndla/tracker';
import { usePreviousLocation } from '../util/routeHelpers';
import Footer from '../containers/App/components/Footer';
import Spinner from './Spinner';
const NotFoundPage = loadable(() => import('../containers/NotFoundPage/NotFoundPage'));

interface ResourceComponentProps {
  isNewlyCreated: boolean;
}

interface BaseResource {
  supportedLanguages: string[];
}

interface Props<T extends BaseResource> {
  CreateComponent: ComponentType;
  EditComponent: ComponentType<ResourceComponentProps>;
  useHook: (id: number, language?: string, options?: UseQueryOptions<T>) => UseQueryResult<T>;
  createUrl: string;
  titleTranslationKey?: string;
}

const ResourcePage = <T extends BaseResource>({
  CreateComponent,
  EditComponent,
  useHook,
  createUrl,
  titleTranslationKey,
}: Props<T>) => {
  const { t } = useTranslation();
  const previousLocation = usePreviousLocation();
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <OneColumn>
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
      </OneColumn>
      <Footer showLocaleSelector={false} />
    </div>
  );
};

interface EditResourceRedirectProps<T extends BaseResource> {
  isNewlyCreated: boolean;
  useHook: (id: number, language?: string, options?: UseQueryOptions<T>) => UseQueryResult<T>;
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
  const { data, error, isLoading } = useHook(parsedId, undefined, { enabled: !!parsedId });
  if (isLoading) return <Spinner />;
  if (error || !data || !parsedId) return <NotFoundPage />;
  const supportedLanguage =
    data.supportedLanguages.find(l => l === locale) ?? data.supportedLanguages[0];

  return (
    <Routes>
      <Route path="/:selectedLanguage/" element={<Component isNewlyCreated={isNewlyCreated} />} />
      <Route
        path="/"
        element={<Navigate replace state={{ from: pathname }} to={supportedLanguage} />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
export default ResourcePage;
