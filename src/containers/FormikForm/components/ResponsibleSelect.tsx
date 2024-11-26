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
import { SelectContent, SelectLabel, SelectRoot, SelectValueText, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { GenericSelectItem, GenericSelectTrigger } from "../../../components/abstractions/Select";
import { DRAFT_RESPONSIBLE } from "../../../constants";
import { useAuth0Responsibles } from "../../../modules/auth0/auth0Queries";

interface Props {
  responsible: string | undefined;
  setResponsible: (userId: string | undefined) => void;
  onSave: (userId: string | undefined) => void;
  responsibleId?: string;
}

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

const ResponsibleSelect = ({ responsible, setResponsible, onSave, responsibleId }: Props) => {
  const { t } = useTranslation();

  const { data: users } = useAuth0Responsibles(
    { permission: DRAFT_RESPONSIBLE },
    {
      select: (users) => sortBy(users, (u) => u.name),
      placeholderData: [],
    },
  );

  const collection = useMemo(() => {
    return createListCollection({
      items: users ?? [],
      itemToValue: (item) => item.app_metadata.ndla_id,
      itemToString: (item) => item.name,
    });
  }, [users]);

  const [enableRequired, setEnableRequired] = useState(false);

  useEffect(() => {
    if (users && responsibleId) {
      const initialResponsible = users.find((user) => user.app_metadata.ndla_id === responsibleId) ?? null;
      setResponsible(initialResponsible?.app_metadata.ndla_id);
    } else {
      setResponsible(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, responsibleId]);

  useEffect(() => {
    // Enable required styling after responsible is updated first time
    if (!enableRequired && (responsible || !responsibleId)) {
      setEnableRequired(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responsible]);

  return (
    <SelectRoot
      data-testid="responsible-select"
      collection={collection}
      onValueChange={(details) => onSave(details.value[0])}
      value={responsible ? [responsible] : []}
      required={enableRequired}
      invalid={enableRequired && !responsible}
      positioning={{ sameWidth: true }}
    >
      <SelectLabel srOnly>{t("form.responsible.choose")}</SelectLabel>
      <GenericSelectTrigger clearable>
        <StyledSelectValueText placeholder={t("form.responsible.choose")} css={{ lineClamp: "1" }} />
      </GenericSelectTrigger>
      <SelectContent>
        {!collection.items.length ? (
          <Text>{t("form.responsible.noResults")}</Text>
        ) : (
          collection.items.map((item) => (
            <StyledGenericSelectItem item={item} key={item.app_metadata.ndla_id}>
              {item.name}
            </StyledGenericSelectItem>
          ))
        )}
      </SelectContent>
    </SelectRoot>
  );
};

export default ResponsibleSelect;
