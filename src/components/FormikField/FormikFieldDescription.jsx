import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { css } from '@emotion/core';

const StyledFormikDescriptionBlock = styled.span`
  display: flex;
`;

const obligatoryDescriptionStyle = css`
  background-color: rgba(230, 132, 154, 1);
  padding: 0.2em 0.6em;
`;

const StyledFormikDescription = styled.p`
  margin: 0.2em 0;
  font-size: 0.75em;
  ${p => (p.obligatory ? obligatoryDescriptionStyle : '')};
`;

const FormikFieldDescription = ({ description, obligatory }) => {
  if (!description) {
    return null;
  }
  return (
    <StyledFormikDescriptionBlock>
      <StyledFormikDescription obligatory={obligatory}>
        {description}
      </StyledFormikDescription>
    </StyledFormikDescriptionBlock>
  );
};

FormikFieldDescription.propTypes = {
  obligatory: PropTypes.bool,
  description: PropTypes.string,
};

export default FormikFieldDescription;
