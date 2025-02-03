/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import sortBy from "lodash/sortBy";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection } from "@ark-ui/react";
import { ComboboxContent, ComboboxItem, ComboboxItemText, ComboboxLabel, ComboboxRoot, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useComboboxTranslations } from "@ndla/ui";
import { GenericComboboxInput, GenericComboboxItemIndicator } from "../../../components/abstractions/Combobox";
import { DRAFT_RESPONSIBLE } from "../../../constants";
import { useAuth0Responsibles } from "../../../modules/auth0/auth0Queries";

interface Props {
  responsible: string | undefined;
  onSave: (userId: string | undefined) => void;
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

const StyledComboboxRoot = styled(ComboboxRoot, {
  base: {
    flex: "1",
    minWidth: "surface.xxsmall",
  },
});

const ResponsibleSelect = ({ responsible, onSave }: Props) => {
  const { t } = useTranslation();
  const comboboxTranslations = useComboboxTranslations();
  const [query, setQuery] = useState("");

  const { data: users } = useAuth0Responsibles(
    { permission: DRAFT_RESPONSIBLE },
    {
      select: (users) => sortBy(users, (u) => u.name),
      placeholderData: [],
    },
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

  return (
    <StyledComboboxRoot
      data-testid="responsible-select"
      collection={collection}
      translations={comboboxTranslations}
      onValueChange={(details) => onSave(details.value[0])}
      onInputValueChange={(details) => setQuery(details.inputValue)}
      inputValue={query}
      value={responsible ? [responsible] : []}
      required={true}
      invalid={!responsible}
      positioning={{ sameWidth: true }}
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
