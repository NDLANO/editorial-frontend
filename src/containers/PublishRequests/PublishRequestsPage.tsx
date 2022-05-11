import { HelmetWithTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
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
