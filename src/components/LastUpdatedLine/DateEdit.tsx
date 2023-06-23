/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { Pencil } from '@ndla/icons/action';
import { ButtonV2 } from '@ndla/button';
import DateTimeWrapper from '../DateTime/DateTimeWrapper';
import formatDate from '../../util/formatDate';

interface Props {
  published: string;
  onChange: (date: string) => void;
  name: string;
}

const DateEdit = ({ published, onChange, name, ...rest }: Props) => (
  <DateTimeWrapper {...rest} name={name} onChange={onChange} publishTime={published}>
    <ButtonV2 variant="link">
      {formatDate(published)} <Pencil />
    </ButtonV2>
  </DateTimeWrapper>
);

export default DateEdit;
