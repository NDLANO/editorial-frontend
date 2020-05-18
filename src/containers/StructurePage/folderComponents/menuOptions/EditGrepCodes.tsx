/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { FC, useEffect, useState } from 'react';
import { injectT } from '@ndla/i18n';
import Button from '@ndla/button';
import { Plus, Pencil } from '@ndla/icons/action';
import { DeleteForever } from '@ndla/icons/editor';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';

// import { updateSubjectMetadata } from '../../../../modules/taxonomy';
import RoundIcon from '../../../../components/RoundIcon';
import { TranslateType } from '../../../../interfaces';
import MenuItemButton from './MenuItemButton';
import MenuItemEditField from '../menuOptions/MenuItemEditField';

interface Props {
  editMode: string;
  getAllSubjects: Function;
  id: string;
  name: string;
  metadata: { grepCodes: GrepCode[]; visible: boolean };
  refreshTopics: Function;
  t: TranslateType;
  toggleEditMode: Function;
}

interface GrepCode {
  id: string;
  code: string;
  title: string | undefined | null;
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
  const [grepCodes, setGrepCodes] = useState(['TT1', 'TT2']);
  const [addingNewGrepCode, setAddingNewGrepCode] = useState(false);

  // const updateMetadata = async (grepCodes: boolean) => {
  //   await updateSubjectMetadata(id, {
  //     grepCodes: grepCodes,
  //     visible: metadata.visible,
  //   });
  //   getAllSubjects();
  //   refreshTopics();
  // };

  const toggleEditModes = () => {
    toggleEditMode('editGrepCodes');
  };

  useEffect(() => {}, [editMode, grepCodes, addingNewGrepCode]);

  const addGrepCode = (getpCode: string) => {
    grepCodes.push(getpCode);
    console.log(grepCodes);
  };

  const grepCodesList = (
    <>
      {grepCodes.length === 0 ? (
        <ul>
          <li>Empty array</li>
        </ul>
      ) : (
        grepCodes.map((grepCode, index) => (
          <div>
            {grepCode}
            <div style={{ display: 'flex' }}>
              <Button
                disabled
                stripped
                data-testid={`editGrepCode${grepCode}`}
                onClick={() => console.log(index)}>
                <RoundIcon small icon={<Pencil />} />
              </Button>
              <Button
                stripped
                data-testid="deleteGrepCode"
                onClick={() => console.log(grepCode)}>
                <RoundIcon small icon={<DeleteForever />} />
              </Button>
            </div>
          </div>
        ))
      )}
      {addingNewGrepCode ? (
        <MenuItemEditField
          currentVal=""
          messages={{ errorMessage: t('taxonomy.errorMessage') }}
          dataTestid="addGrepCopde"
          onClose={() => setAddingNewGrepCode(!addingNewGrepCode)}
          onSubmit={addGrepCode}
          icon={<Pencil />}
          placeholder={t('form.grepCodes.placeholder')}
        />
      ) : (
        <Button
          stripped
          data-testid="addFilterButton"
          onClick={() => setAddingNewGrepCode(!addingNewGrepCode)}>
          <RoundIcon small icon={<Plus />} />
          Add grep code
        </Button>
      )}
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
      {editMode === 'editGrepCodes' && grepCodesList}
    </>
  );
};

export default injectT(EditGrepCodes);
