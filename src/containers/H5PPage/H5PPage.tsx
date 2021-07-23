import React from 'react';
import { Global } from '@emotion/react';
import { HelmetWithTracker } from '@ndla/tracker';
import { injectT, tType } from '@ndla/i18n';
import { LocaleContext } from '../App/App';
import H5PElement from '../../components/H5PElement/H5PElement';
import { HistoryShape } from '../../shapes';

interface Props {
  history: { push: (path: string) => void };
}

const H5PPage = ({ t, history }: Props & tType) => {
  return (
    <LocaleContext.Consumer>
      {locale => (
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
      )}
    </LocaleContext.Consumer>
  );
};

H5PPage.propTypes = {
  history: HistoryShape,
};

export default injectT(H5PPage);
