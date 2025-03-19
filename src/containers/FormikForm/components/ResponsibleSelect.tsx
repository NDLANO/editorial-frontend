/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ComboboxInputValueChangeDetails, ComboboxValueChangeDetails, createListCollection } from "@ark-ui/react";
import { ComboboxContent, ComboboxItem, ComboboxItemText, ComboboxLabel, ComboboxRoot, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useComboboxTranslations } from "@ndla/ui";
import { GenericComboboxInput, GenericComboboxItemIndicator } from "../../../components/abstractions/Combobox";
import { DRAFT_RESPONSIBLE } from "../../../constants";
import { Auth0UserData } from "../../../interfaces";
import { useAuth0Responsibles } from "../../../modules/auth0/auth0Queries";

interface Props {
  responsible: string | undefined;
  onSave: (userId: string | null) => void;
}

const StyledComboboxItem = styled(ComboboxItem, {
  base: {
    overflowWrap: "anywhere",
  },
});

const StyledGenericComboboxInput = styled(GenericComboboxInput, {
  base: {
    width: "100%",
  },
});

const StyledComboboxRoot = styled(ComboboxRoot<Auth0UserData>, {
  base: {
    flex: "1",
    minWidth: "surface.xxsmall",
  },
});

const positioning = { sameWidth: true };

const ResponsibleSelect = ({ responsible, onSave }: Props) => {
  const { t } = useTranslation();
  const comboboxTranslations = useComboboxTranslations();
  const [query, setQuery] = useState("");

  const { data: users } = useAuth0Responsibles<Auth0UserData[]>(
    { permission: DRAFT_RESPONSIBLE },
    { placeholderData: [] },
  );

  const collection = useMemo(() => {
    return createListCollection({
      items: users?.filter((item) => item.name.toLowerCase().includes(query.toLowerCase())) ?? [],
      itemToValue: (item) => item.app_metadata.ndla_id,
      itemToString: (item) => item.name,
    });
  }, [query, users]);

  useEffect(() => {
    if (users && responsible) {
      const initialResponsible = users.find((user) => user.app_metadata.ndla_id === responsible) ?? null;
      setQuery(initialResponsible?.name ?? "");
    }
  }, [users, responsible]);

  const onValueChange = useCallback(
    (details: ComboboxValueChangeDetails) => {
      onSave(details.value[0] ?? null);
    },
    [onSave],
  );

  const onInputValueChange = useCallback((details: ComboboxInputValueChangeDetails) => {
    setQuery(details.inputValue);
  }, []);

  const value = useMemo(() => (responsible ? [responsible] : []), [responsible]);

  return (
    <StyledComboboxRoot
      data-testid="responsible-select"
      collection={collection}
      translations={comboboxTranslations}
      onValueChange={onValueChange}
      onInputValueChange={onInputValueChange}
      inputValue={query}
      value={value}
      required={true}
      invalid={!responsible}
      positioning={positioning}
    >
      <ComboboxLabel srOnly>{t("form.responsible.choose")}</ComboboxLabel>
      <StyledGenericComboboxInput clearable triggerable placeholder={t("form.responsible.choose")} />
      <ComboboxContent>
        {!collection.items.length ? (
          <Text>{t("form.responsible.noResults")}</Text>
        ) : (
          collection.items.map((item) => (
            <StyledComboboxItem item={item} key={item.app_metadata.ndla_id}>
              <ComboboxItemText>{item.name}</ComboboxItemText>
              <GenericComboboxItemIndicator />
            </StyledComboboxItem>
          ))
        )}
      </ComboboxContent>
    </StyledComboboxRoot>
  );
};

export default ResponsibleSelect;
