import React from 'react';
import { css } from '@emotion/core';
import config from '../../config';

const SearchConceptPage = props => {
  const accessToken = localStorage.getItem('access_token');
  return (
    <div>
      <iframe
        src={`${
          config.explanationFrontendDomain
        }/embedded?accessToken=${accessToken}`}
        title="concept"
        width="100%"
        height="100vh"
        css={iframeStyle}
      />
    </div>
  );
};

const iframeStyle = css`
  height: 100vh;
  border: none;
`;

export default SearchConceptPage;
