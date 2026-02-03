/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createListCollection } from "@ark-ui/react";
import { SelectRoot, SelectLabel, SelectValueText, SelectContent } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useMemo } from "react";
import { GenericSelectItem, GenericSelectTrigger } from "./abstractions/Select";

const StyledGenericSelectTrigger = styled(GenericSelectTrigger, {
  base: {
    width: "100%",
  },
});

const StyledSelectValueText = styled(SelectValueText, {
  base: {
    lineClamp: "1",
    overflowWrap: "anywhere",
  },
});

const StyledGenericSelectItem = styled(GenericSelectItem, {
  base: {
    overflowWrap: "anywhere",
  },
});

export interface SelectElement<T> {
  name: keyof T;
  multiple?: boolean;
  options: SelectOption[];
}

export interface SelectOption {
  id: string;
  name: string;
}

interface Props {
  options: SelectOption[];
  value: string;
  onChange: (value: string[]) => void;
  placeholder: string;
  multiple?: boolean;
  name: string;
}
const ObjectSelector = ({ options, multiple, onChange, value, placeholder, name }: Props) => {
  const collection = useMemo(
    () =>
      createListCollection({
        items: options,
        itemToValue: (item) => item.id,
        itemToString: (item) => item.name,
      }),
    [options],
  );

  return (
    <SelectRoot
      data-testid={`${name}-select`}
      collection={collection}
      multiple={multiple}
      positioning={{ sameWidth: true, strategy: "fixed" }}
      value={multiple && value ? value.split(",") : value ? [value] : []}
      onValueChange={(details) => onChange(details.value)}
    >
      <SelectLabel srOnly>{placeholder}</SelectLabel>
      <StyledGenericSelectTrigger>
        <StyledSelectValueText placeholder={placeholder} />
      </StyledGenericSelectTrigger>
      <SelectContent>
        {collection.items.map((option) => (
          <StyledGenericSelectItem item={option} key={option.id}>
            {option.name}
          </StyledGenericSelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
};

export default ObjectSelector;
