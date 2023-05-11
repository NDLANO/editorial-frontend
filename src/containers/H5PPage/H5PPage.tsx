import { Global } from '@emotion/react';
import { HelmetWithTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import H5PElement from '../../components/H5PElement/H5PElement';

const H5PPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const locale = i18n.language;
  return (
    <>
      <Global
        styles={{
          '#h5p-editor': {
            height: '93vh',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      />
      <HelmetWithTracker title={t('htmlTitles.h5pPage')} />
      <H5PElement
        canReturnResources={false}
        onSelect={() => {}}
        onClose={() => {
          navigate('/');
        }}
        locale={locale}
      />
    </>
  );
};

export default H5PPage;
