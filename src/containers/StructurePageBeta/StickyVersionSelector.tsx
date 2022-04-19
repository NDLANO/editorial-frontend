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
import { VersionType } from '../../modules/taxonomy/versions/versionApiTypes';
import { useVersions } from '../../modules/taxonomy/versions/versionQueries';
import { useTaxonomyVersion } from '../StructureVersion/TaxonomyVersionProvider';

const StickyDiv = styled.div`
  background-color: ${colors.brand.primary};
  display: flex;
  position: sticky;
  bottom: ${spacing.normal};
  z-index: 2;
  color: white;
  border-radius: 20px;
  flex-direction: column;
  left: 50%;
  width: 40%;
  transform: translateX(-50%);
  padding: ${spacing.small};
`;

const fakeDefault: VersionType = {
  id: '',
  versionType: 'BETA',
  name: 'Default',
  hash: 'default',
  locked: false,
};
const StickyVersionSelector = () => {
  const { t } = useTranslation();
  const { taxonomyVersion, changeVersion } = useTaxonomyVersion();
  const { data } = useVersions({ taxonomyVersion });
  const qc = useQueryClient();

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
    <StickyDiv>
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
