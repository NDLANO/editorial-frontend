/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection } from "@ark-ui/react";
import { SelectContent, SelectItemGroup, SelectItemGroupLabel, SelectRoot, SelectValueText } from "@ndla/primitives";
import { Version, VersionType } from "@ndla/types-taxonomy";
import { GenericSelectItem, GenericSelectTrigger } from "../abstractions/Select";

interface Props {
  versions: Version[];
  currentVersion?: string;
  onVersionChanged: (version: Version) => void;
  children?: ReactNode;
}

type OptGroups = {
  [key in Lowercase<VersionType>]: { id: string; name: string }[];
};

export const generateOptionGroups = (options: Version[], t: TFunction) => {
  const { published, beta, archived } = options.reduce<OptGroups>(
    (acc, curr) => {
      const type = curr.versionType.toLowerCase() as Lowercase<VersionType>;
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
    { label: t("taxonomyVersions.status.PUBLISHED"), options: published },
    { label: t("taxonomyVersions.status.BETA"), options: beta },
    { label: t("taxonomyVersions.status.ARCHIVED"), options: archived },
  ].filter((group) => group.options.length > 0);

  return optGroups;
};

export const OptGroupVersionSelector = ({
  versions,
  currentVersion: currentVersionProp,
  onVersionChanged,
  children,
}: Props) => {
  const { t } = useTranslation();

  const fakeDefault = useMemo(
    () => ({
      id: "",
      versionType: "default",
      name: t("diff.defaultVersion"),
      hash: "default",
      locked: false,
      created: "",
    }),
    [t],
  );

  const currentVersion = currentVersionProp ?? fakeDefault.hash;

  const collection = useMemo(() => {
    return createListCollection({
      items: [fakeDefault as Version].concat(versions),
      itemToString: (item) => item.name,
      itemToValue: (item) => item.hash,
    });
  }, [fakeDefault, versions]);

  const optGroups = useMemo(() => generateOptionGroups(versions, t), [t, versions]);

  return (
    <SelectRoot
      collection={collection}
      value={[currentVersion]}
      positioning={{ sameWidth: true }}
      onValueChange={(details) => {
        onVersionChanged(details.items[0]);
      }}
    >
      {children}
      <GenericSelectTrigger>
        <SelectValueText />
      </GenericSelectTrigger>
      <SelectContent>
        <GenericSelectItem item={fakeDefault}>{fakeDefault.name}</GenericSelectItem>
        {optGroups.map((optGroup) => (
          <SelectItemGroup key={optGroup.label}>
            <SelectItemGroupLabel>{optGroup.label}</SelectItemGroupLabel>
            {optGroup.options.map((option) => (
              <GenericSelectItem key={option.id} item={option}>
                {option.name}
              </GenericSelectItem>
            ))}
          </SelectItemGroup>
        ))}
      </SelectContent>
    </SelectRoot>
  );
};

export default OptGroupVersionSelector;
