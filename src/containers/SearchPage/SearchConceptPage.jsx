import React, { Fragment } from 'react';
import { css } from '@emotion/core';
import { injectT } from '@ndla/i18n';
import { HelmetWithTracker } from '@ndla/tracker';
import config from '../../config';

const SearchConceptPage = ({ t, ...props }) => {
  const accessToken = localStorage.getItem('access_token');
  return (
    <Fragment>
      <HelmetWithTracker title={t('htmlTitles.searchConceptPage')} />
      <iframe
        src={`${
          config.explanationFrontendDomain
        }/embedded?accessToken=${accessToken}`}
        title="concept"
        width="100%"
        height="100vh"
        css={iframeStyle}
      />
    </Fragment>
  );
};

const iframeStyle = css`
  height: 100vh;
  border: none;
`;

export default injectT(SearchConceptPage);
