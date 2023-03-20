/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { colors } from '@ndla/core';
import formatDate from '../../util/formatDate';

import DateEdit from './DateEdit';

const StyledLastUpdatedLine = styled.div`
  color: ${colors.text.light};
  line-height: 1.4rem;
`;

interface Creator {
  name: string;
  type: string;
}

type Creators = Creator[];

interface Props {
  creators: Creators;
  allowEdit?: boolean;
  published?: string;
  onChange: (date: string) => void;
  name: string;
}

const LastUpdatedLine = ({
  creators,
  published,
  onChange,
  allowEdit = false,
  name,
  ...rest
}: Props) => {
  const { t } = useTranslation();
  return (
    <StyledLastUpdatedLine>
      {creators.map((creator) => creator.name).join(', ')}
      {published ? ` - ${t('topicArticleForm.info.lastUpdated')}` : ''}
      {published &&
        (allowEdit ? (
          <DateEdit {...rest} name={name} onChange={onChange} published={published} />
        ) : (
          formatDate(published)
        ))}
    </StyledLastUpdatedLine>
  );
};

export default LastUpdatedLine;
