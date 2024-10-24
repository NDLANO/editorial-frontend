/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection } from "@ark-ui/react";
import {
  ComboboxContent,
  ComboboxItem,
  ComboboxItemText,
  ComboboxLabel,
  ComboboxPositioner,
  ComboboxRoot,
  Text,
} from "@ndla/primitives";
import { useComboboxTranslations } from "@ndla/ui";
import { GenericComboboxInput, GenericComboboxItemIndicator } from "../../../components/abstractions/Combobox";

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
  isClearable?: boolean;
}
const ResourceTypeSelect = ({ availableResourceTypes, onChangeSelectedResource, isClearable = false }: Props) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const comboboxTranslations = useComboboxTranslations();

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

  const filteredOptions = useMemo(() => {
    return options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));
  }, [options, query]);

  const collection = useMemo(() => {
    return createListCollection({
      items: filteredOptions,
      itemToValue: (item) => item.value,
      itemToString: (item) => item.label,
    });
  }, [filteredOptions]);

  return (
    <ComboboxRoot
      inputValue={query}
      onInputValueChange={(details) => setQuery(details.inputValue)}
      collection={collection}
      translations={comboboxTranslations}
      onValueChange={(details) => onChangeSelectedResource(details.items[0]?.value)}
    >
      <ComboboxLabel>{t("taxonomy.contentType")}</ComboboxLabel>
      <GenericComboboxInput clearable={isClearable} triggerable placeholder={t("taxonomy.resourceTypes.placeholder")} />
      <ComboboxPositioner>
        <ComboboxContent>
          {!filteredOptions.length && <Text>{t("form.responsible.noResults")}</Text>}
          {filteredOptions.map((item) => (
            <ComboboxItem item={item} key={item.value}>
              <ComboboxItemText>{item.label}</ComboboxItemText>
              <GenericComboboxItemIndicator />
            </ComboboxItem>
          ))}
        </ComboboxContent>
      </ComboboxPositioner>
    </ComboboxRoot>
  );
};

export default ResourceTypeSelect;
