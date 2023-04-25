/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { IStatus } from '@ndla/types-backend/search-api';
import { StyledCheckIcon } from '../../../../components/HeaderWithLanguage/HeaderStatusInformation';

interface Props {
  status: IStatus | undefined;
}

const PublishedStatus = ({ status }: Props) => {
  const published = status?.current === 'PUBLISHED' || status?.other?.includes('PUBLISHED');

  return <>{published && <StyledCheckIcon />}</>;
};

export default PublishedStatus;
