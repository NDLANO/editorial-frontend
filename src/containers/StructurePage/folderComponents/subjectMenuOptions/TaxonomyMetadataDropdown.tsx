/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { createListCollection } from "@ark-ui/react";
import {
  SelectContent,
  SelectHiddenSelect,
  SelectLabel,
  SelectPositioner,
  SelectRoot,
  SelectValueText,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { GenericSelectItem, GenericSelectTrigger } from "../../../../components/abstractions/Select";

const StyledGenericSelectTrigger = styled(GenericSelectTrigger, {
  base: { flexGrow: "1" },
});
interface Option {
  key: string;
  value: string;
}
interface Props {
  field: string;
  options: Option[];
  customFields: Record<string, string>;
  updateCustomFields: (newFields: Record<string, string>) => void;
  messages: Record<string, string>;
}

const TaxonomyMetadataDropdown = ({ options, field, customFields, updateCustomFields, messages }: Props) => {
  const collection = useMemo(() => {
    return createListCollection({
      items: options,
      itemToString: (item) => item.value,
      itemToValue: (item) => item.key,
    });
  }, [options]);

  return (
    <SelectRoot
      collection={collection}
      value={[customFields[field]]}
      onValueChange={(details) =>
        updateCustomFields({
          ...customFields,
          [field]: details.value[0],
        })
      }
      positioning={{ sameWidth: true }}
    >
      <SelectLabel>{messages["title"]}</SelectLabel>
      <StyledGenericSelectTrigger size="small" clearable>
        <SelectValueText placeholder={messages["selected"]} />
      </StyledGenericSelectTrigger>
      <SelectPositioner>
        <SelectContent>
          {collection.items.map((item) => (
            <GenericSelectItem key={`sortoptions_${item.key}`} item={item}>
              {item.value}
            </GenericSelectItem>
          ))}
        </SelectContent>
      </SelectPositioner>
      <SelectHiddenSelect />
    </SelectRoot>
  );
};

export default TaxonomyMetadataDropdown;
