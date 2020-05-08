/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC, useEffect, useState } from 'react';
import { injectT } from '@ndla/i18n';
import { Eye } from '@ndla/icons/editor';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';

import {
  updateSubjectMetadata,
  updateTopicMetadata,
} from '../../../../modules/taxonomy';
import RoundIcon from '../../../../components/RoundIcon';
import ToggleSwitch from '../../../../components/ToggleSwitch';
import { TranslateType } from '../../../../interfaces';
import MenuItemButton from './MenuItemButton';

enum MenuType {
  subject = 'subject',
  topic = 'topic',
}

interface Props {
  editMode: string;
  getAllSubjects: Function;
  id: string;
  name: string;
  menuType: MenuType;
  metadata: { grepCodes: string[]; visible: boolean };
  refreshTopics: Function;
  t: TranslateType;
  toggleEditMode: Function;
}

export const DropDownWrapper = styled('div')`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  background-color: white;
  padding: calc(${spacing.small} / 2);
`;

const ToggleVisibility: FC<Props> = ({
  editMode,
  getAllSubjects,
  id,
  name,
  menuType,
  metadata,
  refreshTopics,
  t,
  toggleEditMode,
}) => {
  const [visible, setVisible] = useState(metadata?.visible);

  const updateMetadata = async (visible: boolean) => {
    switch (menuType) {
      case 'subject': {
        await updateSubjectMetadata(id, {
          grepCodes: metadata.grepCodes,
          visible: !visible,
        });
        setVisible(!visible);
        getAllSubjects();
        break;
      }

      case 'topic': {
        await updateTopicMetadata(id, {
          grepCodes: metadata.grepCodes,
          visible: !visible,
        });
        setVisible(!visible);
        refreshTopics();
        break;
      }

      default:
        return null;
    }
  };

  const toggleEditModes = () => {
    toggleEditMode('toggleMetadataVisibility');
  };

  useEffect(() => {}, [editMode]);

  const ToggleMenu = visible ? (
    <DropDownWrapper>
      {name} {t('metadata.visible')}
      <ToggleSwitch
        onClick={() => updateMetadata(visible)}
        on={visible}
        testId="toggleVisible"
        offLabel=""
        onLabel=""
      />
    </DropDownWrapper>
  ) : (
    <DropDownWrapper>
      {name} {t('metadata.notVisible')}
      <ToggleSwitch
        onClick={() => updateMetadata(visible)}
        on={visible}
        testId="toggleVisible"
        offLabel=""
        onLabel=""
      />
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
      {editMode === 'toggleMetadataVisibility' && ToggleMenu}
    </>
  );
};

export default injectT(ToggleVisibility);
