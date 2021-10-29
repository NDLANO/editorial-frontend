import React from 'react';
import { Global } from '@emotion/react';
import { HelmetWithTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router-dom';
import H5PElement from '../../components/H5PElement/H5PElement';
import { HistoryShape } from '../../shapes';

const H5PPage = ({ history }: RouteComponentProps) => {
  const { t, i18n } = useTranslation();
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
          history.push('/');
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
