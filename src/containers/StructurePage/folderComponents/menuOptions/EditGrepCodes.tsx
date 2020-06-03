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

import {
  updateSubjectMetadata,
  updateTopicMetadata,
} from '../../../../modules/taxonomy';
import RoundIcon from '../../../../components/RoundIcon';
import { TranslateType } from '../../../../interfaces';
import { convertGrepCodesToObject } from '../../../FormikForm/FormikGrepCodesContent';
import MenuItemButton from './MenuItemButton';
import MenuItemEditField from '../menuOptions/MenuItemEditField';

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

interface GrepCode {
  code: string;
  title: string | undefined | null;
}

enum MenuType {
  subject = 'subject',
  topic = 'topic',
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

const EditGrepCodes: FC<Props> = ({
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
  }, [editMode, grepCodes, addingNewGrepCode]);

  const addGrepCode = (grepCode: string) => {
    grepCodes.push(grepCode.toUpperCase());
    updateMetadata(grepCodes);
  };

  const deleteGrepCode = (position: number) => {
    grepCodes.splice(position, 1);
    updateMetadata(grepCodes);
  };

  const grepCodeDescriptionTitle = async () => {
    const withName = await convertGrepCodesToObject(grepCodes);
    console.log(withName);
    setGrepCodesWithName(withName);
  };

  const grepCodesList = (
    <DropDownWrapper>
      {grepCodesWithName?.length > 0 ? (
        grepCodesWithName.map((grepCode, index) => {
          return (
            <StyledGrepItem>
              {grepCode.title}
              <Button
                stripped
                data-testid="deleteGrepCode"
                onClick={() => deleteGrepCode(index)}>
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
      <MenuItemButton
        stripped
        data-testid="editGrepCodes"
        onClick={() => toggleEditModes()}>
        <RoundIcon small icon={<Pencil />} />
        {t('taxonomy.grepCodes.edit')}
      </MenuItemButton>
      {editMode === 'editGrepCodes' && grepCodesList}
    </>
  );
};

export default injectT(EditGrepCodes);
