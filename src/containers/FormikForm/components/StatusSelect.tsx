/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection, SelectValueChangeDetails } from "@ark-ui/react";
import { SelectContent, SelectLabel, SelectRoot, SelectValueText } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IStatusDTO as DraftStatus } from "@ndla/types-backend/draft-api";
import { GenericSelectItem, GenericSelectTrigger } from "../../../components/abstractions/Select";
import { PUBLISHED } from "../../../constants";
import { ConceptStatusStateMachineType, DraftStatusStateMachineType } from "../../../interfaces";

interface Props {
  status: DraftStatus | undefined;
  updateStatus: (s: string | undefined) => void;
  statusStateMachine?: ConceptStatusStateMachineType | DraftStatusStateMachineType;
  entityStatus: DraftStatus | undefined;
}

const StyledSelectValueText = styled(SelectValueText, {
  base: {
    lineClamp: "1",
  },
});

const StyledGenericSelectTrigger = styled(GenericSelectTrigger, {
  base: {
    width: "100%",
    minWidth: "surface.xxsmall",
  },
});

const StyledSelectRoot = styled(SelectRoot<StatusItem>, {
  base: {
    flex: "1",
  },
});

interface StatusItem {
  label: string;
  status: string;
}

const positioning = { sameWidth: true };

const StatusSelect = ({ status, updateStatus, statusStateMachine, entityStatus }: Props) => {
  const { t } = useTranslation();

  const collection = useMemo(() => {
    const items =
      statusStateMachine && entityStatus
        ? statusStateMachine[entityStatus.current].map((status) => ({
            label: t(`form.status.actions.${status}`),
            status,
          }))
        : [];

    return createListCollection({ items, itemToValue: (item) => item.status, itemToString: (item) => item.label });
  }, [entityStatus, statusStateMachine, t]);

  const value = useMemo(() => (status ? [status.current] : []), [status]);

  const onValueChange = useCallback(
    (details: SelectValueChangeDetails) => {
      updateStatus(details.value[0]);
    },
    [updateStatus],
  );

  return (
    <StyledSelectRoot
      key={status === undefined ? entityStatus?.current : undefined}
      collection={collection}
      positioning={positioning}
      data-testid="status-select"
      value={value}
      onValueChange={onValueChange}
    >
      <SelectLabel srOnly>{t("searchForm.types.status")}</SelectLabel>
      <StyledGenericSelectTrigger>
        <StyledSelectValueText
          placeholder={entityStatus?.current === PUBLISHED ? t("form.status.published") : t("searchForm.types.status")}
        />
      </StyledGenericSelectTrigger>
      <SelectContent>
        {collection.items.map((item) => (
          <GenericSelectItem item={item} key={item.status}>
            {item.label}
          </GenericSelectItem>
        ))}
      </SelectContent>
    </StyledSelectRoot>
  );
};

export default StatusSelect;
