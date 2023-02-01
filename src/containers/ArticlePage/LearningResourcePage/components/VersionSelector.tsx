/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { Select } from '@ndla/forms';
import { useVersions } from '../../../../modules/taxonomy/versions/versionQueries';
import { useTaxonomyVersion } from '../../../StructureVersion/TaxonomyVersionProvider';

const VersionSelector = () => {
  const { t } = useTranslation();
  const { taxonomyVersion, changeVersion } = useTaxonomyVersion();
  const { data } = useVersions();
  const qc = useQueryClient();

  if (!data) return <></>;
  const currentVersion = data.find(version => version.hash === taxonomyVersion);
  console.log('taxVerion', taxonomyVersion, data);
  const onVersionChanged = (newVersionHash: string) => {
    const oldVersion = taxonomyVersion;
    changeVersion(newVersionHash);
    qc.removeQueries({
      predicate: query => {
        const qk = query.queryKey as [string, Record<string, any>];
        return qk[1]?.taxonomyVersion === oldVersion;
      },
    });
  };
  const options = data.map(version => ({
    id: version.hash,
    name: version.name,
    type: version.versionType,
  }));

  console.log(currentVersion);

  return (
    <Select value={'test'} onChange={() => console.log('change')}>
      {options.map(option => (
        <option key={option.id}>{option.name}</option>
      ))}
    </Select>
  );
};

export default VersionSelector;
