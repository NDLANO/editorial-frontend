/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC, useEffect, useState } from 'react';
import { injectT } from '@ndla/i18n';
import { Pencil } from '@ndla/icons/action';
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

interface Props {
  editMode: string;
  getAllSubjects: Function;
  id: string;
  name: string;
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

const EditGrepCodes: FC<Props> = ({
  editMode,
  getAllSubjects,
  id,
  name,
  metadata,
  refreshTopics,
  t,
  toggleEditMode,
}) => {
  const [grepCodes, setGrepCodes] = useState(metadata?.grepCodes);

  const updateMetadata = async (grepCodes: boolean) => {
    await updateSubjectMetadata(id, {
      grepCodes: grepCodes,
      visible: metadata.visible,
    });
    getAllSubjects();
    refreshTopics();
  };

  const toggleEditModes = () => {
    toggleEditMode('editGrepCodes');
  };

  useEffect(() => {}, [editMode]);

  const addGrepCode = () => {
    grepCodes.push('A1');
    console.log(grepCodes);
  };

  const ToggleMenu = (
    <>
      <ul>
        {metadata?.grepCodes.length === 0 ? (
          <li>Empty array</li>
        ) : (
          metadata?.grepCodes.map(grepCode => <li>{grepCode}</li>)
        )}
      </ul>
      <button onClick={() => addGrepCode()}>add grep code</button>
    </>
  );

  return (
    <>
      <MenuItemButton
        stripped
        data-testid="editGrepCodes"
        onClick={() => toggleEditModes()}>
        <RoundIcon small icon={<Pencil />} />
        Edit grep code
      </MenuItemButton>
      {editMode === 'editGrepCodes' && ToggleMenu}
    </>
  );
};

export default injectT(EditGrepCodes);
