/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import styled from '@emotion/styled';
import { Select, SingleValue } from '@ndla/select';
import { useTranslation } from 'react-i18next';
import { spacing } from '@ndla/core';
import { useMemo } from 'react';
import { VersionType } from '../../../modules/taxonomy/versions/versionApiTypes';
import { useTaxonomyVersion } from '../../StructureVersion/TaxonomyVersionProvider';
import { generateOptionGroupes } from '../../../components/Taxonomy/OptGroupVersionSelector';

const Wrapper = styled.div`
  margin-top: ${spacing.normal};
  margin-bottom: ${spacing.small};
`;

interface Props {
  onVersionChanged: (value: SingleValue) => void;
  versions?: VersionType[];
}

const getCurrentTaxVersion = (versions: VersionType[], oldTaxVersion: string): SingleValue => {
  const currentVersion = versions?.find(version => version.hash === oldTaxVersion);
  return currentVersion ? { value: currentVersion.hash, label: currentVersion.name } : null;
};

const VersionSelect = ({ versions = [], onVersionChanged }: Props) => {
  const { taxonomyVersion } = useTaxonomyVersion();
  const { t } = useTranslation();

  const fakeDefault = {
    value: '',
    label: t('diff.defaultVersion'),
  };

  const currentVersion = getCurrentTaxVersion(versions, taxonomyVersion) ?? fakeDefault;
  const options = versions.map(version => ({
    id: version.hash,
    name: version.name,
    type: version.versionType,
  }));
  const optGroups = useMemo(
    () =>
      generateOptionGroupes(options, t).map(g => ({
        label: g.label,
        options: g.options.map(o => ({ value: o.id, label: o.name })),
      })),
    [options, t],
  );

  return (
    <Wrapper>
      <Select<false>
        options={optGroups}
        value={currentVersion}
        onChange={onVersionChanged}
        prefix={`${t('taxonomy.version')}: `}
      />
    </Wrapper>
  );
};

export default VersionSelect;
