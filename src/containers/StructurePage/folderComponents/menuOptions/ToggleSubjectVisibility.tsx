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

import { updateSubjectMetadata } from '../../../../modules/taxonomy';
import RoundIcon from '../../../../components/RoundIcon';
import ToggleSwitch from '../../../../components/ToggleSwitch';
import { TranslateType } from '../../../../interfaces';
import MenuItemButton from './MenuItemButton';

interface Props {
  id: string;
  editMode: string;
  name: string;
  metadata: { grepCodes: string[]; visible: boolean };
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

const ToggleSubjectVisibility: FC<Props> = ({
  id,
  editMode,
  name,
  metadata,
  t,
  toggleEditMode,
}) => {
  const [visible, setVisible] = useState(metadata.visible);

  const updateMetadata = async (visible: boolean) => {
    // TODO: handle error
    await updateSubjectMetadata(id, {
      grepCodes: metadata.grepCodes,
      visible: !visible,
    });
    setVisible(!visible);
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
      />
    </DropDownWrapper>
  ) : (
    <DropDownWrapper>
      {name} {t('metadata.notVisible')}
      <ToggleSwitch
        onClick={() => updateMetadata(visible)}
        on={visible}
        testId="toggleVisible"
      />
    </DropDownWrapper>
  );

  return (
    <>
      <MenuItemButton
        stripped
        data-testid="toggleSubjectVisibilityButton"
        onClick={() => toggleEditModes()}>
        <RoundIcon small icon={<Eye />} />
        {t('metadata.changeVisibility')}
      </MenuItemButton>
      {editMode === 'toggleMetadataVisibility' && ToggleMenu}
    </>
  );
};

export default injectT(ToggleSubjectVisibility);
