/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useTranslation } from 'react-i18next';
import { Select, SingleValue, Option } from '@ndla/select';
import { useEffect, useState } from 'react';
import { IStatus as DraftStatus } from '@ndla/types-draft-api';
import { ConceptStatusStateMachineType, DraftStatusStateMachineType } from '../../../interfaces';
import { PUBLISHED } from '../../../constants';

interface Props {
  status: SingleValue;
  setStatus: (s: SingleValue) => void;
  onSave: (s: SingleValue) => void;
  statusStateMachine?: ConceptStatusStateMachineType | DraftStatusStateMachineType;
  entityStatus?: DraftStatus;
}

const StatusSelect = ({ status, setStatus, onSave, statusStateMachine, entityStatus }: Props) => {
  const { t } = useTranslation();

  const transformStatus = (status: string) => ({
    label: t(`form.status.actions.${status}`),
    value: status,
  });

  const [options, setOptions] = useState<Option[]>([]);
  const optionsWithGroupTitle = [{ label: t('editorFooter.statusLabel'), options: options }];

  useEffect(() => {
    if (entityStatus && statusStateMachine) {
      const statuses =
        statusStateMachine[entityStatus.current]?.map((s) => transformStatus(s)) ?? [];
      setOptions(statuses);
      if (entityStatus.current === PUBLISHED) {
        setStatus({ label: t(`form.status.published`), value: PUBLISHED });
      } else {
        const initialStatus =
          statuses.find((s) => s.value.toLowerCase() === entityStatus.current.toLowerCase()) ??
          null;

        setStatus(initialStatus);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityStatus, statusStateMachine]);

  const updateStatus = async (status: SingleValue) => {
    if (status) {
      onSave(status);
    }
  };

  return (
    <Select<false>
      options={optionsWithGroupTitle}
      menuPlacement="top"
      placeholder={t('searchForm.types.status')}
      value={status}
      onChange={updateStatus}
      closeMenuOnSelect
    />
  );
};

export default StatusSelect;
