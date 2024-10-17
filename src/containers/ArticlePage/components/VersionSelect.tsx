/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection } from "@ark-ui/react";
import {
  SelectContent,
  SelectHiddenSelect,
  SelectItemGroup,
  SelectItemGroupLabel,
  SelectLabel,
  SelectPositioner,
  SelectRoot,
  SelectValueText,
} from "@ndla/primitives";
import { Version, VersionType } from "@ndla/types-taxonomy";
import { GenericSelectItem, GenericSelectTrigger } from "../../../components/abstractions/Select";
import { generateOptionGroups } from "../../../components/Taxonomy/OptGroupVersionSelector";
import { useTaxonomyVersion } from "../../StructureVersion/TaxonomyVersionProvider";

interface Props {
  onVersionChanged: (hash: string) => void;
  versions?: Version[];
}

const VersionSelect = ({ versions = [], onVersionChanged }: Props) => {
  const { taxonomyVersion } = useTaxonomyVersion();
  const { t } = useTranslation();

  const currentVersion = versions?.find((version) => version.hash === taxonomyVersion)?.hash;
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

  const fakeDefault = useMemo(() => {
    return { id: "", name: t("diff.defaultVersion"), type: "default" as VersionType };
  }, [t]);

  const collection = useMemo(() => {
    return createListCollection({
      items: [fakeDefault].concat(options),
      itemToString: (item) => item.name,
      itemToValue: (item) => item.id,
    });
  }, [fakeDefault, options]);

  return (
    <SelectRoot
      collection={collection}
      positioning={{ sameWidth: true }}
      value={currentVersion ? [currentVersion] : undefined}
      onValueChange={(details) => onVersionChanged(details.value[0])}
    >
      <SelectLabel>{t("taxonomy.version")}</SelectLabel>
      <GenericSelectTrigger>
        <SelectValueText placeholder={t("diff.defaultVersion")} />
      </GenericSelectTrigger>
      <SelectPositioner>
        <SelectContent>
          <GenericSelectItem key={fakeDefault.id} item={fakeDefault}>
            {fakeDefault.name}
          </GenericSelectItem>
          {optGroups.map((group) => (
            <SelectItemGroup key={group.label}>
              <SelectItemGroupLabel>{group.label}</SelectItemGroupLabel>
              {group.options.map((item) => (
                <GenericSelectItem key={item.id} item={item}>
                  {item.name}
                </GenericSelectItem>
              ))}
            </SelectItemGroup>
          ))}
        </SelectContent>
      </SelectPositioner>
      <SelectHiddenSelect />
    </SelectRoot>
  );
};

export default VersionSelect;
