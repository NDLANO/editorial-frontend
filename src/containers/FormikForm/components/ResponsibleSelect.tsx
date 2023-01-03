/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useTranslation } from 'react-i18next';
import { Select, Option } from '@ndla/select';
import { useState, useEffect } from 'react';
import sortBy from 'lodash/sortBy';
import { useAuth0Editors } from '../../../modules/auth0/auth0Queries';
import { DRAFT_WRITE_SCOPE } from '../../../constants';

interface Props {
  onSave: (responsibleId: string) => void;
  responsibleId?: string;
}

const ResponsibleSelect = ({ onSave, responsibleId }: Props) => {
  const { t } = useTranslation();

  const { data: users, isLoading } = useAuth0Editors(
    { permission: DRAFT_WRITE_SCOPE },
    {
      select: users =>
        users.map(u => ({
          value: `${u.app_metadata.ndla_id}`,
          label: u.name,
        })),
      placeholderData: [],
    },
  );

  const [responsible, setResponsible] = useState<Option>();
  const [sortedUsers, setSortedUsers] = useState<Option[]>([]);

  useEffect(() => {
    if (users) {
      const defaultResponsible = users.find(user => user.value === responsibleId);
      setResponsible(defaultResponsible);

      const sortedList = sortBy(users, u => u.label);
      setSortedUsers(sortedList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  const updateResponsible = async (responsible: Option) => {
    if (responsible) {
      setResponsible(responsible);
      onSave(responsible.value);
    }
  };

  return (
    <Select<false>
      options={sortedUsers ?? []}
      menuPlacement="top"
      placeholder={t('form.responsible.label')}
      value={responsible}
      onChange={updateResponsible}
      isMultiSelect={false}
      isLoading={isLoading}
    />
  );
};

export default ResponsibleSelect;
