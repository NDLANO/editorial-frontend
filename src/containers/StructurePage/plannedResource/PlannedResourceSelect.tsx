/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createListCollection } from "@ark-ui/react";
import {
  ComboboxContent,
  ComboboxItem,
  ComboboxItemText,
  ComboboxLabel,
  ComboboxRoot,
  FieldErrorMessage,
  FieldRoot,
  Text,
} from "@ndla/primitives";
import { useComboboxTranslations } from "@ndla/ui";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { GenericComboboxInput, GenericComboboxItemIndicator } from "../../../components/abstractions/Combobox";
import { FormField } from "../../../components/FormField";

interface Props {
  label: string;
  fieldName: string;
  placeholder: string;
  options: { label: string; value: string }[];
  defaultValue?: { label: string; value: string };
}

const PlannedResourceSelect = ({ label, fieldName, placeholder, options = [], defaultValue }: Props) => {
  const { t } = useTranslation();
  const comboboxTranslations = useComboboxTranslations();
  const [query, setQuery] = useState(defaultValue?.label ?? "");

  const filteredOptions = useMemo(() => {
    return options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));
  }, [options, query]);

  const collection = useMemo(() => {
    return createListCollection({
      items: filteredOptions,
      itemToString: (item) => item.label,
      itemToValue: (item) => item.value,
    });
  }, [filteredOptions]);

  return (
    <FormField name={fieldName}>
      {({ meta, helpers }) => (
        <FieldRoot invalid={!!meta.error}>
          <ComboboxRoot
            inputValue={query}
            onInputValueChange={(details) => setQuery(details.inputValue)}
            collection={collection}
            positioning={{ placement: "bottom", strategy: "absolute" }}
            defaultValue={defaultValue?.value ? [defaultValue.value] : undefined}
            onValueChange={(details) => helpers.setValue(details.value[0])}
            translations={comboboxTranslations}
          >
            <ComboboxLabel>{t(label)}</ComboboxLabel>
            <FieldErrorMessage>{meta.error}</FieldErrorMessage>
            <GenericComboboxInput triggerable placeholder={t(placeholder)} />
            <ComboboxContent>
              {!collection.items.length && <Text>{t("form.responsible.noResults")}</Text>}
              {collection.items.map((item) => (
                <ComboboxItem item={item} key={item.value}>
                  <ComboboxItemText>{item.label}</ComboboxItemText>
                  <GenericComboboxItemIndicator />
                </ComboboxItem>
              ))}
            </ComboboxContent>
          </ComboboxRoot>
        </FieldRoot>
      )}
    </FormField>
  );
};

export default PlannedResourceSelect;
