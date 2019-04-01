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

const NotionPage = props => {
  return (
    <StyledIframe
      src={`https://explanations-frontend.${
        config.ndlaEnvironment
      }.api.ndla.no`}
    />
  );
};

NotionPage.propTypes = {};

export default NotionPage;
