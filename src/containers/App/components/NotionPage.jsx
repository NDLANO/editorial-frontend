import React from 'react';
import styled from '@emotion/styled';
import config from '../../../config';

const StyledIframe = styled.iframe`
  height: 100vh;
  margin-top: -140px;
  padding-top: 104px;
  width: 100%;
  box-sizing: border-box;
  border: none;
`;

const NotionPage = () => {
  return <StyledIframe src={config.explanationFrontendDomain} />;
};

export default NotionPage;
