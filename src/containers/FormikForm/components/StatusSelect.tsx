/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { createListCollection } from "@ark-ui/react";
import { SelectContent, SelectLabel, SelectRoot, SelectValueText } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { IStatusDTO as DraftStatus } from "@ndla/types-backend/draft-api";
import { GenericSelectItem, GenericSelectTrigger } from "../../../components/abstractions/Select";
import { PUBLISHED } from "../../../constants";
import { ConceptStatusStateMachineType, DraftStatusStateMachineType } from "../../../interfaces";

interface Props {
  status: string | undefined;
  setStatus: (s: string | undefined) => void;
  onSave: (s: string | undefined) => void;
  statusStateMachine?: ConceptStatusStateMachineType | DraftStatusStateMachineType;
  entityStatus?: DraftStatus;
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

const StyledSelectRoot = styled(SelectRoot, {
  base: {
    flex: "1",
  },
});

const StatusSelect = ({ status, setStatus, onSave, statusStateMachine, entityStatus }: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (entityStatus && statusStateMachine) {
      setStatus(entityStatus.current);
      const initialStatus = statusStateMachine[entityStatus.current].find(
        (s) => s.toLowerCase() === entityStatus.current.toLowerCase(),
      );
      setStatus(initialStatus);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityStatus, statusStateMachine]);

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

  return (
    <StyledSelectRoot
      key={status === undefined ? entityStatus?.current : undefined}
      collection={collection}
      positioning={{ sameWidth: true }}
      data-testid="status-select"
      value={status ? [status] : undefined}
      onValueChange={(details) => onSave(details.value[0])}
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
