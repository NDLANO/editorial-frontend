/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { useQueryClient } from '@tanstack/react-query';
import { spacing, colors } from '@ndla/core';
import { VersionType } from '@ndla/types-taxonomy';
import OptGroupVersionSelector from '../../components/Taxonomy/OptGroupVersionSelector';
import { useVersions } from '../../modules/taxonomy/versions/versionQueries';
import { useTaxonomyVersion } from '../StructureVersion/TaxonomyVersionProvider';

const versionTypeToColorMap: Record<VersionType | 'default', string> = {
  default: colors.brand.primary,
  PUBLISHED: colors.support.green,
  BETA: colors.support.yellow,
  ARCHIVED: colors.brand.grey,
};

interface StickyDivProps {
  color: string;
}

const StickyDiv = styled.div<StickyDivProps>`
  background-color: ${(props) => props.color};
  display: flex;
  position: sticky;
  bottom: ${spacing.normal};
  z-index: 1;
  color: white;
  border-radius: 20px;
  flex-direction: column;
  left: 50%;
  width: 40%;
  transform: translateX(-50%);
  padding: ${spacing.small};
  max-width: 400px;
`;

const StickyVersionSelector = () => {
  const { t } = useTranslation();
  const { taxonomyVersion, changeVersion } = useTaxonomyVersion();
  const { data } = useVersions();
  const qc = useQueryClient();

  if (!data) return <></>;
  const currentVersion = data.find((version) => version.hash === taxonomyVersion);

  const onVersionChanged = (newVersionHash: string) => {
    const oldVersion = taxonomyVersion;
    changeVersion(newVersionHash);
    qc.removeQueries({
      predicate: (query) => {
        const qk = query.queryKey as [string, Record<string, any>];
        return qk[1]?.taxonomyVersion === oldVersion;
      },
    });
  };

  return (
    <StickyDiv color={versionTypeToColorMap[currentVersion?.versionType ?? 'default']}>
      {t('taxonomy.currentVersion')}
      <OptGroupVersionSelector versions={data} currentVersion={currentVersion} onVersionChanged={onVersionChanged} />
    </StickyDiv>
  );
};

export default StickyVersionSelector;
