/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { VersionType } from '../../../modules/taxonomy/versions/versionApiTypes';
import Version from './Version';

const StyledVersionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

interface Props {
  versions: VersionType[];
}
const VersionList = ({ versions }: Props) => {
  return (
    <StyledVersionList>
      {versions.map(version => (
        <Version version={version} key={version.id} />
      ))}
    </StyledVersionList>
  );
};
export default VersionList;
