/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useTranslation } from 'react-i18next';
import { HelmetWithTracker } from '@ndla/tracker';
import PublishRequestsContainer from './PublishRequestsContainer';

const PublishRequestsPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <HelmetWithTracker title={t('htmlTitles.publishRequestsPage')} />
      <PublishRequestsContainer />
    </>
  );
};

export default PublishRequestsPage;
