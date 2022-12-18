/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useTranslation } from 'react-i18next';
import { Select, ControlPropsType, SingleValue } from '@ndla/select';
import { spacing, colors } from '@ndla/core';
import styled from '@emotion/styled';
import { ButtonV2 as Button } from '@ndla/button';
import { useState, useEffect } from 'react';
import { ChevronDown } from '@ndla/icons/common';
import { useAuth0Editors } from '../../../modules/auth0/auth0Queries';
import { DRAFT_WRITE_SCOPE } from '../../../constants';

const Wrapper = styled.div`
  width: 200px;
`;

const StyledButton = styled(Button)`
  width: 200px;
  display: flex;
  justify-content: space-between;
  padding: ${spacing.small};
  text-align: center;
  border: none;

  &:focus {
    color: ${colors.brand.primary};
    background-color: ${colors.brand.lighter};
    outline: 2px solid ${colors.brand.dark};
  }
`;
const StyledChevron = styled(ChevronDown)`
  width: 26px;
  height: 26px;
`;

const CustomControl = (props: ControlPropsType<false>) => {
  return (
    <div ref={props.innerRef} {...props.innerProps}>
      <StyledButton size="large" colorTheme="lighter">
        {props.children} <StyledChevron />
      </StyledButton>
    </div>
  );
};

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

  const [responsible, setResponsible] = useState<SingleValue>();

  useEffect(() => {
    if (users) {
      const defaultResponsible = users.find(user => user.value === responsibleId);
      setResponsible(defaultResponsible);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  const updateResponsible = async (responsible: SingleValue) => {
    if (responsible) {
      setResponsible(responsible);
      onSave(responsible.value);
    }
  };

  return (
    <Select
      options={users ?? []}
      menuPlacement="top"
      placeholder={t('form.responsible.label')}
      ControlComponent={CustomControl}
      value={responsible}
      onChange={updateResponsible}
      isMultiSelect={false}
      isLoading={isLoading}
    />
  );
};

export default ResponsibleSelect;
