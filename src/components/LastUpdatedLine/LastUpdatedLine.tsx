/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/core';
import { colors } from '@ndla/core';
import formatDate from '../../util/formatDate';

import DateEdit from './DateEdit';

const infoCss = css`
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
    <div css={infoCss}>
      {creators.map(creator => creator.name).join(', ')}
      {published ? ` - ${t('topicArticleForm.info.lastUpdated')}` : ''}
      {published &&
        (allowEdit ? (
          <DateEdit {...rest} name={name} onChange={onChange} published={published} />
        ) : (
          formatDate(published)
        ))}
    </div>
  );
};

LastUpdatedLine.propTypes = {
  creators: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
  published: PropTypes.string,
  allowEdit: PropTypes.bool,
};

export default LastUpdatedLine;
