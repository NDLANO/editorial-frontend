import React from 'react';
import { Pencil } from '@ndla/icons/action';
import Button from '@ndla/button';
import { css } from '@emotion/core';
import DateTimeWrapper from '../DateTime/DateTimeWrapper';
import formatDate from '../../util/formatDate';

const buttonCss = css`
  display: inline-flex;
  align-items: center;
`;

const iconCss = css`
  margin-left: 0.2em;
`;

interface Props {
  published: string;
}

const DateEdit = ({ published, ...rest }: Props) => (
  <DateTimeWrapper {...rest} publishTime={published}>
    <Button link css={buttonCss}>
      {formatDate(published)} <Pencil css={iconCss} />
    </Button>
  </DateTimeWrapper>
);

export default DateEdit;
