/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SelectValueText, createListCollection } from "@ark-ui/react";
import { SelectContent, SelectLabel, SelectPositioner, SelectRoot } from "@ndla/primitives";
import { GenericSelectItem, GenericSelectTrigger } from "../../../components/abstractions/Select";
import { selectedResourceTypeValue } from "../../../util/taxonomyHelpers";

interface ResourceType {
  id: string;
  name: string;
  parentId?: string;
}

interface ResourceTypeWithSubtypes extends ResourceType {
  subtypes?: ResourceType[];
}

interface Props {
  onChangeSelectedResource: (value?: string) => void;
  availableResourceTypes: ResourceTypeWithSubtypes[];
  selectedResourceTypes?: ResourceType[];
}
const ResourceTypeSelect = ({ availableResourceTypes, selectedResourceTypes, onChangeSelectedResource }: Props) => {
  const { t } = useTranslation();

  const options = useMemo(
    () =>
      availableResourceTypes.flatMap((resourceType) =>
        resourceType.subtypes
          ? resourceType.subtypes.map((subtype) => ({
              label: `${resourceType.name} - ${subtype.name}`,
              value: `${resourceType.id},${subtype.id}`,
            }))
          : { label: resourceType.name, value: resourceType.id },
      ),
    [availableResourceTypes],
  );

  const value = useMemo(
    () =>
      selectedResourceTypes?.length
        ? options.find((o) => o.value === selectedResourceTypeValue(selectedResourceTypes))
        : undefined,
    [options, selectedResourceTypes],
  );

  const collection = useMemo(() => {
    return createListCollection({
      items: options,
      itemToValue: (item) => item.value,
      itemToString: (item) => item.label,
    });
  }, [options]);

  return (
    <SelectRoot
      collection={collection}
      value={value ? [value.value] : undefined}
      onValueChange={(details) => onChangeSelectedResource(details.items[0]?.value)}
    >
      <SelectLabel>{t("taxonomy.contentType")}</SelectLabel>
      <GenericSelectTrigger>
        <SelectValueText placeholder={t("taxonomy.resourceTypes.placeholder")} />
      </GenericSelectTrigger>
      <SelectPositioner>
        <SelectContent>
          {options.map((item) => (
            <GenericSelectItem item={item} key={item.value}>
              {item.label}
            </GenericSelectItem>
          ))}
        </SelectContent>
      </SelectPositioner>
    </SelectRoot>
  );
};

export default ResourceTypeSelect;
