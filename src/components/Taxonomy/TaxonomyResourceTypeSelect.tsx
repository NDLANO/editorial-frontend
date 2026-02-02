/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createListCollection } from "@ark-ui/react";
import { SelectContent, SelectLabel, SelectRoot, SelectValueText } from "@ndla/primitives";
import { ResourceType } from "@ndla/types-taxonomy";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { GenericSelectItem, GenericSelectTrigger } from "../abstractions/Select";

interface Props {
  resourceTypes: ResourceType[];
  blacklistedResourceTypes: string[];
  onResourceTypeChanged: (resourceTypes: ResourceType[]) => void;
  value: ResourceType[];
}

interface ResourceTypeWithParent extends ResourceType {
  parentType?: ResourceType;
}

const itemToString = (item: ResourceTypeWithParent) =>
  item.parentType ? `${item.parentType.name} - ${item.name}` : item.name;

export const TaxonomyResourceTypeSelect = ({
  blacklistedResourceTypes,
  resourceTypes,
  onResourceTypeChanged,
  value,
}: Props) => {
  const { t } = useTranslation();

  const filteredResourceTypes = useMemo(
    () =>
      resourceTypes
        .filter((rt) => !blacklistedResourceTypes.includes(rt.id))
        .map((rt) => ({
          ...rt,
          subtypes: rt?.subtypes?.filter((st) => !blacklistedResourceTypes.includes(st.id)),
        })) ?? [],
    [blacklistedResourceTypes, resourceTypes],
  );

  const items = useMemo(() => {
    return filteredResourceTypes.flatMap<ResourceTypeWithParent>((rt) => {
      if (!rt.subtypes) return [rt];
      return rt.subtypes.map((st) => ({ ...st, parentType: rt }));
    });
  }, [filteredResourceTypes]);

  const collection = useMemo(() => {
    return createListCollection({ items, itemToValue: (item) => item.id, itemToString });
  }, [items]);

  return (
    <SelectRoot
      multiple
      collection={collection}
      positioning={{ sameWidth: true }}
      value={value.filter((rt) => collection.has(rt.id)).map((rt) => rt.id)}
      onValueChange={(details) => {
        const uniq = new Set<ResourceType>();
        details.items.forEach((rt) => {
          uniq.add(rt);
          if (rt.parentType) {
            uniq.add(rt.parentType);
          }
        });
        onResourceTypeChanged(Array.from(uniq));
      }}
    >
      <SelectLabel>{t("taxonomy.contentType")}</SelectLabel>
      <GenericSelectTrigger asChild>
        <SelectValueText placeholder={t("taxonomy.resourceTypes.placeholder")} />
      </GenericSelectTrigger>
      <SelectContent>
        {collection.items.map((item) => (
          <GenericSelectItem key={item.id} item={item}>
            {itemToString(item)}
          </GenericSelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
};
