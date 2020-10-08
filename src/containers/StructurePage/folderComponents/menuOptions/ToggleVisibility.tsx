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
import { Switch } from '@ndla/switch';

import {
  updateSubjectMetadata,
  updateTopicMetadata,
} from '../../../../modules/taxonomy';
import RoundIcon from '../../../../components/RoundIcon';
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
  setResourcesUpdated: Function;
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
  setResourcesUpdated,
  t,
  toggleEditMode,
}) => {
  const [visible, setVisible] = useState(metadata?.visible);

  const toggleVisibility = async () => {
    switch (menuType) {
      case 'subject': {
        await updateSubjectMetadata(id, {
          grepCodes: metadata.grepCodes,
          visible: !visible,
        });
        setVisible(!visible);
        getAllSubjects();
        refreshTopics();
        setResourcesUpdated(true);
        break;
      }

      case 'topic': {
        await updateTopicMetadata(id, {
          grepCodes: metadata.grepCodes,
          visible: !visible,
        });
        setVisible(!visible);
        refreshTopics();
        setResourcesUpdated(true);
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

  const toggle = visible ? (
    <DropDownWrapper>
      {name} {t('metadata.visible')}
      <Switch
        onChange={toggleVisibility}
        checked={metadata?.visible}
        label=""
        id={'visible'}
      />
    </DropDownWrapper>
  ) : (
    <DropDownWrapper>
      {name} {t('metadata.notVisible')}
      <Switch
        onChange={toggleVisibility}
        checked={metadata?.visible}
        label=""
        id={'visible'}
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
      {editMode === 'toggleMetadataVisibility' && toggle}
    </>
  );
};

export default injectT(ToggleVisibility);
