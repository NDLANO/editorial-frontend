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
import { SelectContent, SelectLabel, SelectRoot } from "@ndla/primitives";
import { ResourceType } from "@ndla/types-taxonomy";
import { GenericSelectItem, GenericSelectTrigger } from "../../../components/abstractions/Select";

type ResourceTypeWithoutSubtype = Omit<ResourceType, "subtypes">;

interface ResourceTypeWithParent extends ResourceTypeWithoutSubtype {
  parentType?: ResourceTypeWithoutSubtype;
}

interface Props {
  availableResourceTypes: ResourceType[];
  onChangeSelectedResource: (value: ResourceTypeWithParent) => void;
  selectedResourceType?: ResourceTypeWithParent;
}

const ResourceTypeSelect = ({ availableResourceTypes, selectedResourceType, onChangeSelectedResource }: Props) => {
  const { t } = useTranslation();

  const items = useMemo(
    (): ResourceTypeWithParent[] =>
      availableResourceTypes.flatMap((resourceType) =>
        resourceType.subtypes
          ? resourceType.subtypes.map((subtype) => ({
              ...subtype,
              parentType: resourceType,
            }))
          : [resourceType],
      ),
    [availableResourceTypes],
  );

  const collection = useMemo(() => {
    return createListCollection({
      items,
      itemToValue: (item) => item.id,
      itemToString: (item) => item.name,
    });
  }, [items]);

  return (
    <SelectRoot
      collection={collection}
      value={selectedResourceType ? [selectedResourceType.id] : undefined}
      onValueChange={(details) => onChangeSelectedResource(details.items[0])}
    >
      <SelectLabel>{t("taxonomy.contentType")}</SelectLabel>
      <GenericSelectTrigger>
        <SelectValueText placeholder={t("taxonomy.resourceTypes.placeholder")} />
      </GenericSelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <GenericSelectItem item={item} key={item.id}>
            {item.name}
          </GenericSelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
};

export default ResourceTypeSelect;
