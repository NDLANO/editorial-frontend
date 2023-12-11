/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { Version } from '@ndla/types-taxonomy';
import UIVersion from './Version';

const StyledVersionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

interface Props {
  versions: Version[];
}
const VersionList = ({ versions }: Props) => {
  const { t } = useTranslation();
  if (versions.length === 0) {
    return <div>{t('taxonomyVersions.noOtherVersions')}</div>;
  }
  return (
    <StyledVersionList>
      {versions.map((version) => (
        <UIVersion version={version} key={version.id} />
      ))}
    </StyledVersionList>
  );
};
export default VersionList;
