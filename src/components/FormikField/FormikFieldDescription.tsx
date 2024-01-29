/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { css } from "@emotion/react";
import styled from "@emotion/styled";

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
  ${(p: Props) => (p.obligatory ? obligatoryDescriptionStyle : "")};
`;

interface Props {
  description?: string;
  obligatory?: boolean;
}

const FormikFieldDescription = ({ description, obligatory }: Props) => {
  if (!description) {
    return null;
  }
  return (
    <StyledFormikDescriptionBlock>
      <StyledFormikDescription obligatory={obligatory}>{description}</StyledFormikDescription>
    </StyledFormikDescriptionBlock>
  );
};

export default FormikFieldDescription;
