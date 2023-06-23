import { useMemo } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { Version, VersionType } from '@ndla/types-taxonomy';
import ObjectSelector from '../ObjectSelector';

interface Props {
  versions: Version[];
  currentVersion?: Version;
  onVersionChanged: (version: string) => void;
}

type OptGroups = {
  [key in Lowercase<VersionType>]: { id: string; name: string }[];
};

interface VersionTypeWithDefault extends Omit<Version, 'versionType'> {
  versionType: PossibleVersionTypes;
}

type PossibleVersionTypes = VersionType | 'default';

export const generateOptionGroups = (
  options: {
    id: string;
    name: string;
    type: VersionType;
  }[],
  t: TFunction,
) => {
  const { published, beta, archived } = options.reduce<OptGroups>(
    (acc, curr) => {
      const type = curr.type.toLowerCase() as Lowercase<VersionType>;
      acc[type].push(curr);
      return acc;
    },
    {
      published: [],
      beta: [],
      archived: [],
    },
  );

  const optGroups = [
    { label: t('taxonomyVersions.status.PUBLISHED'), options: published },
    { label: t('taxonomyVersions.status.BETA'), options: beta },
    { label: t('taxonomyVersions.status.ARCHIVED'), options: archived },
  ].filter((group) => group.options.length > 0);

  return optGroups;
};

const OptGroupVersionSelector = ({
  versions,
  currentVersion: currentVersionProp,
  onVersionChanged,
}: Props) => {
  const { t } = useTranslation();

  const fakeDefault: VersionTypeWithDefault = {
    id: '',
    versionType: 'default',
    name: t('diff.defaultVersion'),
    hash: 'default',
    locked: false,
    created: '',
  };
  const currentVersion = currentVersionProp ?? fakeDefault;
  const options = useMemo(
    () =>
      versions.map((version) => ({
        id: version.hash,
        name: version.name,
        type: version.versionType,
      })),
    [versions],
  );
  const optGroups = useMemo(() => generateOptionGroups(options, t), [options, t]);

  return (
    <ObjectSelector
      options={[fakeDefault]}
      optGroups={optGroups}
      onChange={(option) => onVersionChanged(option.currentTarget.value)}
      onClick={(evt) => evt.stopPropagation()}
      name="currentHash"
      labelKey="name"
      idKey="id"
      value={currentVersion.hash}
    />
  );
};

export default OptGroupVersionSelector;
