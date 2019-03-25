import React from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/core';

const SearchConceptPage = props => {
  const accessToken = localStorage.getItem('access_token');
  return (
    <div>
      <iframe
        src={`https://explanations-frontend.test.api.ndla.no/embedded?accessToken=${accessToken}`}
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

SearchConceptPage.propTypes = {};

export default SearchConceptPage;
