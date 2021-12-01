/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@ndla/button';
import { Plus, Pencil } from '@ndla/icons/action';
import { DeleteForever } from '@ndla/icons/editor';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';

import RoundIcon from '../../../../components/RoundIcon';
import MenuItemButton from './components/MenuItemButton';
import MenuItemEditField from './components/MenuItemEditField';
import { useGrepCodes } from '../../../../modules/grep/grepQueries';
import Spinner from '../../../../components/Spinner';
import { NodeType } from '../../../../modules/taxonomy/nodes/nodeApiTypes';
import { useUpdateNodeMetadataMutation } from '../../../../modules/taxonomy/nodes/nodeMutations';
import { EditModeHandler } from '../SettingsMenuDropdownType';

interface Props {
  editModeHandler: EditModeHandler;
  node: NodeType;
}

export const DropDownWrapper = styled('div')`
  font-size: 0.9rem;
  background-color: white;
  padding: calc(${spacing.small} / 2);
`;

const StyledGrepItem = styled('div')`
  display: flex;
  justify-content: space-between;
  margin: calc(var(--spacing--small) / 2);
`;

const EditGrepCodes = ({ node, editModeHandler: { editMode, toggleEditMode } }: Props) => {
  const { t } = useTranslation();
  const { id, metadata } = node;
  const [grepCodes, setGrepCodes] = useState<string[]>(metadata?.grepCodes ?? []);
  const [addingNewGrepCode, setAddingNewGrepCode] = useState(false);
  const { mutateAsync: patchMetadata } = useUpdateNodeMetadataMutation();
  const grepCodesWithName = useGrepCodes(grepCodes, editMode === 'editGrepCodes');

  const updateMetadata = async (codes: string[]) => {
    await patchMetadata({ id, metadata: { grepCodes: codes, visible: metadata.visible } });
    setGrepCodes(codes);
  };

  const toggleEditModes = () => toggleEditMode('editGrepCodes');

  const addGrepCode = async (code: string) => updateMetadata([...grepCodes, code.toUpperCase()]);

  const deleteGrepCode = (code: string) => updateMetadata(grepCodes.filter(c => c !== code));

  const grepCodesList = (
    <DropDownWrapper>
      {grepCodesWithName?.length > 0 ? (
        grepCodesWithName.map((grepCode, index) => {
          if (grepCode.isLoading) {
            return <Spinner key={index} />;
          }
          if (!grepCode.data) {
            return null;
          }
          return (
            <StyledGrepItem key={index}>
              {grepCode.data.title}
              <Button
                stripped
                data-testid="deleteGrepCode"
                onClick={() => deleteGrepCode(grepCode.data.code)}>
                <RoundIcon small icon={<DeleteForever />} />
              </Button>
            </StyledGrepItem>
          );
        })
      ) : (
        <p>{t('taxonomy.grepCodes.empty')}</p>
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
          <Plus />
          {t('taxonomy.grepCodes.addNew')}
        </Button>
      )}
    </DropDownWrapper>
  );

  return (
    <>
      <MenuItemButton stripped data-testid="editGrepCodes" onClick={() => toggleEditModes()}>
        <RoundIcon small icon={<Pencil />} />
        {t('taxonomy.grepCodes.edit')}
      </MenuItemButton>
      {editMode === 'editGrepCodes' && grepCodesList}
    </>
  );
};

export default EditGrepCodes;
