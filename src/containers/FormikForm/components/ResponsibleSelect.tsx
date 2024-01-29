/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import sortBy from "lodash/sortBy";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Select, SingleValue } from "@ndla/select";
import { DRAFT_RESPONSIBLE } from "../../../constants";
import { useAuth0Responsibles } from "../../../modules/auth0/auth0Queries";

interface Props {
  responsible: SingleValue;
  setResponsible: (r: SingleValue) => void;
  onSave: (r: SingleValue) => void;
  responsibleId?: string;
}

const ResponsibleSelect = ({ responsible, setResponsible, onSave, responsibleId }: Props) => {
  const { t } = useTranslation();

  const { data: users, isLoading } = useAuth0Responsibles(
    { permission: DRAFT_RESPONSIBLE },
    {
      select: (users) =>
        sortBy(
          users.map((u) => ({
            value: `${u.app_metadata.ndla_id}`,
            label: u.name,
          })),
          (u) => u.label,
        ),
      placeholderData: [],
    },
  );
  const optionsWithGroupTitle = useMemo(
    () => [{ label: t("form.responsible.label"), options: users ?? [] }],
    [t, users],
  );

  const noOptionsMessage = useMemo(() => () => t("form.responsible.noResults"), [t]);

  const [enableRequired, setEnableRequired] = useState(false);

  useEffect(() => {
    if (users && responsibleId) {
      const initialResponsible = users.find((user) => user.value === responsibleId) ?? null;
      setResponsible(initialResponsible);
    } else {
      setResponsible(null);
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

  const updateResponsible = useCallback(
    async (responsible: SingleValue) => {
      onSave(responsible);
    },
    [onSave],
  );

  return (
    <div data-testid="responsible-select">
      <Select<false>
        options={optionsWithGroupTitle}
        menuPlacement="top"
        placeholder={t("form.responsible.choose")}
        value={responsible}
        onChange={updateResponsible}
        isLoading={isLoading}
        noOptionsMessage={noOptionsMessage}
        isSearchable
        isClearable
        closeMenuOnSelect
        required={enableRequired}
      />
    </div>
  );
};

export default ResponsibleSelect;
