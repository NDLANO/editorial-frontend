/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { spacing, colors } from '@ndla/core';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import ObjectSelector from '../../components/ObjectSelector';
import { VersionStatusType, VersionType } from '../../modules/taxonomy/versions/versionApiTypes';
import { useVersions } from '../../modules/taxonomy/versions/versionQueries';
import { useTaxonomyVersion } from '../StructureVersion/TaxonomyVersionProvider';

type PossibleVersionTypes = VersionStatusType | 'default';

interface VersionTypeWithDefault extends Omit<VersionType, 'versionType'> {
  versionType: PossibleVersionTypes;
}

const versionTypeToColorMap: Record<PossibleVersionTypes, string> = {
  default: colors.brand.primary,
  PUBLISHED: colors.support.green,
  BETA: colors.support.yellow,
  ARCHIVED: colors.brand.grey,
};

interface StickyDivProps {
  color: string;
}

const StickyDiv = styled.div<StickyDivProps>`
  background-color: ${props => props.color};
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
`;

const StickyVersionSelector = () => {
  const { t } = useTranslation();
  const { taxonomyVersion, changeVersion } = useTaxonomyVersion();
  const { data } = useVersions();
  const qc = useQueryClient();

  const fakeDefault: VersionTypeWithDefault = {
    id: '',
    versionType: 'default',
    name: t('diff.defaultVersion'),
    hash: 'default',
    locked: false,
  };

  if (!data) return <></>;
  const currentVersion = data.find(version => version.hash === taxonomyVersion) ?? fakeDefault;

  const onVersionChanged = (newVersionHash: string) => {
    changeVersion(newVersionHash);
    qc.invalidateQueries();
  };

  const options = [fakeDefault]
    .concat(data)
    .map(version => ({ id: version.hash, label: version.name }));

  return (
    <StickyDiv color={versionTypeToColorMap[currentVersion.versionType]}>
      {t('taxonomy.currentVersion')}
      <ObjectSelector
        options={options}
        onChange={option => onVersionChanged(option.currentTarget.value)}
        onClick={evt => evt.stopPropagation()}
        name="currentHash"
        labelKey="label"
        idKey="id"
        value={currentVersion.hash}
      />
    </StickyDiv>
  );
};
export default StickyVersionSelector;
