/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IStatus } from '@ndla/types-backend/search-api';
import styled from '@emotion/styled';
import { Check } from '@ndla/icons/editor';
import { spacing, colors } from '@ndla/core';
import Tooltip from '@ndla/tooltip';
import { useTranslation } from 'react-i18next';
import { CellWrapper } from './WorkListTabContent';

const IconWrapper = styled.div`
  overflow: hidden;
`;

const TextWrapper = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const StyledCheckIcon = styled(Check)`
  height: ${spacing.nsmall};
  width: ${spacing.nsmall};
  fill: ${colors.support.green};
`;

interface Props {
  status: IStatus | undefined;
}

const StatusCell = ({ status }: Props) => {
  const { t } = useTranslation();
  const published = status?.current === 'PUBLISHED' || status?.other?.includes('PUBLISHED');
  const statusTitle = status?.current ? t(`form.status.${status.current.toLowerCase()}`) : '';

  return (
    <CellWrapper>
      <TextWrapper title={statusTitle}>{statusTitle}</TextWrapper>
      {published && (
        <Tooltip tooltip={t('form.workflow.published')}>
          <IconWrapper>
            <StyledCheckIcon />
          </IconWrapper>
        </Tooltip>
      )}
    </CellWrapper>
  );
};

export default StatusCell;
