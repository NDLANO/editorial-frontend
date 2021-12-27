import { Global } from '@emotion/core';
import { HelmetWithTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import H5PElement from '../../components/H5PElement/H5PElement';
import { HistoryShape } from '../../shapes';

const H5PPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const locale = i18n.language;
  return (
    <>
      <Global
        styles={{
          '.o-content': {
            height: '100vh',
            display: 'flex',
            'flex-direction': 'column',
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

H5PPage.propTypes = {
  history: HistoryShape,
};

export default H5PPage;
