/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

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
  onChange: (date: string) => void;
  name: string;
}

const DateEdit = ({ published, onChange, name, ...rest }: Props) => (
  <DateTimeWrapper {...rest} name={name} onChange={onChange} publishTime={published}>
    <Button link css={buttonCss}>
      {formatDate(published)} <Pencil css={iconCss} />
    </Button>
  </DateTimeWrapper>
);

export default DateEdit;
