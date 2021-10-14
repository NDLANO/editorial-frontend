/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye } from '@ndla/icons/editor';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { Switch } from '@ndla/switch';

import RoundIcon from '../../../../components/RoundIcon';
import MenuItemButton from './MenuItemButton';
import { EditMode } from '../../../../interfaces';
import { useUpdateSubjectMetadata } from '../../../../modules/taxonomy/subjects/subjectsQueries';
import { useTopicMetadataUpdateMutation } from '../../../../modules/taxonomy/topics/topicQueries';

interface Props {
  editMode: string;
  id: string;
  name: string;
  menuType: 'subject' | 'topic';
  metadata: { grepCodes: string[]; visible: boolean };
  toggleEditMode: (mode: EditMode) => void;
}

export const DropDownWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  background-color: white;
  padding: calc(${spacing.small} / 2);
`;

const ToggleVisibility = ({ editMode, id, name, menuType, metadata, toggleEditMode }: Props) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(metadata?.visible);
  const { mutateAsync: updateSubjectMetadata } = useUpdateSubjectMetadata();
  const { mutateAsync: updateTopicMetadata } = useTopicMetadataUpdateMutation();

  const toggleVisibility = async () => {
    const func = menuType === 'subject' ? updateSubjectMetadata : updateTopicMetadata;
    await func({ id, metadata: { grepCodes: metadata.grepCodes, visible: !visible } });
    setVisible(!visible);
  };

  const toggleEditModes = () => {
    toggleEditMode('toggleMetadataVisibility');
  };

  const toggle = visible ? (
    <DropDownWrapper>
      {name} {t('metadata.visible')}
      <Switch onChange={toggleVisibility} checked={visible} label="" id={'visible'} />
    </DropDownWrapper>
  ) : (
    <DropDownWrapper>
      {name} {t('metadata.notVisible')}
      <Switch onChange={toggleVisibility} checked={visible} label="" id={'visible'} />
    </DropDownWrapper>
  );

  return (
    <>
      <MenuItemButton
        stripped
        data-testid="toggleVisibilityButton"
        onClick={() => toggleEditModes()}>
        <RoundIcon small icon={<Eye />} />
        {t('metadata.changeVisibility')}
      </MenuItemButton>
      {editMode === 'toggleMetadataVisibility' && toggle}
    </>
  );
};

export default ToggleVisibility;
