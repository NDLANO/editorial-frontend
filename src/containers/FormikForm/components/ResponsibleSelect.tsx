/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useTranslation } from 'react-i18next';
import { Select, Option, SingleValue } from '@ndla/select';
import { useState, useEffect } from 'react';
import sortBy from 'lodash/sortBy';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { useAuth0Responsibles } from '../../../modules/auth0/auth0Queries';
import { DRAFT_WRITE_SCOPE } from '../../../constants';

const Wrapper = styled.div`
  margin-right: ${spacing.normal};
  width: 200px;
`;

interface Props {
  responsible: SingleValue;
  setResponsible: (r: SingleValue) => void;
  onSave: (r: SingleValue) => void;
  responsibleId?: string;
  status?: SingleValue;
}

const ResponsibleSelect = ({
  responsible,
  setResponsible,
  onSave,
  responsibleId,
  status,
}: Props) => {
  const { t } = useTranslation();

  const { data: users, isLoading } = useAuth0Responsibles(
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

  const [sortedUsers, setSortedUsers] = useState<Option[]>([]);
  const [enableRequired, setEnableRequired] = useState(false);

  useEffect(() => {
    if (users) {
      if (responsibleId) {
        const initialResponsible = users.find(user => user.value === responsibleId) ?? null;
        setResponsible(initialResponsible);
      }
      const sortedList = sortBy(users, u => u.label);
      setSortedUsers(sortedList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  useEffect(() => {
    // Enable required styling after responsible is updated first time
    if ((responsible || !responsibleId) && !enableRequired) setEnableRequired(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responsible]);

  const updateResponsible = async (responsible: SingleValue) => {
    onSave(responsible);
  };
  return (
    <Wrapper>
      {status?.value !== 'PUBLISHED' ? (
        <div data-cy="responsible-select">
          <Select<false>
            options={sortedUsers ?? []}
            menuPlacement="top"
            placeholder={t('form.responsible.choose')}
            value={responsible}
            onChange={updateResponsible}
            isLoading={isLoading}
            groupTitle={t('form.responsible.label')}
            noOptionsMessage={() => t('form.responsible.noResults')}
            isSearchable
            isClearable
            closeMenuOnSelect
            required={enableRequired}
          />
        </div>
      ) : null}
    </Wrapper>
  );
};

export default ResponsibleSelect;
