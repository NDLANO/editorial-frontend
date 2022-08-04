/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { Pencil } from '@ndla/icons/action';
import Button from '@ndla/button';
import styled from '@emotion/styled';
import DateTimeWrapper from '../DateTime/DateTimeWrapper';
import formatDate from '../../util/formatDate';

const StyledButton = styled(Button)`
  display: inline-flex;
  align-items: center;
`;

const StyledPencil = styled(Pencil)`
  margin-left: 0.2em;
`;

interface Props {
  published: string;
  onChange: (date: string) => void;
  name: string;
}

const DateEdit = ({ published, onChange, name, ...rest }: Props) => (
  <DateTimeWrapper {...rest} name={name} onChange={onChange} publishTime={published}>
    <StyledButton link>
      {formatDate(published)} <StyledPencil />
    </StyledButton>
  </DateTimeWrapper>
);

export default DateEdit;
