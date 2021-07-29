/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useEffect, useState } from 'react';
import { injectT, tType } from '@ndla/i18n';
import Button from '@ndla/button';
import { Plus, Pencil } from '@ndla/icons/action';
import { DeleteForever } from '@ndla/icons/editor';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';

import { updateSubjectMetadata, updateTopicMetadata } from '../../../../modules/taxonomy';
import RoundIcon from '../../../../components/RoundIcon';
import { convertGrepCodesToObject } from '../../../FormikForm/GrepCodesFieldContent';
import MenuItemButton from './MenuItemButton';
import MenuItemEditField from '../menuOptions/MenuItemEditField';
import { EditMode } from '../SettingsMenu';

interface Props {
  editMode: string;
  getAllSubjects: () => Promise<void>;
  id: string;
  name: string;
  menuType: 'subject' | 'topic';
  metadata: { grepCodes: string[]; visible: boolean };
  refreshTopics: () => Promise<void>;
  toggleEditMode: (mode: EditMode) => void;
}

interface GrepCode {
  code: string;
  title: string | undefined | null;
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

const EditGrepCodes = ({ editMode, id, menuType, metadata, t, toggleEditMode }: Props & tType) => {
  const [grepCodes, setGrepCodes] = useState(metadata?.grepCodes);
  const [addingNewGrepCode, setAddingNewGrepCode] = useState(false);
  const [grepCodesWithName, setGrepCodesWithName] = useState<GrepCode[]>([]);

  const updateMetadata = async (codes: string[]) => {
    switch (menuType) {
      case 'subject': {
        await updateSubjectMetadata(id, {
          grepCodes: codes,
          visible: metadata.visible,
        });
        setGrepCodes(codes);
        grepCodeDescriptionTitle();
        break;
      }

      case 'topic': {
        await updateTopicMetadata(id, {
          grepCodes: codes,
          visible: metadata.visible,
        });
        setGrepCodes(codes);
        grepCodeDescriptionTitle();
        break;
      }

      default:
        return null;
    }
  };

  const toggleEditModes = () => {
    toggleEditMode('editGrepCodes');
  };

  useEffect(() => {
    grepCodeDescriptionTitle();
  }, [editMode, grepCodes, addingNewGrepCode]); // eslint-disable-line react-hooks/exhaustive-deps

  const addGrepCode = async (grepCode: string) => {
    grepCodes.push(grepCode.toUpperCase());
    updateMetadata(grepCodes);
  };

  const deleteGrepCode = (position: number) => {
    grepCodes.splice(position, 1);
    updateMetadata(grepCodes);
  };

  const grepCodeDescriptionTitle = async () => {
    const withName = await convertGrepCodesToObject(grepCodes);
    setGrepCodesWithName(withName);
  };

  const grepCodesList = (
    <DropDownWrapper>
      {grepCodesWithName?.length > 0 ? (
        grepCodesWithName.map((grepCode, index) => {
          return (
            <StyledGrepItem key={index}>
              {grepCode.title}
              <Button stripped data-testid="deleteGrepCode" onClick={() => deleteGrepCode(index)}>
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

export default injectT(EditGrepCodes);
